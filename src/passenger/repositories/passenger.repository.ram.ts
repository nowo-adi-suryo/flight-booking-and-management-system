import { CreatePassengerDto } from '../dto/create-passenger.dto';
import { Passenger } from '../entities/passenger.entity';
import { IPassengerRepository } from '../interfaces/passenger.repository.interface';

export class PassengerRepositoryRam implements IPassengerRepository {
  private readonly passengers: Passenger[] = [];
  private idPassenger: number = 1;
  private currentPassenger: Passenger;

  async findOneByName(name: string): Promise<Passenger | null> {
    const passenger = this.passengers.find(
      (passenger) => passenger.passengerName === name,
    );

    if (!passenger) return null;

    return passenger;
  }

  async create(dto: CreatePassengerDto): Promise<Passenger> {
    const newPassenger = { id: this.idPassenger++, ...dto };
    this.passengers.push(newPassenger);

    return newPassenger;
  }

  async getCurrentPassenger() {
    return this.currentPassenger;
  }

  async updateCurrentPassenger(passenger: Passenger): Promise<Passenger> {
    this.currentPassenger = passenger;

    return passenger;
  }

  async findOneById(id: number): Promise<Passenger> {
    return this.passengers.find((passenger) => (passenger.id == id))!;
  }
}
