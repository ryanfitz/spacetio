import Hapi from "hapi";
import StatsService from "../service/StatsService";

export default class StatsController {
  constructor(readonly service: StatsService) {}

  public getAll = (request: Hapi.Request, reply: Hapi.ResponseToolkit): Hapi.ResponseObject => {
    return reply.response(this.service.altitude);
  }
}
