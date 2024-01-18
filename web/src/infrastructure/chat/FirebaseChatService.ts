// @ts-nocheck
import { ChatMessage } from '../../core/domain/chat/Chat';
import firebase from 'firebase/app';
import ChatService, {
  ChatMessagesCallback,
} from '../../core/domain/chat/ChatService';
import { Subscription } from '../../core/domain/DataSubscriptions';
import randomMC from 'random-material-color';
import { firestore } from '../../lib/firebase';

export default class FirebaseChatService implements ChatService {
  private chatRef?: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;
  private chatId?: string;

  private updateChatRef(chatId: string) {
    if (this.chatId === chatId) return;
    this.chatId = chatId;
    this.chatRef = firestore
      .collection('chat')
      .doc(this.chatId)
      .collection('messages');
  }

  subscribeToChatMessagesUpdates(
    chatId: string,
    callback: ChatMessagesCallback,
  ): Subscription {
    this.updateChatRef(chatId);
    const unsubscribe = this.chatRef!.orderBy('createdAt')
      .limitToLast(80)
      .onSnapshot(docs => {
        if (docs.empty) return callback([]);
        const data: ChatMessage[] = [];
        docs.forEach(item => {
          const message = item.data() as any;
          const userColor = randomMC.getColor({ text: message.senderName });
          data.push({
            ...message,
            id: item.id,
            userColor,
            songThumbnail: message.songThumbnail || message.thumbnail,
          });
        });
        callback(data);
      });
    return {
      unsubscribe,
    };
  }
  async addMessage(chatId: string, message: ChatMessage): Promise<void> {
    this.updateChatRef(chatId);
    await this.chatRef?.add({
      ...message,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }
}
