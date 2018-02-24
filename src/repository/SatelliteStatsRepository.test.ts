import { } from "jest";
import moment from "moment";
import { default as SatelliteStatsRepository, StatValueType } from "./SatelliteStatsRepository";

describe("fetchAltitudes", () => {

  it("returns empty list", () => {
    const repo = new SatelliteStatsRepository();

    expect(repo.fetchAltitudes()).toEqual([]);
  });

  it("returns single altitude", () => {
    const repo = new SatelliteStatsRepository();
    repo.add({ altitude: 5, updatedAt: new Date() });

    expect(repo.fetchAltitudes()).toEqual([5]);
  });

  it("only returns readings within 5 minutes", () => {
    const repo = new SatelliteStatsRepository();

    const fiveMinutesAgo = moment().subtract(5, "minutes");
    const fiveMinutes1SecondAgo =  fiveMinutesAgo.clone().subtract(1, "second");
    const fourMinutes59SecondsAgo = fiveMinutesAgo.clone().add(1, "second");

    repo.add({ altitude: 1, updatedAt: fiveMinutes1SecondAgo.toDate() });
    repo.add({ altitude: 2, updatedAt: fourMinutes59SecondsAgo.toDate() });

    expect(repo.fetchAltitudes()).toEqual([2]);
  });

  it("ignores duplicate entries", () => {
    const repo = new SatelliteStatsRepository();
    const date = new Date();

    repo.add({ altitude: 5, updatedAt: date });
    repo.add({ altitude: 6, updatedAt: date });

    expect(repo.fetchAltitudes()).toEqual([5]);
  });
});

describe("StatValueType", () => {
  it("equal when dates match", () => {
    const date = new Date();

    const reading1 = new StatValueType({altitude: 5, updatedAt: date});
    const reading2 = new StatValueType({altitude: 6, updatedAt: date});

    expect(reading1.equals(reading2)).toBeTruthy();
    expect(reading1.hashCode()).toEqual(reading2.hashCode());
  });

  it("not equal when dates differ", () => {
    const reading1 = new StatValueType({altitude: 5, updatedAt: new Date()});
    const reading2 = new StatValueType({altitude: 5, updatedAt: moment().subtract(1, "second").toDate()});

    expect(reading1.equals(reading2)).toBeFalsy();
    expect(reading1.hashCode()).not.toEqual(reading2.hashCode());
  });
});
