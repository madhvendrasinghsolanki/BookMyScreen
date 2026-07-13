import { MovieModel } from "../movie/movie.model";
import { TheaterModel } from "../theater/theater.model";
import { BookingModel } from "../booking/booking.model";
import { UserModel } from "../user/user.model";
import { userService } from "../user/user.service";
import { bookingService } from "../booking/booking.service";

export const adminService = {
  async getStats() {
    const [movies, theaters, bookings, users] = await Promise.all([
      MovieModel.countDocuments(),
      TheaterModel.countDocuments(),
      BookingModel.countDocuments(),
      UserModel.countDocuments(),
    ]);

    return { movies, theaters, bookings, users };
  },

  async getAllUsers() {
    return userService.getAllUsers();
  },

  async getAllBookings() {
    return bookingService.getAllBookings();
  },
};
