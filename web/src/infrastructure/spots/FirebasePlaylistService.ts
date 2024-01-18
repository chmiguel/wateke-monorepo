import firebase from 'firebase/app';
import { realTimeDatabase } from '../../lib/firebase';
import { User } from '../../core/domain/auth/User';
import { Subscription } from '../../core/domain/DataSubscriptions';
import { PublishedSong, Song } from '../../core/domain/music/Music';
import PlaylistService, {
  PlaylistCallback,
} from '../../core/domain/spots/PlaylistService';

export default class FirebasePlaylistService implements PlaylistService {
  private currentSpotId?: string;
  private playlistRef?: any;

  private updatePlaylistRef(spotId: string) {
    if (!this.playlistRef || this.currentSpotId !== spotId)
      this.playlistRef = realTimeDatabase.ref(`publishedSongs/${spotId}`);
    this.currentSpotId = spotId;
  }

  subscribeToPlaylistUpdates(
    spotId: string,
    callback: PlaylistCallback,
  ): Subscription {
    this.updatePlaylistRef(spotId);
    this.playlistRef.on('value', (snapshot: any) => {
      const results = snapshot.val();
      if (results)
        callback(this.sortSongsArray(results).filter(item => !!item.publisher));
      else callback([]);
    });
    return {
      unsubscribe: () => this.playlistRef.child('currentSong').off('value'),
    };
  }

  async reactToSong(
    publishedSongId: string,
    reaction: boolean,
    user: User,
    spotId: string,
  ): Promise<void> {
    const ref = realTimeDatabase.ref(
      `publishedSongs/${spotId}/${publishedSongId}/usersWhoLike`,
    );
    await ref.update({ [user.uid!]: reaction });
    const newUser = JSON.parse(JSON.stringify(user));
    delete user.accessToken;
    const refReactions = realTimeDatabase.ref(
      `publishedSongsReactions/${spotId}/${publishedSongId}`,
    );
    await refReactions.child(user.uid!).update({
      reaction,
      ...newUser,
    });
  }

  async addSong(spotId: string, song: Song, user: User): Promise<void> {
    const publisher = JSON.parse(JSON.stringify(user));
    delete publisher.accessToken;
    publisher.reaction = true;

    await this.playlistRef.push({
      spotId,
      publishDate: firebase.database.ServerValue.TIMESTAMP,
      publisher,
      song,
      usersWhoLike: {
        [user.uid!]: true,
      },
    });
  }

  resetPublishedSong(
    spotId: string,
    publishedSong: PublishedSong,
  ): Promise<void> {
    const refPublishedSongs = realTimeDatabase.ref(
      `publishedSongs/${spotId}/${publishedSong.id}`,
    );
    refPublishedSongs.update({
      usersWhoLike: {},
      publishDate: firebase.database.ServerValue.TIMESTAMP,
    });
    return realTimeDatabase
      .ref(`publishedSongsReactions/${spotId}/${publishedSong.id}`)
      .remove();
  }

  removeSong(spotId: string, publishedSongId: string): Promise<void> {
    const refPublishedSongs = realTimeDatabase.ref(
      `publishedSongs/${spotId}/${publishedSongId}`,
    );
    return refPublishedSongs.remove();
  }

  clearPlaylist(spotId: string) {
    const refPublishedSongs = realTimeDatabase.ref(`publishedSongs/${spotId}`);
    return refPublishedSongs.remove();
  }

  private sortSongsArray = (playlist: {
    [id: string]: PublishedSong;
  }): PublishedSong[] => {
    const newPlaylist = Object.keys(playlist).map(key => ({
      ...playlist[key],
      id: key,
    }));

    newPlaylist.sort((a: PublishedSong, b: PublishedSong) => {
      let aSum = 0;
      let bSum = 0;
      if (a.usersWhoLike) {
        Object.keys(a.usersWhoLike).forEach(item => {
          if (a.usersWhoLike?.[item] === true) {
            aSum += 1;
          } else {
            aSum -= 1;
          }
        });
      }
      if (b.usersWhoLike) {
        Object.keys(b.usersWhoLike).forEach(item => {
          if (b.usersWhoLike?.[item] === true) {
            bSum += 1;
          } else {
            bSum -= 1;
          }
        });
      }
      if (bSum - aSum === 0 && a.publishDate && b.publishDate) {
        return a.publishDate - b.publishDate;
      }
      return bSum - aSum;
    });
    return newPlaylist;
  };
}
