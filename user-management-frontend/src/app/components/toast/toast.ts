import { Component, inject } from '@angular/core';
import { MessageStore } from '../../stores/message-store';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../utils/messages';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class Toast {
  private store = inject(MessageStore);
  readonly messages = this.store.messages;

  getMessageText(msg: { type: 'error' | 'success'; code: string }): string {
    const dict = msg.type === 'error' ? ERROR_MESSAGES : SUCCESS_MESSAGES;
    return dict[msg.code] ?? `${msg.type.toUpperCase()}: ${msg.code}`;
  }

}
