import { PublishedSong } from '../music/Music';

export interface Spot {
  adminConnection: string;
  admins?: {
    [adminId: string]: boolean;
  };
  config: Config;
  coverPicture: string;
  coverPictureMin: string;
  coverPictureRef: string;
  musicTypeName?: string;
  creator: string;
  currentSong?: PublishedSong;
  description?: string;
  finishingSong: boolean;
  joinings?: number;
  location?: Location;
  logo: string;
  name: string;
  nextSongsIds?: { [key: string]: boolean };
  public: boolean;
  spotConnections: number;
  id: string;
  isOnline: boolean;
  adminConnections?: { [userId: string]: boolean };
  photos?: string[];
}

export interface Config {
  autoMute?: boolean;
  blockPost?: boolean;
  blockReact?: boolean;
  maxPostsPerSpot?: number;
  maxPostsPerUser?: number;
  multiplaying?: boolean;
  playlist?: boolean;
  provider?: 'youtube' | 'deezer';
  public?: boolean;
  [configKey: string]: UserConfigValue;
  isPhotosCarouselEnabled: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export type UserConfigValue = number | string | boolean | undefined;
export interface UserConfig {
  title: string;
  subtitle?: string;
  type: 'switch' | 'select';
  id: string;
  userType: 'admin' | 'all';
  options?: { label: string; value: number | string }[];
}
