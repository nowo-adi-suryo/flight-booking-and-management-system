import { IsNotEmpty } from 'class-validator';

export class LoginPassengerDto {
  @IsNotEmpty()
  passengerName: string;
}
