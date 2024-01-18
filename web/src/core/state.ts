import { BlocReact } from 'bloc-react';
import BlocsFactory from '../BlocsFactory';

const selectedSpotBloc = BlocsFactory.spotsBloc();
const userBloc = BlocsFactory.userBloc();

const state = new BlocReact([userBloc, selectedSpotBloc]);
export const { useBloc, BlocProvider, BlocBuilder } = state;
export { selectedSpotBloc, userBloc };
