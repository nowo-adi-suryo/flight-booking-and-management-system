export interface IAdminRepository {
  updateBookingServiceStatus(status: boolean): Promise<boolean>;
  getBookingServiceStatus(): Promise<boolean>;
  getCurrentDay(): Promise<number>;
  updateCurrentDay(currentDay: number): Promise<number>;
}
