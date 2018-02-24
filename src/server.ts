import Hapi from "hapi";
import logger from "./utils/logger";

export default class Server {
  private apiServer: Hapi.Server;

  constructor() {
    this.apiServer = new Hapi.Server({
      port: process.env.PORT || 8080,
      host: process.env.HOST || "localhost"
    });

    const routes: Hapi.ServerRoute[] = [
      {
        method: "GET",
        path: "/",
        handler: async (request: Hapi.Request, reply: Hapi.ResponseToolkit) => {
          return reply.response({ hello: "world" });
        }
      }
    ];

    this.apiServer.route(routes);
  }

  public async start() {
    await this.registerPlugins();
    await this.apiServer.start();

    const settings = this.apiServer.settings;

    logger.info(`server started http://${settings.host}:${settings.port}`);
  }

  public inject(options: string | Hapi.ServerInjectOptions): Promise<Hapi.ServerInjectResponse> {
    return this.apiServer.inject(options);
  }

  private async registerPlugins() {
    await this.apiServer.register({
      plugin: require("good"),
      options: {
        reporters: {
          console: [{ module: "good-console" }, "stdout"],
        }
      }
    });
  }
}
