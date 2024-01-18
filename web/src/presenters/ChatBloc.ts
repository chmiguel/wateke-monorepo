import { Cubit } from 'bloc-react';
import { parseMentions } from '../lib/utilities';
import { User } from '../core/domain/auth/User';
import { ChatMessage, ReplyPayload } from '../core/domain/chat/Chat';
import ChatRepository from '../core/domain/chat/ChatRepository';
import { Subscription } from '../core/domain/DataSubscriptions';

interface ChatState {
  isChatVisible: boolean;
  currentMessage: string;
  messages: ChatMessage[];
  reply?: ReplyPayload;
}

export default class ChatBloc extends Cubit<ChatState> {
  private readonly chatRepository: ChatRepository;
  private messagesSubscription?: Subscription;
  private scrollToLastMessage?: () => void;
  private focusMessageInput?: () => void;
  private user?: User;

  constructor(chatRepository: ChatRepository) {
    super({ isChatVisible: false, currentMessage: '', messages: [] });
    this.chatRepository = chatRepository;
  }

  private onChatMessagesUpdated = (messages: ChatMessage[]) => {
    this.emit({ ...this.state, messages });
    this.scrollToLastMessage?.();
  };

  private getReplyFromSongMessage = (message: ChatMessage): ReplyPayload => ({
    senderName: message.senderName,
    senderAvatar: message.senderAvatar,
    senderUID: message.senderUID,
    songTitle: message.songTitle,
    songArtistName: message.songArtistName,
    songThumbnail: message.songThumbnail,
    type: 'song',
    id: message.id,
  });

  private getReplyFromMessage = (message: ChatMessage): ReplyPayload => ({
    senderName: message.senderName,
    senderAvatar: message.senderAvatar,
    senderUID: message.senderUID,
    message: message.message,
    id: message.id,
    type: 'text',
  });

  start = (
    user: User,
    scrollToLastMessage: () => void,
    focusMessageInput: () => void,
  ) => {
    this.user = user;
    this.scrollToLastMessage = scrollToLastMessage;
    this.focusMessageInput = focusMessageInput;
    this.messagesSubscription =
      this.chatRepository.subscribeToChatMessagesUpdates(
        this.onChatMessagesUpdated,
      );
  };

  unmount = () => {
    this.messagesSubscription?.unsubscribe();
  };

  prepareReply = (reply: ReplyPayload) => {
    this.emit({ ...this.state, reply });
  };

  prepareReplyForMessage = (message: ChatMessage) => {
    let reply: ReplyPayload;
    if (message.type === 'song') reply = this.getReplyFromSongMessage(message);
    else reply = this.getReplyFromMessage(message);
    this.emit({ ...this.state, reply: reply! });
    this.focusMessageInput?.();
  };

  removeReply = () => {
    this.emit({ ...this.state, reply: undefined });
  };

  handleCurrentMessageTextChange = (text: string) => {
    const { messages, ...rest } = this.state;
    this.emit({ messages: messages, ...rest, currentMessage: text });
  };

  sendCurrentMessage = () => {
    if (!this.state.currentMessage) return;
    const { mentions, text: message } = parseMentions(
      this.state.currentMessage,
    );
    const newMessage: ChatMessage = {
      type: 'text',
      message: message,
      senderName: this.user!.name!,
      senderAvatar: this.user!.avatar!,
      senderUID: this.user!.uid!,
      mentions,
      id: 'pendingMessage',
    };
    if (this.state.reply) {
      newMessage.repliedMessage = this.state.reply;
      newMessage.type = 'reply';
    }
    this.chatRepository.addMessage(newMessage);
    this.emit({
      ...this.state,
      messages: [...this.state.messages, newMessage],
      currentMessage: '',
      reply: undefined,
    });
    this.scrollToLastMessage?.();
  };

  addEmojiToCurrentText = (emoji: string) => {
    this.emit({
      ...this.state,
      currentMessage: `${this.state.currentMessage}${emoji}`,
    });
  };
}
