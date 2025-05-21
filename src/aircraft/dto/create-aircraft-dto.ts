import { IsNotEmpty } from 'class-validator';

export class CreateAircraftDto {
  @IsNotEmpty()
  aircraftName: string;

  @IsNotEmpty()
  seatCapacity: number;
}
