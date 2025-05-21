import { forwardRef, Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { FlightModule } from 'src/flight/flight.module';
import { AircraftModule } from 'src/aircraft/aircraft.module';
import { AdminRepositoryRam } from './repositories/admin.repository.ram';
import { PassengerModule } from 'src/passenger/passenger.module';

@Module({
  imports: [
    forwardRef(() => FlightModule),
    AircraftModule,
    forwardRef(() => PassengerModule)
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    AdminRepositoryRam,
    {
      provide: 'IAdminRepository',
      useClass: AdminRepositoryRam,
    },
  ],
  exports: [AdminService],
})
export class AdminModule { }
