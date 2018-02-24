import { } from "jest";

jest.mock("axios", () => ({
  get: jest.fn(() => Promise.resolve({altitude: 123, last_updated: new Date().toISOString()}))
}));

import axios from "axios";
import Server from "./server";

jest.useFakeTimers();

beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllTimers();
});

it("start server starts polling data from nestio.space", async () => {
  const server = new Server();
  await server.start();

  expect(axios.get).toHaveBeenCalledTimes(1);
  expect(axios.get).toBeCalledWith("http://nestio.space/api/satellite/data");
});
