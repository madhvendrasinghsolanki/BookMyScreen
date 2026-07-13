import app, { connectDatabase } from "./app";
import { config } from "./config/config";

const PORT = config.port || 9000;
const DB_RETRY_MS = 15000;

const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  const tryConnect = async () => {
    try {
      await connectDatabase();
    } catch (error) {
      console.error(`Database not ready. Retrying in ${DB_RETRY_MS / 1000}s...`, error);
      setTimeout(tryConnect, DB_RETRY_MS);
    }
  };

  await tryConnect();
};

startServer();