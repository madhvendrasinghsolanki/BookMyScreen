import createHttpError from "http-errors";
import mongoose from "mongoose";
import { config } from "../../config/config";
import { MovieModel } from "../movie/movie.model";
import { TheaterModel } from "../theater/theater.model";
import { ShowModel } from "../show/show.model";

const demoMovies = [
  {
    title: "Maa",
    genre: ["Fantasy", "Horror", "Mythological", "Thriller"],
    rating: 7.2,
    certification: "UA16+",
    duration: "2h 15m",
    releaseDate: "27 Jun 2025",
    posterUrl: "https://res.cloudinary.com/k5iutkbu/image/upload/v1783594062/maa_emmfae.jpg",
    description: "A mother becomes Kali to end a demonic curse rooted in fear, blood, and betrayal.",
  },
  {
    title: "Kannappa",
    genre: ["Action", "Mythological"],
    rating: 7.3,
    certification: "UA13+",
    duration: "2h 30m",
    releaseDate: "01 Aug 2025",
    posterUrl: "https://res.cloudinary.com/k5iutkbu/image/upload/v1783594569/kannapp_tgw67d.jpg",
    description: "The tale of Kannappa, a devoted follower of Lord Shiva.",
  },
];

const demoTheaters = [
  { name: "Cinepolis", location: "High Street Mall", city: "Mumbai", state: "Maharashtra", logo: "C" },
  { name: "INOX", location: "City Center", city: "Delhi", state: "Delhi", logo: "I" },
  { name: "Metro", location: "Downtown Plaza", city: "Bengaluru", state: "Karnataka", logo: "M" },
  { name: "PVR", location: "Garden Avenue", city: "Hyderabad", state: "Telangana", logo: "P" },
];

const demoShows = [
  { movie: "Maa", theater: "Cinepolis", city: "Mumbai", date: "Today", startTime: "10:00 AM", format: "IMAX", audioType: "Dolby Atmos" },
  { movie: "Maa", theater: "INOX", city: "Delhi", date: "Today", startTime: "1:30 PM", format: "2D", audioType: "Dolby 5.1" },
  { movie: "Kannappa", theater: "PVR", city: "Hyderabad", date: "Tomorrow", startTime: "5:00 PM", format: "3D", audioType: "Dolby Atmos" },
];

export const seedService = {
  async seedDemoData(): Promise<void> {
    if (process.env.NODE_ENV === "production") {
      throw createHttpError(403, "Seeding is disabled in production");
    }

    await mongoose.connect(config.databaseUrl);

    await MovieModel.deleteMany({});
    await TheaterModel.deleteMany({});
    await ShowModel.deleteMany({});

    await MovieModel.insertMany(demoMovies);
    await TheaterModel.insertMany(demoTheaters);

    const movieDocs = await MovieModel.find({ title: { $in: demoMovies.map((m) => m.title) } });
    const theaterDocs = await TheaterModel.find({ name: { $in: demoTheaters.map((t) => t.name) } });
    const movieMap = new Map(movieDocs.map((doc) => [doc.title, doc._id]));
    const theaterMap = new Map(theaterDocs.map((doc) => [doc.name, doc._id]));

    await ShowModel.insertMany(
      demoShows.map((show) => ({
        movie: movieMap.get(show.movie),
        theater: theaterMap.get(show.theater),
        city: show.city,
        date: show.date,
        startTime: show.startTime,
        format: show.format,
        audioType: show.audioType,
      }))
    );
  },
};
