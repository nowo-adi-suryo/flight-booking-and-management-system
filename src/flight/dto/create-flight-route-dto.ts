import { IsNotEmpty } from 'class-validator';

export class CreateFlightRouteDto {
  @IsNotEmpty()
  departureCity: string;

  @IsNotEmpty()
  destinationCity: string;

  @IsNotEmpty()
  aircraftId: number;

  @IsNotEmpty()
  scheduledDay: number;
}
