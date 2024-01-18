import React from 'react';
import {PlayerProps} from '../../../web/src/core/domain/music/PlayerProps';
import YoutubePlayer from './YoutubePlayer';

const Player = (props: PlayerProps) => {
  return <YoutubePlayer {...props} />;
};

export default Player;
