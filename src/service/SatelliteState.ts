import moment from "moment";

export enum Status {
  OK,
  RECOVERING,
  ALERT
}

export class SatelliteState {
  constructor(readonly status: Status, readonly statusUpdatedAt: Date = new Date()) {}

  public nextState(averageAltitude: number): SatelliteState {
    let result: SatelliteState;

    if (averageAltitude < 160) {
      result = new SatelliteState(Status.ALERT);
    } else if (this.status === Status.ALERT) {
      result = new SatelliteState(Status.RECOVERING);
    } else if (this.status === Status.RECOVERING && moment().subtract(1, "minute").isAfter(this.statusUpdatedAt)) {
      result = new SatelliteState(Status.OK);
    } else {
      result = this;
    }

    return result;
  }

}
