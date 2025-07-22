import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Upload } from "lucide-react";

export const ScholarshipDocuments = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Génération automatique des attestations et archivage des documents numérisés</p>
          <div className="flex gap-2 mt-4">
            <Button className="bg-blue-600"><FileText className="h-4 w-4 mr-2" />Générer Attestations</Button>
            <Button variant="outline"><Download className="h-4 w-4 mr-2" />Télécharger</Button>
            <Button variant="outline"><Upload className="h-4 w-4 mr-2" />Archive</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};