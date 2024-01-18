import { Subscription } from "../DataSubscriptions";
import { ChatMessage } from "./Chat";

export type ChatMessagesCallback = (messages: ChatMessage[])=>void

export default interface ChatService {
    subscribeToChatMessagesUpdates(chatId: string, callback: ChatMessagesCallback): Subscription;
    addMessage(chatId: string, message: ChatMessage): Promise<void>
}