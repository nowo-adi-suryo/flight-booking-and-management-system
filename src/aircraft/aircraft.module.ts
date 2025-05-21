import { Module } from '@nestjs/common';
import { AircraftController } from './aircraft.controller';
import { AircraftService } from './aircraft.service';
import { AircraftRepositoryRam } from './repositories/aircraft.repository.ram';

@Module({
  controllers: [AircraftController],
  providers: [
    AircraftService,
    AircraftRepositoryRam,
    {
      provide: 'IAircraftRepository',
      useClass: AircraftRepositoryRam,
    },
  ],
  exports: [AircraftService],
})
export class AircraftModule {}
