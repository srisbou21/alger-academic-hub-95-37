
import React from 'react';
import { Bot } from "lucide-react";

export const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-full bg-gray-200 text-gray-600">
        <Bot className="h-4 w-4" />
      </div>
      <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );
};
