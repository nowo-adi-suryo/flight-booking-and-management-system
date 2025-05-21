import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { FlightService } from './flight.service';
import { CreateDestinationDto } from './dto/create-destination-dto';
import { CreateFlightRouteDto } from './dto/create-flight-route-dto';
import { SearchFlightRouteDto } from './dto/search-flight-route-dto';
import { CreateBookingDto } from './dto/create-booking-dto';
import { PassengerService } from 'src/passenger/passenger.service';
import { AdminService } from 'src/admin/admin.service';
import { Ticket } from './entities/ticket.entity';

@Controller('flight')
export class FlightController {
  constructor(
    private readonly flightService: FlightService,
    private readonly passengerService: PassengerService,
    private readonly adminService: AdminService,
  ) { }

  @Post('create_destination')
  @Render('flight/addDestination')
  async createDestination(@Body() createDto: CreateDestinationDto) {
    const message = await this.flightService.createDestination(createDto);
    return { message };
  }

  @Post('create_route')
  @Render('flight/createFlightRoute')
  async createFlightRoute(@Body() createDto: CreateFlightRouteDto) {
    const message = await this.flightService.createFlightRoute(createDto);
    return { message };
  }

  @Post('search')
  @Render('flight/search_flight_route')
  async searchFlightRoute(@Body() searchDto: SearchFlightRouteDto) {
    return await this.flightService.searchFlightRoute(searchDto);
  }

  @Post('confirm_booking')
  @Render('flight/tickets')
  async confirmBooking(@Body() dto: CreateBookingDto) {
    const tickets = await this.flightService.bookSeat(dto);
    return { tickets };
  }

  @Get('booking_flight')
  @Render('flight/booking_flight')
  async bookingFlight() {
    return {
      greetings: this.passengerService.greetings,
      bookingStatus: await this.adminService.getBookingServiceStatus(),
      currentDay: await this.adminService.getCurrentDay(),
      destinations: await this.flightService.findAllDestinations(),
    };
  }

  @Get('cancel_bookings')
  @Render('flight/cancel_flight')
  async cancelBooking() {
    const tickets = await this.flightService.getAllTickets();
    return { tickets };
  }

  @Post('cancel_booking')
  @Render('flight/cancel_flight_result')
  async confirmCancelBookings(@Body() data) {
    const { bookingId } = data;
    return { message: await this.flightService.cancelBooking(bookingId) };
  }
}
