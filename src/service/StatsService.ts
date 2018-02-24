import axios from "axios";
import moment from "moment";
import logger from "../utils/logger";

import SatelliteStatsRepository from "../repository/SatelliteStatsRepository";
import { SatelliteState, Status } from "./SatelliteState";

export default class StatsService {
  public altitude = {
    average: 0,
    min: 0,
    max: 0
  };

  private nestioApiUrl = "http://nestio.space/api/satellite/data";
  private pollingInterval = 10000; // poll every ten seconds
  private timer?: NodeJS.Timer;
  private repo: SatelliteStatsRepository;
  private satelliteState = new SatelliteState(Status.OK);

  constructor() {
    this.repo = new SatelliteStatsRepository();
  }

  public startPolling() {
    if (!this.timer) {
      this.fetchAndUpdateSatelliteData();
      this.timer = setInterval(this.fetchAndUpdateSatelliteData, this.pollingInterval);
    }
  }

  public updateAltitudeData(altitude: number, updatedAt: string) {
    if (moment(updatedAt).isValid()) {
      this.repo.add({altitude, updatedAt: new Date(updatedAt)});
    }

    const altitudes = this.repo.fetchAltitudes();

    if (altitudes.length === 0) {
      this.altitude = {average: 0, min: 0, max: 0};
    } else {
      const average = (altitudes.reduce( (acc, val) => acc + val )) / altitudes.length;
      this.altitude = {average, min: Math.min.apply(null, altitudes), max: Math.max.apply(null, altitudes)};
    }

    // update state if we have more than one minute of data
    if (altitudes.length > 6) {
      this.satelliteState = this.satelliteState.nextState(this.altitude.average);
    }
  }

  public status(): Status {
    return this.satelliteState.status;
  }

  private fetchAndUpdateSatelliteData = async () => {
    logger.info("fetching satelite data");

    try {
      const response = await axios.get<{altitude: number, last_updated: string}>(this.nestioApiUrl);
      const data = response.data;
      logger.info(data, "fetched satellite data");

      this.updateAltitudeData(data.altitude, data.last_updated);
    } catch (error) {
      logger.error(error, "failed to fetch satellite data");
    }
  }
}
