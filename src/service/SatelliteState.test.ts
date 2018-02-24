import { } from "jest";
import moment from "moment";

import { SatelliteState, Status } from "./SatelliteState";

it("transistions to alert for all values below 160", () => {
  const states = [Status.ALERT, Status.OK, Status.RECOVERING];

  for (let i = 0; i < 160; i++) {
    const state = states[i % 3];
    expect(new SatelliteState(state).nextState(i).status).toEqual(Status.ALERT);
  }
});

it("transition to recovering when current state is alert and value is above 160", () => {
  const initialState = new SatelliteState(Status.ALERT);

  expect(initialState.nextState(160).status).toEqual(Status.RECOVERING);
});

it("stays recovering for one minute", () => {
  for (let i = 0; i < 60; i++) {
    const initialState = new SatelliteState(Status.RECOVERING, moment().subtract(i, "seconds").toDate());

    expect(initialState.nextState(160).status).toEqual(Status.RECOVERING);
  }
});

it("transition to Ok when current state is recovering, value is above 160", () => {
  const initialState = new SatelliteState(Status.RECOVERING, moment().subtract(61, "seconds").toDate());

  expect(initialState.nextState(160).status).toEqual(Status.OK);
});

it("stays Ok when current state is OK and value is above 160", () => {
  const initialState = new SatelliteState(Status.OK);

  expect(initialState.nextState(160).status).toEqual(Status.OK);
});
