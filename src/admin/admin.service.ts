import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { IAdminRepository } from './interfaces/admin.repository.interface';
import { FlightService } from 'src/flight/flight.service';
import { FlightRoute } from 'src/flight/entities/flight-route.entity';
import { AircraftService } from 'src/aircraft/aircraft.service';
import { PassengerService } from 'src/passenger/passenger.service';

@Injectable()
export class AdminService {
  constructor(
    @Inject('IAdminRepository')
    private readonly adminRepository: IAdminRepository,
    @Inject(forwardRef(() => FlightService))
    private readonly flightService: FlightService,
    private readonly aircraftService: AircraftService,
    @Inject(forwardRef(() => PassengerService))
    private readonly passengerService: PassengerService
  ) { }

  async toggleBookingService() {
    const currentStatus = await this.adminRepository.getBookingServiceStatus();
    const newStatus =
      await this.adminRepository.updateBookingServiceStatus(!currentStatus);

    if (newStatus) {
      return {
        firstMessage: 'Booking service is now running.',
        secondMessage: 'Passengers can now make bookings.',
      };
    }

    return {
      firstMessage: 'Booking service is stopped.',
      secondMessage: 'Passengers could not make bookings.',
    };
  }

  async getBookingServiceStatus() {
    return this.adminRepository.getBookingServiceStatus();
  }

  async getCurrentDay() {
    return this.adminRepository.getCurrentDay();
  }

  async incrementCurrentDay(currentDay: unknown) {
    let _currentDay = parseInt(currentDay as string, 10);
    _currentDay += 1;
    return await this.adminRepository.updateCurrentDay(_currentDay);
  }

  async goToNextDay() {
    let currentDay = await this.getCurrentDay();
    const nextDay = await this.incrementCurrentDay(currentDay);
    const _flightRoutes = await this.flightService.findFlightRoutesGreaterThanCurrentDay(nextDay);
    let flightRoutes: FlightRoute[] = [];

    for (const route of _flightRoutes) {
      flightRoutes.push({
        departureCity: route.departureCity,
        destinationCity: route.destinationCity,
        scheduledDay: route.scheduledDay - nextDay,
        aircraftId: route.aircraftId,
        id: route.id
      });
    }

    return { flightRoutes, currentDay: nextDay };
  }

  async runFlight() {
    const currentDay = await this.getCurrentDay();
    const todaysFlight = await this.flightService.findTodaysFlight(currentDay);

    if (todaysFlight.length === 0) {
      return { message: 'No flight for today.' };
    }

    let result: any = [];
    for (const flight of todaysFlight) {
      let flightInfo: any = {};
      const aircraft = await this.aircraftService.findOneById(flight.aircraftId);
      const bookedFlights = await this.flightService.findBookedFlights(flight.id);

      let passengers: any = [];
      for (const bookedFlight of bookedFlights) {
        const passenger = await this.passengerService.findOneById(bookedFlight.passengerId);
        passengers.push({ name: passenger.passengerName, seat: bookedFlight.seatNumber });
      }

      flightInfo.departureCity = flight.departureCity;
      flightInfo.destinationCity = flight.destinationCity;
      flightInfo.aircraftName = aircraft?.aircraftName;
      flightInfo.countPassengers = bookedFlights.length;
      flightInfo.passengers = passengers;

      result.push(flightInfo);
    }

    return result;
  }
}
