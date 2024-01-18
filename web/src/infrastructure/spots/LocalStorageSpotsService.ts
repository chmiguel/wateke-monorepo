import { Spot } from '../../core/domain/spots/Spot';
import { LocalSpotsService } from '../../core/domain/spots/SpotsService';

export default class LocalStorageSpotsService implements LocalSpotsService {
  spot: Spot | null;
  constructor() {
    this.spot = null;
  }

  getCurrentSpot() {
    try {
      const spotJson = localStorage.getItem('currentSpot');
      this.spot = JSON.parse(spotJson!) as Spot;
      return Promise.resolve(this.spot);
    } catch (error) {
      throw new Error('Parsing Current Spot Error');
    }
  }

  setCurrentSpot(spot: Spot): void {
    this.spot = spot;
    localStorage.setItem('currentSpot', JSON.stringify(spot));
  }

  jsonToSpot = ({ nextVideosIds, ...spot }: any): Spot => ({
    ...spot,
    nextSongsIds: nextVideosIds,
  });
}
