import { IsNotEmpty } from 'class-validator';

export class SearchFlightRouteDto {
  @IsNotEmpty()
  departureCity: string;

  @IsNotEmpty()
  destinationCity: string;
}
