import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { PassengerModule } from './passenger/passenger.module';
import { AircraftModule } from './aircraft/aircraft.module';
import { FlightModule } from './flight/flight.module';

@Module({
  imports: [AdminModule, PassengerModule, AircraftModule, FlightModule],
  controllers: [AppController, AdminController],
  providers: [AppService],
})
export class AppModule {}
