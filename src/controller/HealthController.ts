import Hapi from "hapi";
import { Status } from "../service/SatelliteState";
import StatsService from "../service/StatsService";

export default class HealthController {
  constructor(readonly service: StatsService) { }

  public getStatus = (request: Hapi.Request, reply: Hapi.ResponseToolkit): Hapi.ResponseObject => {
    let message: string;

    switch (this.service.status()) {
      case Status.RECOVERING:
        message = "Sustained Low Earth Orbit Resumed";
        break;
      case Status.ALERT:
        message = "WARNING: RAPID ORBITAL DECAY IMMINENT";
        break;
      case Status.OK:
      default:
        message = "Altitude is A-OK";
        break;
    }

    return reply.response({ message });
  }
}
