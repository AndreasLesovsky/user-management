export interface AppMessage {
  id: number;
  type: 'error' | 'success';
  code: string; // z. B. 'EMAIL_ALREADY_EXISTS' oder 'USER_CREATED', 1:1 aus dem Backend gemapped in utils/messages.ts
  status?: number;
}