import { Cubit } from 'bloc-react';
import history from '../history';
import SelectedSpotBloc from '../core/blocs/SelectedSpotBloc';
import UserBloc from '../core/blocs/UserBloc';
import { Spot } from '../core/domain/spots/Spot';
import SpotsRepository from '../core/domain/spots/SpotsRepository';

interface SpotInviteState {
  spot?: Spot;
  isSpotCardVisible: boolean;
  isJoiningToSpot: boolean;
}

export default class SpotInviteBloc extends Cubit<SpotInviteState> {
  private userBloc: UserBloc;
  private spotsRepository: SpotsRepository;
  private selectedSpotBloc: SelectedSpotBloc;

  constructor(
    userBloc: UserBloc,
    selectedSpotBloc: SelectedSpotBloc,
    spotsRepository: SpotsRepository,
  ) {
    super({ isSpotCardVisible: false, isJoiningToSpot: false });
    this.userBloc = userBloc;
    this.spotsRepository = spotsRepository;
    this.selectedSpotBloc = selectedSpotBloc;
  }

  start = async (spotId: string) => {
    const spot = await this.spotsRepository.fetchSpot(spotId);
    this.emit({ ...this.state, spot });
  };

  joinToSpot = async () => {
    try {
      const isUserNotLoggedIn = !this.userBloc.state.uid;
      if (isUserNotLoggedIn) await this.userBloc.authenticateWithGoogle();
      this.selectedSpotBloc.selectSpot(this.state.spot!);
      history.replace('/dashboard');
    } catch (error) {
      // TODO handle error
    }
  };
}
