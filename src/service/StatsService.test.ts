import { } from "jest";

jest.mock("axios", () => ({
  get: jest.fn(() => Promise.resolve({altitude: 123, last_updated: new Date().toISOString()}))
}));

import axios from "axios";
import moment from "moment";
import StatsController from "../controller/StatsController";
import { Status } from "./SatelliteState";
import StatsService from "./StatsService";

jest.useFakeTimers();

beforeEach(() => {
  jest.resetAllMocks();
});

it("start polling triggers fetch", () => {
  const service = new StatsService();
  service.startPolling();

  expect(setInterval).toHaveBeenCalledTimes(1);
  expect(axios.get).toHaveBeenCalledTimes(1);
  expect(axios.get).toBeCalledWith("http://nestio.space/api/satellite/data");
});

describe("update altitude data", () => {
  let service: StatsService;

  beforeEach(() => {
    service = new StatsService();
  });

  it("updates with single data point", () => {
    service.updateAltitudeData(2, new Date().toISOString());

    expect(service.altitude.average).toEqual(2);
    expect(service.altitude.min).toEqual(2);
    expect(service.altitude.max).toEqual(2);
  });

  it("updates with multiple data points", () => {
    service.updateAltitudeData(5, moment().subtract(20, "seconds").toISOString());
    service.updateAltitudeData(1, moment().subtract(10, "seconds").toISOString());
    service.updateAltitudeData(6, new Date().toISOString());

    expect(service.altitude.average).toEqual(4);
    expect(service.altitude.min).toEqual(1);
    expect(service.altitude.max).toEqual(6);
  });

  it("ignores invalid data", () => {
    service.updateAltitudeData(5, "foobar");

    expect(service.altitude.average).toEqual(0);
    expect(service.altitude.min).toEqual(0);
    expect(service.altitude.max).toEqual(0);
  });
});

it("updates status after one minute of data is available", () => {
  const service = new StatsService();

  for (let i = 6; i > 0; i--) {
    service.updateAltitudeData(159, moment().subtract(i * 10, "seconds").toISOString());
    expect(service.status()).toEqual(Status.OK);
  }

  service.updateAltitudeData(159, moment().toISOString());
  expect(service.status()).toEqual(Status.ALERT);
});
