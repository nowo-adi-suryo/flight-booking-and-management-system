import { CreateDestinationDto } from '../dto/create-destination-dto';
import { CreateFlightRouteDto } from '../dto/create-flight-route-dto';
import { Booking } from '../entities/booking.entity';
import { Destination } from '../entities/destination.entity';
import { FlightRoute } from '../entities/flight-route.entity';

export interface ICreateBooking {
  bookingId: string;
  flightRouteId: number;
  passengerId: number;
  aircraftId: number;
  seatNumber: number;
}

export interface IFlightRepository {
  createDestination(data: CreateDestinationDto): Promise<Destination>;
  createFlightRoute(data: CreateFlightRouteDto): Promise<FlightRoute>;
  findDirectFlight(
    departureCity: string,
    destinationCity: string,
    scheduledDay: number
  ): Promise<FlightRoute | null>;
  findFlightRoutesByDepartureCity(
    departureCity: string,
    scheduledDay: number
  ): Promise<FlightRoute[]>;
  findFlightRoutesByDestinationCity(
    destinationCity: string,
  ): Promise<FlightRoute[]>;
  findAllDestinations(): Promise<Destination[]>;
  findAllFlightRoutes(): Promise<FlightRoute[]>;
  createBooking(data: ICreateBooking): Promise<Booking>;
  findBookingsByAircraftIdAndFlightRouteId(
    aircraftId: number,
    flightRouteId: number,
  ): Promise<Booking[]>;
  findAllBookings(): Promise<Booking[]>;
  findAllBookingsByPassengerId(passengerId: number): Promise<Booking[]>;
  findOneById(flightRouteId: number): Promise<FlightRoute | null>;
  deleteBookingById(bookingId): Promise<string>;
  findFlightRoutesGreaterThanCurrentDay(currentDay: number): Promise<FlightRoute[]>;
  findTodaysFlight(currentDay: number): Promise<FlightRoute[]>;
  findAllBookingsByFlightId(flightId: number): Promise<Booking[]>;
}
