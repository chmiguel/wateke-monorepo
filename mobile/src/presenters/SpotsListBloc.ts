import {Cubit} from 'bloc-react';
import SelectedSpotBloc from '../../../web/src/core/blocs/SelectedSpotBloc';
import UserRepository from '../../../web/src/core/domain/auth/UserRepository';
import {Spot} from '../../../web/src/core/domain/spots/Spot';
import SpotsRepository from '../../../web/src/core/domain/spots/SpotsRepository';

interface SpotsListState {
  userSpots: Spot[];
  popularSpots: Spot[];
  foundSpots: Spot[];
  isSearchViewActive: boolean;
  isSearchingSpots: boolean;
  isLoadingSpots: boolean;
  searchText: string;
}

export default class SpotsListBloc extends Cubit<SpotsListState> {
  private userRepository: UserRepository;
  private spotsRepository: SpotsRepository;
  private selectedSpotBloc: SelectedSpotBloc;

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
      isLoadingSpots: false,
      searchText: '',
    });

    this.userRepository = userRepository;
    this.spotsRepository = spotsRepository;
    this.selectedSpotBloc = selectedSpotBloc;
  }

  start = async () => {
    this.emit({...this.state, isLoadingSpots: true});
    const popularSpots = await this.spotsRepository.getPopularSpots();
    this.emit({...this.state, popularSpots});
    const userSpots = await this.spotsRepository.getUserSpots(
      this.userRepository.user.uid!,
    );
    this.emit({...this.state, userSpots, isLoadingSpots: false});
  };

  selectSpot = (spot: Spot) => {
    this.selectedSpotBloc.selectSpot(spot);
    // TODO: Redirect
  };

  handleSearchTextChanged = (searchText: string) => {
    this.emit({...this.state, searchText});
  };

  search = async () => {
    if (!this.state.searchText) return;
    this.emit({
      ...this.state,
      foundSpots: [],
      isSearchViewActive: true,
      isSearchingSpots: true,
    });
    const foundSpots = await this.spotsRepository.searchSpots(
      this.state.searchText,
    );
    this.emit({...this.state, foundSpots, isSearchingSpots: false});
  };

  closeSearchView = () => this.emit({...this.state, isSearchViewActive: false});
}
