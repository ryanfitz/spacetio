import Server from "./server";
import logger from "./utils/logger";

const startServer = async () => {
  try {
    const server = new Server();
    await server.start();
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

startServer();
