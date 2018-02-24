import { } from "jest";

jest.mock("../service/StatsService");

import Server from "../server";
import { Status } from "../service/SatelliteState";
import SatelliteService from "../service/StatsService";

beforeEach(() => {
  jest.resetAllMocks();
});

it("returns altitude ok message", async () => {
  const service = new SatelliteService();
  (service.status as jest.Mock<Status>).mockReturnValueOnce(Status.OK);

  const server = new Server(service);
  const response = await server.inject("/health");

  expect(response.result).toEqual({message: "Altitude is A-OK"});
});

it("returns resumed message", async () => {
  const service = new SatelliteService();
  (service.status as jest.Mock<Status>).mockReturnValueOnce(Status.RECOVERING);

  const server = new Server(service);
  const response = await server.inject("/health");

  expect(response.result).toEqual({message: "Sustained Low Earth Orbit Resumed"});
});

it("returns warning message", async () => {
  const service = new SatelliteService();
  (service.status as jest.Mock<Status>).mockReturnValueOnce(Status.ALERT);

  const server = new Server(service);
  const response = await server.inject("/health");

  expect(response.result).toEqual({message: "WARNING: RAPID ORBITAL DECAY IMMINENT"});
});
