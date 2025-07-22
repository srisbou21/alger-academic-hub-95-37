
import React from 'react';
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  actions: string[];
  onActionClick: (action: string) => void;
}

export const QuickActions = ({ actions, onActionClick }: QuickActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onActionClick(action)}
          className="text-xs"
        >
          {action}
        </Button>
      ))}
    </div>
  );
};
