import { LocalSpotsService } from '../spots/SpotsService';
import { ChatMessage } from './Chat';
import ChatService, { ChatMessagesCallback } from './ChatService';

export default class ChatRepository {
  private readonly chatService: ChatService;
  private readonly localSpotsService: LocalSpotsService;

  constructor(chatService: ChatService, localSpotsService: LocalSpotsService) {
    this.chatService = chatService;
    this.localSpotsService = localSpotsService;
  }

  subscribeToChatMessagesUpdates(callback: ChatMessagesCallback) {
    return this.chatService.subscribeToChatMessagesUpdates(
      this.localSpotsService.spot!.id,
      callback,
    );
  }

  addMessage(message: ChatMessage) {
    return this.chatService.addMessage(
      this.localSpotsService.spot!.id,
      message,
    );
  }
}
