import { Cubit } from 'bloc-react';
import SelectedSpotBloc from '../core/blocs/SelectedSpotBloc';
import { Spot } from '../core/domain/spots/Spot';
import SpotsRepository from '../core/domain/spots/SpotsRepository';
import NavigationService from '../core/domain/navigation/NavigationService';

interface MySpotsState {
  userSpots: Spot[];
  actionModal: {
    isOpen: boolean;
    title?: string;
    description?: string;
    onAccept?: () => void;
  };
}

export default class MySpotsBloc extends Cubit<MySpotsState> {
  spotsRepository: SpotsRepository;
  userId?: string;
  selectedSpotBloc: SelectedSpotBloc;
  navigationService: NavigationService;

  constructor(
    spotsRepository: SpotsRepository,
    selectedSpotBloc: SelectedSpotBloc,
    navigationService: NavigationService,
  ) {
    super({ userSpots: [], actionModal: { isOpen: false } });
    this.spotsRepository = spotsRepository;
    this.selectedSpotBloc = selectedSpotBloc;
    this.navigationService = navigationService;
  }

  start = async (userId: string) => {
    this.userId = userId;
    const userSpots = await this.spotsRepository.getUserSpots(userId);
    this.emit({ ...this.state, userSpots });
  };

  handleDeleteSpotPressed = (spot: Spot) => {
    this.emit({
      ...this.state,
      actionModal: {
        isOpen: true,
        title: `¿Desea eliminar el spot ${spot.name}?`,
        description: 'Esta acción no puede ser revertida.',
        onAccept: this.deleteSpot,
      },
    });
  };

  selectSpot = (spot: Spot) => {
    this.selectedSpotBloc.selectSpot(spot);
    this.navigationService.navigate('/dashboard');
  };

  deleteSpot = () => {
    // todo
  };

  closeActionModal = () => {
    this.emit({ ...this.state, actionModal: { isOpen: false } });
  };
}
