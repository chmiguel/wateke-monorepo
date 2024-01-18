import {Song} from '../../../../web/src/core/domain/music/Music';
import SongsService, {
  SuggestedSongsQuery,
} from '../../../../web/src/core/domain/music/SongsService';
import {YOUTUBE_API_KEY} from '../../constants/config';

// const API_KEY = 'AIzaSyARyx5p5rMNT5mObfwdGIBRoZfs5pft6lU'; // chmigueldev@gmail.com

export interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}

export interface Id {
  kind: string;
  videoId: string;
}

export interface Default {
  url: string;
  width: number;
  height: number;
}

export interface Medium {
  url: string;
  width: number;
  height: number;
}

export interface High {
  url: string;
  width: number;
  height: number;
}

export interface Thumbnails {
  default: Default;
  medium: Medium;
  high: High;
}

export interface Snippet {
  publishedAt: Date;
  channelId: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
  channelTitle: string;
  liveBroadcastContent: string;
  publishTime: Date;
}

export interface Item {
  kind: string;
  etag: string;
  id: Id;
  snippet?: Snippet;
}

export interface FoundVideos {
  kind: string;
  etag: string;
  nextPageToken: string;
  regionCode: string;
  pageInfo: PageInfo;
  items: Item[];
}

interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

interface Author {
  name: string;
  id: string;
  thumbnails: Thumbnail[];
}

interface ScrappedVideo {
  url: string;
  id: string;
  thumbnails: Thumbnail[];
  title: string;
  author: Author;
  viewCount: number;
  publishedTimeAgo: string;
  formattedDuration: string;
  formattedReadableDuration: string;
  formattedViewCount: string;
  description: string;
  duration: number;
}

const API_URL = process.env.REACT_APP_API_URL;

export default class YoutubeSongsService implements SongsService {
  getSuggestedSongs(queryParams: SuggestedSongsQuery): Promise<Song[]> {
    return fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&relatedToVideoId=${queryParams.currentSongId}&part=snippet&type=video&maxResults=20&videoEmbeddable=true`,
    )
      .then(res => {
        return res.json();
      })
      .then((foundVideos: FoundVideos) => {
        const foundSongs: Song[] = [];
        if (foundVideos.items)
          foundVideos.items.forEach(item => {
            if (item.snippet)
              foundSongs.push(this.parseYoutubeVideoToSong(item));
          });
        return foundSongs;
      });
  }

  searchSongs(searchText: string): Promise<Song[]> {
    return fetch(`${API_URL}/youtube/search?text=${searchText}`)
      .then(response => response.json())
      .then((result: ScrappedVideo[]) => {
        return result?.map(this.parseScrappedVideoToSong);
      });
  }

  private parseScrappedVideoToSong = (video: ScrappedVideo): Song => {
    return {
      id: video.id,
      artistName: video.author.name,
      artistId: video.author.id,
      title: video.title,
      pictureSmall: video.thumbnails[0]?.url,
      pictureMedium: video.thumbnails[0]?.url,
      provider: 'youtube',
      artistPicture: null,
    };
  };

  private parseYoutubeVideoToSong = (video: Item): Song => {
    return {
      id: video.id.videoId,
      artistName: video.snippet!.channelTitle,
      artistId: video.snippet!.channelId,
      title: video.snippet!.title,
      pictureSmall: video.snippet!.thumbnails.default.url,
      pictureMedium: video.snippet!.thumbnails.medium.url,
      provider: 'youtube',
      artistPicture: null,
    };
  };
}
