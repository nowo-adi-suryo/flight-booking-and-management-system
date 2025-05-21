import { IsNotEmpty } from 'class-validator';

export class CreateDestinationDto {
  @IsNotEmpty()
  destinationName: string;
}
