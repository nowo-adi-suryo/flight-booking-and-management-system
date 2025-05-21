import {
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Post,
  Render,
} from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { PassengerService } from './passenger.service';
import { FlightService } from 'src/flight/flight.service';

@Controller('passenger')
export class PassengerController {
  constructor(
    @Inject(forwardRef(() => AdminService))
    private readonly adminService: AdminService,
    private readonly passengerService: PassengerService,
    private readonly flightService: FlightService,
  ) {}

  @Get()
  @Render('passenger/index')
  async root() {
    return { bookingStatus: await this.adminService.getBookingServiceStatus() };
  }

  @Post('login')
  @Render('passenger/dashboard')
  async dashboard(@Body() dto: CreatePassengerDto) {
    return {
      greetings: await this.passengerService.login(dto),
      bookingStatus: await this.adminService.getBookingServiceStatus(),
      currentDay: await this.adminService.getCurrentDay(),
    };
  }
}
