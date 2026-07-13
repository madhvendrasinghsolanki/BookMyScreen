import { Router } from "express";
import { authenticate, requireAdmin, requireSelfOrAdmin } from "../middlewares/auth";

import { movieController } from "../modules/movie/movie.controller";
import { theaterController } from "../modules/theater/theater.controller";
import { showController } from "../modules/show/show.controller";
import { userController } from "../modules/user/user.controller";
import { bookingController } from "../modules/booking/booking.controller";
import { wishlistController } from "../modules/wishlist/wishlist.controller";
import { adminController } from "../modules/admin/admin.controller";
import { seedController } from "../modules/seed/seed.controller";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// --- Movies ---

router.get("/movies/search/live", movieController.searchLive);
router.get("/movies/search/live/:imdbId", movieController.getLiveById);
router.get("/movies", movieController.getAllMovies);
router.post("/movies", authenticate, requireAdmin, movieController.createMovie);

// --- Theaters ---

router.get("/theaters", theaterController.getAllTheaters);
router.post("/theaters", authenticate, requireAdmin, theaterController.createTheater);

// --- Shows ---

router.get("/shows", showController.getShows);
router.post("/shows", authenticate, requireAdmin, showController.createShow);

// --- Auth ---

router.post("/auth/register", userController.register);
router.post("/auth/login", userController.login);

// --- Users ---

router.patch("/users/:id", authenticate, requireSelfOrAdmin("id"), userController.updateUser);

// --- Bookings ---

router.post("/bookings", authenticate, bookingController.createBooking);
router.get("/bookings", authenticate, bookingController.getBookings);

// --- Wishlist ---

router.get("/wishlist", authenticate, wishlistController.getWishlist);
router.post("/wishlist", authenticate, wishlistController.addToWishlist);
router.delete("/wishlist/:id", authenticate, wishlistController.removeFromWishlist);

// --- Admin ---

router.get("/admin/stats", authenticate, requireAdmin, adminController.getStats);
router.get("/admin/users", authenticate, requireAdmin, adminController.getAllUsers);
router.get("/admin/bookings", authenticate, requireAdmin, adminController.getAllBookings);

// --- Seeding (destructive — admin only, and disabled entirely in production) ---

router.post("/seed", authenticate, requireAdmin, seedController.seed);

export default router;
