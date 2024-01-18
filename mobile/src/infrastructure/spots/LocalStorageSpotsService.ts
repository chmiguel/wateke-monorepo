import {Spot} from '../../../../web/src/core/domain/spots/Spot';
import {LocalSpotsService} from '../../../../web/src/core/domain/spots/SpotsService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class LocalStorageSpotsService implements LocalSpotsService {
  spot: Spot | null;
  constructor() {
    this.spot = null;
  }

  async getCurrentSpot(): Promise<Spot | null> {
    try {
      const spotJson = await AsyncStorage.getItem('currentSpot');
      this.spot = JSON.parse(spotJson!) as Spot;
      return this.spot;
    } catch (error) {
      throw new Error('Parsing Current Spot Error');
    }
  }

  setCurrentSpot(spot: Spot): void {
    this.spot = spot;
    AsyncStorage.setItem('currentSpot', JSON.stringify(spot));
  }

  jsonToSpot = ({nextVideosIds, ...spot}: any): Spot => ({
    ...spot,
    nextSongsIds: nextVideosIds,
  });
}
