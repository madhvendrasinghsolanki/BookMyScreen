import app, { connectDatabase } from "./app";
import { config } from "./config/config";

const PORT = config.port || 9000;

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup failed", error);
    process.exit(1);
  }
};

startServer();