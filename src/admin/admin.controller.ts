import { Controller, forwardRef, Get, Inject, Post, Render } from '@nestjs/common';
import { AircraftService } from 'src/aircraft/aircraft.service';
import { FlightService } from 'src/flight/flight.service';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(
    @Inject(forwardRef(() => FlightService))
    private readonly flightService: FlightService,
    private readonly aircraftService: AircraftService,
    private readonly adminService: AdminService,
  ) { }

  @Get()
  @Render('admin/index')
  async root() {
    return { bookingStatus: await this.adminService.getBookingServiceStatus() };
  }

  @Get('register_aircraft')
  @Render('admin/aircraft_form')
  registerAircraft(): string {
    return '';
  }

  @Get('add_destination')
  @Render('admin/destination_form')
  addDestination(): string {
    return '';
  }

  @Get('create_flight_route')
  @Render('admin/flight_route_form')
  async createFlightRoute() {
    return {
      destinations: await this.flightService.findAllDestinations(),
      aircrafts: await this.aircraftService.findAll(),
    };
  }

  @Get('toggle_booking_service')
  @Render('admin/toggle_booking')
  async toggleBooking() {
    return await this.adminService.toggleBookingService();
  }

  @Get('go_to_next_day')
  @Render('admin/next_day')
  async goToNextDay() {
    return await this.adminService.goToNextDay();
  }

  @Get('run_flight')
  @Render('flight/run_flight')
  async runFlight() {
    const flightInfo = await this.adminService.runFlight();
    return { flightInfo };
  }
}
