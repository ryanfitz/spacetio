import { OrderedSet } from "immutable";
import moment from "moment";

export interface StatReading {
  updatedAt: Date;
  altitude: number;
}

// internal type to prevent duplicate stat readings for the same timestamp
// the time of the reading acts as the uniq identifier
export class StatValueType {
  public updatedAt: Date;
  public altitude: number;

  constructor(data: StatReading) {
    this.updatedAt = data.updatedAt;
    this.altitude = data.altitude;
  }

  public equals(other: StatValueType): boolean {
    return this.updatedAt.toISOString() === other.updatedAt.toISOString();
  }

  public hashCode(): number {
    return this.updatedAt.valueOf();
  }
}

export default class SatelliteStatsRepository {
  // store readings in a set to prevent duplicate entries for the same timestamp
  private stats: OrderedSet<StatValueType>;

  constructor() {
    this.stats = OrderedSet<StatValueType>([]);
  }

  public add(reading: StatReading) {
    const fiveMinutesAgo = moment().subtract(5, "minutes");

    const valType = new StatValueType(reading);

    this.stats = this.stats.add(valType).filter((stat) => {
      if (stat) {
        return fiveMinutesAgo.isSameOrBefore(stat.updatedAt);
      } else {
        return false;
      }
    }).toOrderedSet();
  }

  public fetchAltitudes(): number[] {

    return this.stats.toArray().map((stat): number => {
      return stat.altitude;
    });
  }
}
