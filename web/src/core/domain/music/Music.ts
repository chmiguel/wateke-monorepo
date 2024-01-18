import { User } from '../auth/User';


export type MusicProvider = 'deezer' | 'youtube' | 'spotify'

export interface PublishedSong {
  id: string;
  publishDate: number;
  publisher: User;
  song: Song;
  spotId: string;
  usersWhoLike?: { [userId: string]: boolean };
}
export interface Song {
  artistName: string;
  artistId?: string;
  artistPicture: string|null;
  albumTitle?: string;
  pictureSmall: string;
  pictureMedium?: string;
  duration?: number;
  id: number | string;
  title: string;
  provider: MusicProvider;
}
export interface SongVM extends Song {
  durationFormatted: string;
  isAlreadyInPlaylist: boolean;
}
