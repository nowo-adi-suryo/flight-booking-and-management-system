import { Aircraft } from 'src/aircraft/entities/aircraft.entity';
import { FlightRoute } from './flight-route.entity';
import { Passenger } from 'src/passenger/entities/passenger.entity';

export class Ticket {
  bookingId: string;
  flightRoute: FlightRoute;
  aircraft: Aircraft;
  seatNumber: number;
  passenger: Passenger;
}
