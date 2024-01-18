export interface ReplyPayload {
  publishedSongId?: string;
  songTitle?: string;
  songArtistName?: string;
  songThumbnail?: string;
  senderName: string;
  senderAvatar: string;
  message?: string;
  senderUID: string;
  userColor?: string;
  type: 'song' | 'text';
  mentions?: { [userId: string]: boolean } | null;
  id?: string;
}

export interface ChatMessage extends Omit<ReplyPayload, 'type'> {
  createdAt?: { seconds: number };
  pending?: boolean;
  repliedMessage?: ChatMessage;
  type: 'reply' | 'text' | 'song';
  userColor?: string;
}
