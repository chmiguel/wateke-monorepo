import { getDeezerPlayerBounds } from '../../components/dashboard/DeezerPlayer';
import { Subscription } from '../../core/domain/DataSubscriptions';
import PlayerService from '../../core/domain/music/PlayerService';

export default class DeezerPlayerService implements PlayerService {
  loadSuccessCallback?: () => void;
  loadErrorCallback?: (timeToRetryInSeconds: number) => void;
  progressCallback?: (progress: number) => void;
  isAuthRequiredToPlay = true;
  isAuthenticated?: boolean;
  sendingTrackEnd = false;
  playerLoadTimeout?: ReturnType<typeof setTimeout>;
  alreadyTriedToInit = false;

  constructor() {
    const isAuthenticated = localStorage.getItem('isAuthenticatedWithDeezer');
    if (isAuthenticated) this.isAuthenticated = true;
  }

  loadSDK(progressCallback: (progress: number) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loadSuccessCallback = resolve;
      this.loadErrorCallback = reject;
      this.progressCallback = progressCallback;

      this.load();
    });
  }

  load = (numberOfIntents?: number) => {
    const xhr = new XMLHttpRequest();
    const tag = document.createElement('script');
    xhr.open('GET', 'https://cdns-files.dzcdn.net/js/min/dz.js', true);
    xhr.onload = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          tag.text = xhr.response;
          document.head.appendChild(tag);
          this.loadSuccessCallback?.();
        }
      }
    };
    xhr.onerror = () => {
      const nextNumberOfIntents = numberOfIntents ? numberOfIntents + 1 : 1;
      setTimeout(() => {
        this.loadErrorCallback?.(nextNumberOfIntents * 5);
        this.load(nextNumberOfIntents > 10 ? 10 : nextNumberOfIntents);
      }, 5000 * nextNumberOfIntents);
    };
    xhr.onprogress = e => {
      this.progressCallback?.(100 * Math.min(1, e.loaded / 2065079));
    };
    xhr.send();
  };

  initializePlayer = (loadTimeout?: number) => {
    return new Promise((resolve, reject) => {
      if (this.alreadyTriedToInit) return resolve(window.DZ.player.reconnect());
      const isMobile = window.innerWidth <= 420;
      const { width, height, format } = getDeezerPlayerBounds();
      const playerProps = {
        container: isMobile ? undefined : 'my-player',
        width,
        height,
        format,
      };
      window.DZ.init({
        appId: '394924',
        channelUrl: 'https://watekemusic.com/channel.html',
        player: {
          ...playerProps,
          onload: () => {
            this.alreadyTriedToInit = true;
            clearTimeout(this.playerLoadTimeout!);
            resolve(undefined);
          },
        },
      });
      this.playerLoadTimeout = setTimeout(() => {
        this.releaseResources();
        reject();
      }, loadTimeout);
    });
  };

  login = () => {
    return new Promise((resolve, reject) => {
      window.DZ.init({
        appId: '394924',
        channelUrl: 'https://watekemusic.com/channel.html',
      });
      window.DZ.login(
        (response: any) => {
          if (!response.authResponse) return reject();
          localStorage.setItem('isAuthenticatedWithDeezer', 'true');
          resolve(undefined);
          if (!this.isAuthenticated)
            setTimeout(() => {
              window.location.reload();
            }, 3000);
        },
        { perms: 'basic_access,email' },
      );
    });
  };

  logout = () => {
    localStorage.removeItem('isAuthenticatedWithDeezer');
  };

  setCurrentSong = (songId: string | number, params: { autoPlay: boolean }) => {
    window.DZ.player.playTracks([songId], params.autoPlay);
  };

  play = () => window.DZ.player.play();

  pause = () => window.DZ.player.pause();

  setVolume = (volume: number) => window.DZ.player.setVolume(volume);

  getVolume = (): number => window.DZ.player.getVolume();

  subscribeToSongEndedEvent(callback: () => void): Subscription {
    const listener = () => {
      callback();
      this.sendingTrackEnd = true;
      setTimeout(() => {
        this.sendingTrackEnd = false;
      }, 1000);
    };
    window.DZ.Event.subscribe('track_end', listener);
    return {
      unsubscribe: () => window.DZ.Event.unsubscribe('track_end', listener),
    };
  }

  releaseResources = () => {
    if (window.DZ && window.DZ.clearDeezer) window.DZ.clearDeezer();
  };
}
