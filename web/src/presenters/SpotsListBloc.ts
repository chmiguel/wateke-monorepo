import { Cubit } from 'bloc-react';
import history from '../history';
import SelectedSpotBloc from '../core/blocs/SelectedSpotBloc';
import UserRepository from '../core/domain/auth/UserRepository';
import { Spot } from '../core/domain/spots/Spot';
import SpotsRepository from '../core/domain/spots/SpotsRepository';

interface SpotsListState {
  userSpots: Spot[];
  popularSpots: Spot[];
  foundSpots: Spot[];
  isSearchViewActive: boolean;
  isSearchingSpots: boolean;
}

export default class SpotsListBloc extends Cubit<SpotsListState> {
  private userRepository: UserRepository;
  private spotsRepository: SpotsRepository;
  private selectedSpotBloc: SelectedSpotBloc;
  searchText = '';

  constructor(
    userRepository: UserRepository,
    spotsRepository: SpotsRepository,
    selectedSpotBloc: SelectedSpotBloc,
  ) {
    super({
      userSpots: [],
      popularSpots: [],
      foundSpots: [],
      isSearchViewActive: false,
      isSearchingSpots: false,
    });

    this.userRepository = userRepository;
    this.spotsRepository = spotsRepository;
    this.selectedSpotBloc = selectedSpotBloc;
  }

  start = async () => {
    const popularSpots = await this.spotsRepository.getPopularSpots();
    this.emit({ ...this.state, popularSpots });
    const userSpots = await this.spotsRepository.getUserSpots(
      this.userRepository.user.uid!,
    );
    this.emit({ ...this.state, userSpots });
  };

  selectSpot = (spot: Spot) => {
    this.selectedSpotBloc.selectSpot(spot);
    history.replace('/dashboard');
  };

  handleSearchTextChanged = (searchText: string) => {
    this.searchText = searchText;
  };

  search = async () => {
    if (!this.searchText) return;
    this.emit({
      ...this.state,
      foundSpots: [],
      isSearchViewActive: true,
      isSearchingSpots: true,
    });
    const foundSpots = await this.spotsRepository.searchSpots(this.searchText);
    this.emit({ ...this.state, foundSpots, isSearchingSpots: false });
  };

  closeSearchView = () =>
    this.emit({ ...this.state, isSearchViewActive: false });
}
