
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface TimeSlotSelectorProps {
  value: number;
  onChange: (value: number) => void;
  type: 'cm' | 'td' | 'tp';
  label: string;
}

const timeSlots = [
  { value: 1.5, label: '1h30', sessions: 1 },
  { value: 3, label: '3h', sessions: 2 },
  { value: 4.5, label: '4h30', sessions: 3 },
  { value: 6, label: '6h', sessions: 4 },
  { value: 7.5, label: '7h30', sessions: 5 },
  { value: 9, label: '9h', sessions: 6 },
  { value: 10.5, label: '10h30', sessions: 7 },
  { value: 12, label: '12h', sessions: 8 },
  { value: 13.5, label: '13h30', sessions: 9 },
  { value: 15, label: '15h', sessions: 10 },
  { value: 16.5, label: '16h30', sessions: 11 },
  { value: 18, label: '18h', sessions: 12 },
  { value: 19.5, label: '19h30', sessions: 13 },
  { value: 21, label: '21h', sessions: 14 },
  { value: 22.5, label: '22h30', sessions: 15 },
  { value: 24, label: '24h', sessions: 16 },
  { value: 25.5, label: '25h30', sessions: 17 },
  { value: 27, label: '27h', sessions: 18 },
  { value: 28.5, label: '28h30', sessions: 19 },
  { value: 30, label: '30h', sessions: 20 }
];

export const TimeSlotSelector = ({ value, onChange, type, label }: TimeSlotSelectorProps) => {
  const selectedSlot = timeSlots.find(slot => slot.value === value);
  
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select 
        value={value.toString()} 
        onValueChange={(val) => onChange(parseFloat(val))}
      >
        <SelectTrigger>
          <SelectValue placeholder={`Sélectionner ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {timeSlots.map(slot => (
            <SelectItem key={slot.value} value={slot.value.toString()}>
              <div className="flex items-center justify-between w-full">
                <span>{slot.label}</span>
                <span className="text-xs text-slate-500 ml-2">
                  ({slot.sessions} séance{slot.sessions > 1 ? 's' : ''})
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedSlot && (
        <p className="text-xs text-slate-600">
          {selectedSlot.sessions} séance{selectedSlot.sessions > 1 ? 's' : ''} de 1h30
        </p>
      )}
    </div>
  );
};
