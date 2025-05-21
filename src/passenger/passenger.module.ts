import { forwardRef, Module } from '@nestjs/common';
import { PassengerController } from './passenger.controller';
import { PassengerService } from './passenger.service';
import { AdminModule } from 'src/admin/admin.module';
import { PassengerRepositoryRam } from './repositories/passenger.repository.ram';
import { FlightModule } from 'src/flight/flight.module';

@Module({
  imports: [forwardRef(() => AdminModule), forwardRef(() => FlightModule)],
  controllers: [PassengerController],
  providers: [
    PassengerService,
    PassengerRepositoryRam,
    {
      provide: 'IPassengerRepository',
      useClass: PassengerRepositoryRam,
    },
  ],
  exports: [PassengerService],
})
export class PassengerModule {}
