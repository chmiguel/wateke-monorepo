import { MusicProvider, Song } from './Music';

export interface PlayerProps {
  onSongEnded?: () => void;
  onSongAboutToEnd?: () => void;
  onPlayerReady?: () => void;
  shouldFadeSoundWhenFinishingSong?: boolean;
  songId?: number | string;
  song?: Song;
  isSongFinishing?: boolean;
  musicProvider?: MusicProvider;
  shouldKeepPlayerHidden?: boolean;
}
