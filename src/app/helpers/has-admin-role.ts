import { ConversationRole } from '../enums';
import { Conversation } from '../types';


export function hasAdminRole(conversation: Conversation): boolean {
  return conversation.accountConversationRoles.indexOf(ConversationRole.Admin) !== -1;
}