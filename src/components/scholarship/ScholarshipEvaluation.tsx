import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export const ScholarshipEvaluation = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Évaluation des Demandes</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Module d'évaluation et de traitement des demandes de bourses</p>
          <div className="flex gap-2 mt-4">
            <Button className="bg-green-600"><CheckCircle className="h-4 w-4 mr-2" />Approuver</Button>
            <Button variant="destructive"><XCircle className="h-4 w-4 mr-2" />Rejeter</Button>
            <Button variant="outline"><Clock className="h-4 w-4 mr-2" />Mettre en attente</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};