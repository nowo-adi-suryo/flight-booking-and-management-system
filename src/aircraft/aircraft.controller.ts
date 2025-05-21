import { Body, Controller, Post, Render } from '@nestjs/common';
import { CreateAircraftDto } from './dto/create-aircraft-dto';
import { AircraftService } from './aircraft.service';

@Controller('aircraft')
export class AircraftController {
  constructor(private readonly aircraftService: AircraftService) {}

  @Post('create_aircraft')
  @Render('aircraft/create')
  async createAircraft(@Body() createDto: CreateAircraftDto) {
    const message = await this.aircraftService.create(createDto);

    return { message };
  }
}
