import { Injectable } from '@nestjs/common';
import { IAircraftRepository } from '../interfaces/aircraft.repository.interface';
import { Aircraft } from '../entities/aircraft.entity';
import { CreateAircraftDto } from '../dto/create-aircraft-dto';

@Injectable()
export class AircraftRepositoryRam implements IAircraftRepository {
  aircrafts: Aircraft[] = [
    {
      id: 1,
      aircraftName: 'Garuda Indonesia',
      seatCapacity: 5,
    },
    {
      id: 2,
      aircraftName: 'Air Asia',
      seatCapacity: 5,
    },
  ];
  private id = 3;

  async create(dto: CreateAircraftDto) {
    const newAircraft = { id: this.id++, ...dto };
    this.aircrafts.push(newAircraft);
    return newAircraft;
  }

  async findOneById(id: unknown) {
    const aircraft = this.aircrafts.find(
      (aircraft) => aircraft.id === parseInt(id as string, 10),
    );

    if (!aircraft) {
      return null;
    }

    return aircraft;
  }

  async updateSeatCapacity(aircraft: Aircraft, seatCapacity: number) {
    aircraft.seatCapacity = seatCapacity;

    return aircraft;
  }

  async findAll(): Promise<Aircraft[]> {
    return this.aircrafts;
  }

  async getAircraftOnEveryRoutes(ids: number[]) {
    const aircrafts = ids.map(
      (id) => this.aircrafts.find((aircraft) => aircraft.id === id)!,
    );
    return aircrafts;
  }
}
