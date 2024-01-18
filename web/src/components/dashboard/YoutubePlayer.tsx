import React, { useCallback, useEffect, useRef } from 'react';
import { PlayerProps } from '../../core/domain/music/PlayerProps';
import YouTube from 'react-youtube';

enum PlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5,
}

const YoutubePlayer: React.FC<PlayerProps> = props => {
  const isPlaying = useRef(false);
  const player = useRef<any>();
  const errorTimeout = useRef<ReturnType<typeof setTimeout>>();

  const handlePlayerReady = useCallback(
    (event: { target: any }) => {
      if (!isPlaying.current) props.onPlayerReady?.();

      player.current = event.target;
      if (props.songId && isPlaying.current && player.current)
        player.current.playVideo();
    },
    [props.songId, props.onPlayerReady],
  );

  const handlePlayerStateChanged = useCallback((event: any) => {
    if (event.data === PlayerState.PLAYING) {
      if (errorTimeout.current) clearTimeout(errorTimeout.current);
      isPlaying.current = true;
    }
  }, []);

  useEffect(() => {
    if (props.songId && isPlaying.current) {
      if (errorTimeout.current) clearTimeout(errorTimeout.current);
      errorTimeout.current = setTimeout(() => {
        props.onSongEnded?.();
      }, 20000);
    }
    return () => {
      if (errorTimeout.current) clearTimeout(errorTimeout.current);
    };
  }, [props.songId]);

  return (
    <YouTube
      onReady={handlePlayerReady}
      onStateChange={handlePlayerStateChanged}
      onEnd={props.onSongEnded}
      videoId={props.songId as string}
    />
  );
};

export default YoutubePlayer;
