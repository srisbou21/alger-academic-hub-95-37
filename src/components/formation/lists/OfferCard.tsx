
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Building2, Edit, Trash2 } from "lucide-react";
import { FormationOffer } from "../../../types/academic";

interface OfferCardProps {
  offer: FormationOffer;
  onEdit: (offer: FormationOffer) => void;
  onDelete: (offerId: string) => void;
}

export const OfferCard = ({ offer, onEdit, onDelete }: OfferCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-800">{offer.name}</h3>
            <p className="text-sm text-slate-600">{offer.code}</p>
          </div>
          <Badge variant="outline">{offer.level}</Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-600" />
            <span className="text-sm">{offer.modules.length} modules</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-green-600" />
            <span className="text-sm">{offer.sections.length} sections</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-purple-600" />
            <span className="text-sm">{offer.academicYear}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onEdit(offer)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onDelete(offer.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
