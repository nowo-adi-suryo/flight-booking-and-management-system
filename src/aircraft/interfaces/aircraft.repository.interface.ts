import { CreateAircraftDto } from '../dto/create-aircraft-dto';
import { Aircraft } from '../entities/aircraft.entity';

export interface IAircraftRepository {
  create(data: CreateAircraftDto): Promise<Aircraft>;
  findOneById(id: number): Promise<Aircraft | null>;
  updateSeatCapacity(
    aircraft: Aircraft,
    seatCapacity: number,
  ): Promise<Aircraft>;
  findAll(): Promise<Aircraft[]>;
  getAircraftOnEveryRoutes(ids: number[]): Promise<Aircraft[]>;
}
