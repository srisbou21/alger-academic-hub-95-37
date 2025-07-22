
import React from 'react';
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    type?: 'text' | 'suggestion' | 'action';
  };
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
      className={`flex items-start gap-3 ${
        message.sender === 'user' ? 'flex-row-reverse' : ''
      }`}
    >
      <div className={`p-2 rounded-full ${
        message.sender === 'user' 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-200 text-gray-600'
      }`}>
        {message.sender === 'user' ? 
          <User className="h-4 w-4" /> : 
          <Bot className="h-4 w-4" />
        }
      </div>
      <div className={`max-w-[80%] p-3 rounded-lg ${
        message.sender === 'user'
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-800'
      }`}>
        <p className="text-sm">{message.content}</p>
        <span className="text-xs opacity-70">
          {message.timestamp.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
};
