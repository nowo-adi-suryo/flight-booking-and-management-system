import { IsNotEmpty } from 'class-validator';

export class CreatePassengerDto {
  @IsNotEmpty()
  passengerName: string;
}
