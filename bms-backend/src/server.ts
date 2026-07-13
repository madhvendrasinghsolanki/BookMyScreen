import cors from "cors";

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://book-my-screen-mu.vercel.app",
    ],
    credentials: true,
  })
);