import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateDestinationDto } from './dto/create-destination-dto';
import { FlightRoute } from './entities/flight-route.entity';
import { CreateFlightRouteDto } from './dto/create-flight-route-dto';
import { SearchFlightRouteDto } from './dto/search-flight-route-dto';
import { AircraftService } from 'src/aircraft/aircraft.service';
import { IFlightRepository } from './interfaces/flight.repository.interface';
import { PassengerService } from 'src/passenger/passenger.service';
import { CreateBookingDto } from './dto/create-booking-dto';
import {
  countAvailableSeat,
  findAvailableSeat,
  generateBookingId,
} from 'src/utils/flight.utils';
import { Ticket } from './entities/ticket.entity';
import { AdminService } from 'src/admin/admin.service';

@Injectable()
export class FlightService {
  constructor(
    private readonly aircraftService: AircraftService,
    @Inject('IFlightRepository')
    private readonly flightRepository: IFlightRepository,
    @Inject(forwardRef(() => PassengerService))
    private readonly passengerService: PassengerService,
    @Inject(forwardRef(() => AdminService))
    private readonly adminService: AdminService
  ) { }

  async createDestination(dto: CreateDestinationDto) {
    await this.flightRepository.createDestination(dto);
    return `${dto.destinationName} added as a destination!`;
  }

  async createFlightRoute(dto: CreateFlightRouteDto) {
    const [newFlightRoute, aircraft] = await Promise.all([
      this.flightRepository.createFlightRoute(dto),
      this.aircraftService.findOneById(dto.aircraftId),
    ]);

    return `Direct flight route created:
      ${newFlightRoute.departureCity} -> ${newFlightRoute.destinationCity}
      (${aircraft!.aircraftName}, Day ${newFlightRoute.scheduledDay})`;
  }

  // Recursive algorithm using Depth First Search algorithm
  async searchTransitRoutes(
    departureCity: string,
    destinationCity: string,
    scheduledDay: number,
    visited = new Set(),
  ): Promise<FlightRoute[] | null> {
    visited.add(departureCity);
    const destinations =
      await this.flightRepository.findFlightRoutesByDepartureCity(
        departureCity,
        scheduledDay
      );

    for (const route of destinations) {
      if (route.destinationCity === destinationCity) {
        return [route];
      }

      if (!visited.has(route.destinationCity)) {
        const subRoutes = await this.searchTransitRoutes(
          route.destinationCity,
          destinationCity,
          scheduledDay,
          new Set(visited),
        );
        if (subRoutes) {
          return [route, ...subRoutes];
        }
      }
    }

    return null;
  }

  async searchFlightRoute(dto: SearchFlightRouteDto) {
    const currentDay = await this.adminService.getCurrentDay()
    const directFlight = await this.flightRepository.findDirectFlight(
      dto.departureCity,
      dto.destinationCity,
      currentDay
    );

    if (!directFlight) {
      const transitFlight = await this.searchTransitRoutes(
        dto.departureCity,
        dto.destinationCity,
        currentDay
      );

      if (!transitFlight) {
        return {
          flightType: null,
          filterRoute: null,
          aircraft: null,
        };
      } else {
        const enhancedTransitFlight = await Promise.all(
          transitFlight.map(async (flight) => {
            const aircraft = await this.aircraftService.findOneById(
              flight.aircraftId,
            );
            const existingBookings =
              await this.flightRepository.findBookingsByAircraftIdAndFlightRouteId(
                flight.aircraftId,
                flight.id,
              );
            const bookedSeats = existingBookings.map(
              (booking) => booking.seatNumber,
            );
            const currentSeatCapacity = countAvailableSeat(
              bookedSeats,
              aircraft!.seatCapacity,
            );

            return {
              ...flight,
              aircraft,
              currentSeatCapacity,
            };
          }),
        );

        return {
          flightType: 'transit',
          flightRoute: enhancedTransitFlight,
          passenger: await this.passengerService.getCurrentPassenger(),
        };
      }
    }

    const existingBookings =
      await this.flightRepository.findBookingsByAircraftIdAndFlightRouteId(
        directFlight.aircraftId,
        directFlight.id,
      );
    const bookedSeats = existingBookings.map((booking) => booking.seatNumber);
    const aircraft = await this.aircraftService.findOneById(
      directFlight.aircraftId,
    );
    const currentSeatCapacity = countAvailableSeat(
      bookedSeats,
      aircraft!.seatCapacity,
    );

    return {
      flightType: 'direct',
      flightRoute: directFlight,
      aircraft: await this.aircraftService.findOneById(directFlight.aircraftId),
      passenger: await this.passengerService.getCurrentPassenger(),
      currentSeatCapacity,
    };
  }

  async findAllDestinations() {
    return this.flightRepository.findAllDestinations();
  }

  async bookSeat(dto: CreateBookingDto) {
    const tickets: Ticket[] = [];
    const currentPassenger = await this.passengerService.getCurrentPassenger();

    for (const flightRouteId of dto.flightRouteIds) {
      const bookingId = generateBookingId();
      const existingBookings =
        await this.flightRepository.findBookingsByAircraftIdAndFlightRouteId(
          dto.aircraftId[0],
          flightRouteId,
        );
      const bookedSeats = existingBookings.map((booking) => booking.seatNumber);
      const aircraft = await this.aircraftService.findOneById(
        dto.aircraftId[0],
      );
      const flightRoute =
        await this.flightRepository.findOneById(flightRouteId);

      if (flightRoute) {
        if (aircraft) {
          const seatNumber = findAvailableSeat(
            bookedSeats,
            aircraft.seatCapacity,
          );

          if (seatNumber) {
            await this.flightRepository.createBooking({
              bookingId,
              passengerId: dto.passengerId,
              aircraftId: dto.aircraftId[0],
              seatNumber,
              flightRouteId,
            });

            tickets.push({
              passenger: currentPassenger,
              aircraft,
              flightRoute,
              bookingId,
              seatNumber,
            });
          }
        }
      }
    }

    return tickets;
  }

  async getAllTickets() {
    const tickets: Ticket[] = [];
    const currentPassenger = await this.passengerService.getCurrentPassenger();
    const allBookings =
      await this.flightRepository.findAllBookingsByPassengerId(
        currentPassenger.id,
      );

    for (const booking of allBookings) {
      const aircraft = await this.aircraftService.findOneById(
        booking.aircraftId,
      );
      const flightRoute = await this.flightRepository.findOneById(
        booking.flightRouteId,
      );

      if (flightRoute) {
        if (aircraft) {
          tickets.push({
            passenger: currentPassenger,
            aircraft,
            flightRoute,
            bookingId: booking.bookingId,
            seatNumber: booking.seatNumber,
          });
        }
      }
    }

    return tickets;
  }

  async cancelBooking(bookingId: string) {
    return await this.flightRepository.deleteBookingById(bookingId);
  }

  async findFlightRoutesGreaterThanCurrentDay(currentDay: number) {
    return await this.flightRepository.findFlightRoutesGreaterThanCurrentDay(currentDay);
  }

  async findTodaysFlight(currentDay: number) {
    return await this.flightRepository.findTodaysFlight(currentDay);
  }

  async findBookedFlights(flightId: number) {
    return await this.flightRepository.findAllBookingsByFlightId(flightId);
  }
}
