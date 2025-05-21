import { Inject, Injectable } from '@nestjs/common';
import { IPassengerRepository } from './interfaces/passenger.repository.interface';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { LoginPassengerDto } from './dto/login-passenger.dto';

@Injectable()
export class PassengerService {
  constructor(
    @Inject('IPassengerRepository')
    private readonly passengerRepository: IPassengerRepository,
  ) { }

  greetings: string;

  async register(dto: CreatePassengerDto) {
    return this.passengerRepository.create(dto);
  }

  async login(dto: LoginPassengerDto) {
    const registeredPassenger = await this.passengerRepository.findOneByName(
      dto.passengerName,
    );

    if (!registeredPassenger) {
      const newPassenger = await this.passengerRepository.create(dto);
      this.greetings = `Welcome, ${newPassenger.passengerName}!`;
      await this.passengerRepository.updateCurrentPassenger(newPassenger);

      return this.greetings;
    }

    await this.passengerRepository.updateCurrentPassenger(registeredPassenger);
    this.greetings = `Welcome back, ${registeredPassenger.passengerName}!`;

    return this.greetings;
  }

  async getCurrentPassenger() {
    return await this.passengerRepository.getCurrentPassenger();
  }

  async findOneById(id: number) {
    return await this.passengerRepository.findOneById(id);
  }
}
