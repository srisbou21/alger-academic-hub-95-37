
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from 'lucide-react';

export const ChatbotAssistant = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Assistant Chatbot
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Assistant chatbot en cours de développement...</p>
      </CardContent>
    </Card>
  );
};
