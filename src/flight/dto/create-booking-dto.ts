import { IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  flightRouteIds: number[];

  @IsNotEmpty()
  passengerId: number;

  @IsNotEmpty()
  aircraftId: number;

  @IsNotEmpty()
  seatNumber: number;
}
