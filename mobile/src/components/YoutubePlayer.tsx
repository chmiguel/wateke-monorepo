import React, {useState} from 'react';
import {PlayerProps} from '../../../web/src/core/domain/music/PlayerProps';
import YouTube from 'react-native-youtube';
import {YOUTUBE_API_KEY} from '../constants/config';

const YoutubePlayer: React.FC<PlayerProps> = props => {
  const [isPlayig, setIsPlayig] = useState(false);
  return (
    <YouTube
      apiKey={YOUTUBE_API_KEY}
      videoId={props.song?.id?.toString()} // The YouTube video ID
      play={isPlayig}
      onReady={props.onPlayerReady}
      onChangeState={e => {
        if (e.state === 'playing') setIsPlayig(true);
        if (e.state === 'paused') setIsPlayig(false);
        if (e.state === 'ended') props.onSongEnded?.();
      }}
      controls={1}
      onError={e => console.log(e.error)}
      style={{alignSelf: 'stretch', width: '100%', height: '100%'}}
    />
  );
};

export default YoutubePlayer;
