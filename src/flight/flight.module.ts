import { forwardRef, Module } from '@nestjs/common';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';
import { AircraftModule } from 'src/aircraft/aircraft.module';
import { FlightRepositoryRam } from './repositories/flight.repository.ram';
import { PassengerModule } from 'src/passenger/passenger.module';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    AircraftModule,
    forwardRef(() => PassengerModule),
    forwardRef(() => AdminModule),
  ],
  controllers: [FlightController],
  providers: [
    FlightService,
    FlightRepositoryRam,
    {
      provide: 'IFlightRepository',
      useClass: FlightRepositoryRam,
    },
  ],
  exports: [FlightService],
})
export class FlightModule {}
