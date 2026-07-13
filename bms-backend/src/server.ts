import app from "./app";
import { config } from "./config/config";

const startServer = async () => {
  const port = config.port;

  app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
};

startServer();