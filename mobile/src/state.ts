import {BlocReact} from 'bloc-react';
import BlocFactory from './BlocsFactory';

const selectedSpotBloc = BlocFactory.spotsBloc();

const state = new BlocReact([BlocFactory.userBloc(), selectedSpotBloc]);

export const {useBloc, withBlocProvider, BlocBuilder, BlocProvider} = state;

export {selectedSpotBloc};
