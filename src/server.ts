import Hapi from "hapi";
import logger from "./utils/logger";

import HealthController from "./controller/HealthController";
import StatsController from "./controller/StatsController";
import SatelliteService from "./service/StatsService";

export default class Server {
  private apiServer: Hapi.Server;
  private statsController: StatsController;
  private healthController: HealthController;

  constructor(readonly service: SatelliteService = new SatelliteService()) {
    this.apiServer = new Hapi.Server({
      port: process.env.PORT || 8080,
      host: process.env.HOST || "localhost"
    });

    this.service = service;
    this.healthController = new HealthController(this.service);
    this.statsController = new StatsController(this.service);

    const routes: Hapi.ServerRoute[] = [
      {
        method: "GET",
        path: "/stats",
        handler: this.statsController.getAll
      },
      {
        method: "GET",
        path: "/health",
        handler: this.healthController.getStatus
      }
    ];

    this.apiServer.route(routes);
  }

  public async start() {
    await this.registerPlugins();
    await this.apiServer.start();
    this.service.startPolling();

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
