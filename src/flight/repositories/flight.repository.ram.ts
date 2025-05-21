import { CreateDestinationDto } from '../dto/create-destination-dto';
import { CreateFlightRouteDto } from '../dto/create-flight-route-dto';
import { Booking } from '../entities/booking.entity';
import { Destination } from '../entities/destination.entity';
import { FlightRoute } from '../entities/flight-route.entity';
import {
  ICreateBooking,
  IFlightRepository,
} from '../interfaces/flight.repository.interface';

export class FlightRepositoryRam implements IFlightRepository {
  destinations: Destination[] = [
    {
      id: 1,
      destinationName: 'A',
    },
    {
      id: 2,
      destinationName: 'B',
    },
    {
      id: 3,
      destinationName: 'C',
    },
    {
      id: 4,
      destinationName: 'D',
    },
  ];
  private idDestination = 5;

  flightRoutes: FlightRoute[] = [
    {
      id: 1,
      aircraftId: 1,
      departureCity: 'A',
      destinationCity: 'B',
      scheduledDay: 3,
    },
    {
      id: 2,
      aircraftId: 1,
      departureCity: 'B',
      destinationCity: 'C',
      scheduledDay: 4,
    },
    {
      id: 3,
      aircraftId: 1,
      departureCity: 'C',
      destinationCity: 'D',
      scheduledDay: 4,
    },
    {
      id: 4,
      aircraftId: 1,
      departureCity: 'A',
      destinationCity: 'B',
      scheduledDay: 5,
    },
  ];
  private idFlightRoute = 5;

  bookings: Booking[] = [];
  private idBooking = 1;

  async createDestination(data: CreateDestinationDto): Promise<Destination> {
    const newDestination = { id: this.idDestination++, ...data };
    this.destinations.push(newDestination);

    return newDestination;
  }

  async createFlightRoute(data: CreateFlightRouteDto): Promise<FlightRoute> {
    const newFlightRoute = { id: this.idFlightRoute++, ...data };
    this.flightRoutes.push(newFlightRoute);

    return newFlightRoute;
  }

  async findDirectFlight(
    departureCity: string,
    destinationCity: string,
    scheduledDay: number
  ): Promise<FlightRoute | null> {
    const directFlight = this.flightRoutes.find(
      (route) =>
        route.departureCity === departureCity &&
        route.destinationCity === destinationCity &&
        route.scheduledDay > scheduledDay
    );

    if (!directFlight) {
      return null;
    }

    return directFlight;
  }

  async findFlightRoutesByDepartureCity(
    departureCity: string,
    scheduledDay: number
  ): Promise<FlightRoute[]> {
    return this.flightRoutes.filter(
      (route) => route.departureCity === departureCity &&
        route.scheduledDay > scheduledDay
    );
  }

  async findFlightRoutesByDestinationCity(
    destinationCity: string,
  ): Promise<FlightRoute[]> {
    return this.flightRoutes.filter(
      (route) => route.destinationCity === destinationCity,
    );
  }

  async findAllDestinations(): Promise<Destination[]> {
    return this.destinations;
  }

  async findAllFlightRoutes(): Promise<FlightRoute[]> {
    return this.flightRoutes;
  }

  async createBooking(input: ICreateBooking): Promise<Booking> {
    const newBooking = { id: this.idBooking++, ...input };
    this.bookings.push(newBooking);
    return newBooking;
  }

  async findBookingsByAircraftIdAndFlightRouteId(
    aircraftId: number,
    flightRouteId: number,
  ): Promise<Booking[]> {
    return this.bookings.filter(
      (booking) =>
        booking.aircraftId == aircraftId &&
        booking.flightRouteId == flightRouteId
    );
  }

  async findAllBookings(): Promise<Booking[]> {
    return this.bookings;
  }

  async findAllBookingsByPassengerId(passengerId: number): Promise<Booking[]> {
    return this.bookings.filter(
      (booking) => booking.passengerId == passengerId,
    );
  }

  async findOneById(flightRouteId: number): Promise<FlightRoute | null> {
    const flightRoute = this.flightRoutes.find(
      (route) => route.id == flightRouteId,
    );

    if (flightRoute) {
      return flightRoute;
    }

    return null;
  }

  async deleteBookingById(bookingId: string): Promise<string> {
    const bookingIndex = this.bookings.findIndex(
      (booking) => booking.bookingId == bookingId,
    );
    if (bookingIndex >= 0) {
      this.bookings.splice(bookingIndex, 1);

      return bookingId;
    }
    return 'fail';
  }

  async findFlightRoutesGreaterThanCurrentDay(currentDay: number) {
    return this.flightRoutes.filter((route) => (route.scheduledDay >= currentDay));
  }

  async findTodaysFlight(currentDay: number): Promise<FlightRoute[]> {
    return this.flightRoutes.filter((route) => (route.scheduledDay === currentDay));
  }

  async findAllBookingsByFlightId(flightId: number): Promise<Booking[]> {
    return this.bookings.filter((booking) => (booking.flightRouteId == flightId));
  }
}
