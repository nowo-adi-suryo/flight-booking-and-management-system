import { Inject, Injectable } from '@nestjs/common';
import { CreateAircraftDto } from './dto/create-aircraft-dto';
import { IAircraftRepository } from './interfaces/aircraft.repository.interface';

@Injectable()
export class AircraftService {
  constructor(
    @Inject('IAircraftRepository')
    private readonly aircraftRepository: IAircraftRepository,
  ) {}

  async create(dto: CreateAircraftDto) {
    await this.aircraftRepository.create(dto);

    return `Aircraft ${dto.aircraftName} with ${dto.seatCapacity} seats registered successfully!`;
  }

  async findOneById(id: number) {
    return await this.aircraftRepository.findOneById(id);
  }

  // async increaseSeatCapacity(id: number) {
  //   const aircraft = await this.findOneById(id);

  //   if (aircraft) {
  //     const updatedAircraft = await this.aircraftRepository.updateSeatCapacity(aircraft, aircraft.seatCapacity++);

  //     return updatedAircraft;
  //   }

  //   return null;
  // }

  // async decreaseSeatCapacity(id: number) {
  //   const aircraft = await this.findOneById(id);

  //   if (aircraft) {
  //     const updatedAircraft = await this.aircraftRepository.updateSeatCapacity(aircraft, aircraft.seatCapacity--);

  //     return updatedAircraft;
  //   }

  //   return null;
  // }

  async findAll() {
    return await this.aircraftRepository.findAll();
  }

  async countSeatCapacity(totalBookedSeat: number, aircraftId: number) {
    const aircraft = await this.findOneById(aircraftId);

    if (aircraft) {
      return {
        ...aircraft,
        seatCapacity: aircraft.seatCapacity - totalBookedSeat,
      };
    }
  }
}
