
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export const ChatInput = ({ value, onChange, onSend, disabled }: ChatInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !disabled) {
      onSend();
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tapez votre message..."
        onKeyPress={handleKeyPress}
        disabled={disabled}
        className="flex-1"
      />
      <Button 
        onClick={onSend}
        disabled={!value.trim() || disabled}
        size="sm"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};
