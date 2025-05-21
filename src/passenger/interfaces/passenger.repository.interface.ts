import { CreatePassengerDto } from '../dto/create-passenger.dto';
import { Passenger } from '../entities/passenger.entity';

export interface IPassengerRepository {
  findOneByName(name: string): Promise<Passenger | null>;
  create(data: CreatePassengerDto): Promise<Passenger>;
  getCurrentPassenger(): Promise<Passenger>;
  updateCurrentPassenger(passenger: Passenger): Promise<Passenger>;
  findOneById(id: number): Promise<Passenger>;
}
