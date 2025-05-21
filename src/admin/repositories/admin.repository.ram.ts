import { Injectable } from '@nestjs/common';
import { IAdminRepository } from '../interfaces/admin.repository.interface';

@Injectable()
export class AdminRepositoryRam implements IAdminRepository {
  bookingServiceStatus: boolean = true;
  currentDay: number = 1;

  async updateBookingServiceStatus(status: boolean) {
    this.bookingServiceStatus = status;
    return this.bookingServiceStatus;
  }

  async getBookingServiceStatus(): Promise<boolean> {
    return this.bookingServiceStatus;
  }

  async getCurrentDay(): Promise<number> {
    return this.currentDay;
  }

  async updateCurrentDay(currentDay: number): Promise<number> {
    this.currentDay = currentDay;

    return this.currentDay;
  }
}
