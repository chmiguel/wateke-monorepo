import React from 'react';
import DeezerPlayer from './DeezerPlayer';
import { PlayerProps } from '../../core/domain/music/PlayerProps';
import SpotifyPlayer from './SpotifyPlayer';
import YoutubePlayer from './YoutubePlayer';

const Player: React.FC<PlayerProps> = props => {
  switch (props.musicProvider) {
    case 'youtube':
      return <YoutubePlayer {...props} />;
    case 'deezer':
      return <DeezerPlayer {...props} />;
    case 'spotify':
      return <SpotifyPlayer {...props} />;
    default:
      return null;
  }
};

export default Player;
