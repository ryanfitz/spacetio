import { } from "jest";

jest.mock("../service/StatsService");

import Server from "../server";
import SatelliteService from "../service/StatsService";

beforeEach(() => {
  jest.resetAllMocks();
});

it("returns altitude info", async () => {
  const service = new SatelliteService();
  service.altitude = {average: 4, min: 2, max: 6};

  const server = new Server(service);
  const response = await server.inject("/stats");

  expect(response.result).toEqual({average: 4, min: 2, max: 6});
});
