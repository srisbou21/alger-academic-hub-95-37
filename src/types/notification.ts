
export interface Notification {
  id: string;
  type: 'reservation_created' | 'reservation_approved' | 'reservation_rejected' | 'conflict_detected' | 'reminder' | 'maintenance';
  title: string;
  message: string;
  recipient: string;
  channel: 'email' | 'push' | 'sms';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'sent' | 'failed';
  createdAt: Date;
  scheduledAt?: Date;
  data?: any;
}

export interface NotificationTemplate {
  id: string;
  type: string;
  subject: string;
  body: string;
  variables: string[];
}
