import { Subscription } from '../../core/domain/DataSubscriptions';
import PlayerService from '../../core/domain/music/PlayerService';

const API_URL = process.env.REACT_APP_API_URL;
const SPARE_TIME_TO_EXPIRE_IN_MS = 120000;
export default class SpotifyPlayerService implements PlayerService {
  isAuthRequiredToPlay = true;
  isAuthenticated?: boolean;
  private accessToken?: string | null;
  private tokenExpiresAt?: string | null;
  private refreshToken?: string | null;
  private loadSuccessCallback?: () => void;
  private loadErrorCallback?: (timeToRetryInSeconds: number) => void;
  private progressCallback?: (progress: number) => void;
  private sendingTrackEnd = false;
  private playerLoadTimeout?: ReturnType<typeof setTimeout>;
  private alreadyTriedToInit = false;
  private player: any;
  private deviceId?: string;
  private currentSongId?: string;
  private songLoadedId?: string;

  constructor() {
    this.accessToken = localStorage.getItem('spotify:accessToken');
    this.tokenExpiresAt = localStorage.getItem('spotify:expiresAt');
    this.refreshToken = localStorage.getItem('spotify:refreshToken');
    if (this.accessToken) this.isAuthenticated = true;
  }

  private isAccessTokenValid = () => {
    if (!this.tokenExpiresAt) return false;

    return (
      parseInt(this.tokenExpiresAt, 10) - SPARE_TIME_TO_EXPIRE_IN_MS >
      new Date().getTime()
    );
  };

  loadSDK(): Promise<void> {
    return new Promise(resolve => {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;

      document.body.appendChild(script);
      window.onSpotifyWebPlaybackSDKReady = () => {
        resolve();
      };
    });
  }

  refreshTokenIfNeeded = () => {
    if (this.isAccessTokenValid()) return Promise.resolve(this.accessToken);
    else return this.callRefreshToken();
  };

  initializePlayer = () => {
    this.accessToken = localStorage.getItem('spotify:accessToken');
    this.tokenExpiresAt = localStorage.getItem('spotify:expiresAt');
    this.refreshToken = localStorage.getItem('spotify:refreshToken');

    if (this.isAccessTokenValid()) return this.setUpPlayer();
    if (!this.refreshToken)
      return Promise.reject(new Error('No refresh token'));
    return this.callRefreshToken().then(() => {
      return this.setUpPlayer();
    });
  };

  setUpPlayer = () => {
    this.player = new window.Spotify.Player({
      name: 'Web Playback SDK',
      getOAuthToken: (cb: (token?: string | null) => void) => {
        cb(this.accessToken);
      },
      volume: 0.5,
    });

    return new Promise(resolve => {
      this.player.addListener(
        'ready',
        ({ device_id }: { device_id: string }) => {
          this.deviceId = device_id;
          resolve(device_id);
        },
      );

      this.player.addListener('not_ready', () => null);

      this.player.addListener('player_state_changed', (state: any) => {
        this.songLoadedId = state.track_window?.current_track?.uri;
      });

      this.player.connect();
    });
  };

  login = () => {
    throw new Error('Not implemented');
  };

  logout = () => {
    localStorage.removeItem('isAuthenticatedWithDeezer');
  };

  setCurrentSong = (songId: string | number) => {
    this.currentSongId = songId as string;
  };

  play = () => {
    if (this.songLoadedId === this.currentSongId) {
      this.player.togglePlay();
      return Promise.resolve();
    } else {
      return this.requestPlay();
    }
  };

  pause = () => {
    this.player.pause();
  };

  seek = (progressToSeek: number) => {
    return this.player.seek(progressToSeek);
  };

  setVolume = (volume: number) => window.DZ.player.setVolume(volume);

  getVolume = (): number => window.DZ.player.getVolume();

  subscribeToSongEndedEvent(): Subscription {
    throw new Error('Not Implemented');
  }

  releaseResources = () => {
    // TODO
  };

  subscribeToPlayerStateEvents = (callback: (state: any) => void) => {
    this.player.addListener('player_state_changed', (state: any) => {
      callback(state);
    });
    return {
      unsubscribe: () => null,
    };
  };

  private requestPlay = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.player._options.getOAuthToken((access_token: string) => {
        fetch(
          `https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`,
          {
            method: 'PUT',
            body: JSON.stringify({ uris: [this.currentSongId] }),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${access_token}`,
            },
          },
        )
          .then(response => {
            if (response.status <= 299) resolve();
            else reject();
          })
          .catch(e => reject(e));
      });
    });
  };

  private callRefreshToken = () =>
    fetch(`${API_URL}/auth/refresh?refresh_token=${this.refreshToken}`)
      .then(response => response.json())
      .then(result => {
        if (result.access_token) {
          this.accessToken = result.access_token;
          localStorage.setItem('spotify:accessToken', this.accessToken!);
          this.tokenExpiresAt = (new Date().getTime() + 3600 * 1000).toString();
          localStorage.setItem('spotify:expiresAt', this.tokenExpiresAt);
          if (result.refresh_token) {
            this.refreshToken = result.refresh_token;
            localStorage.setItem('spotify:refreshToken', this.refreshToken!);
          }
        }
        return result.access_token;
      });
}
