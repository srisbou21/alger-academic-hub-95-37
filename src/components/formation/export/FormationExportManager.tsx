
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormationOffer } from "../../../types/academic";
import { Download, FileText, Table, File } from "lucide-react";

interface FormationExportManagerProps {
  formations: FormationOffer[];
  selectedFormations: string[];
}

export const FormationExportManager = ({ formations, selectedFormations }: FormationExportManagerProps) => {
  const handleExportAll = (format: string) => {
    console.log(`Export de toutes les formations en format ${format}`);
    // Ici on implémenterait l'export réel
  };

  const handleExportSelected = (format: string) => {
    console.log(`Export des formations sélectionnées en format ${format}`, selectedFormations);
    // Ici on implémenterait l'export réel
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exporter les Formations</CardTitle>
          <p className="text-slate-600">
            Exportez vos données de formations dans différents formats
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Toutes les formations ({formations.length})</h3>
              <div className="space-y-2">
                <Button onClick={() => handleExportAll('pdf')} className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Exporter en PDF
                </Button>
                <Button onClick={() => handleExportAll('excel')} className="w-full justify-start" variant="outline">
                  <Table className="mr-2 h-4 w-4" />
                  Exporter en Excel
                </Button>
                <Button onClick={() => handleExportAll('csv')} className="w-full justify-start" variant="outline">
                  <File className="mr-2 h-4 w-4" />
                  Exporter en CSV
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Formations sélectionnées ({selectedFormations.length})</h3>
              <div className="space-y-2">
                <Button 
                  onClick={() => handleExportSelected('pdf')} 
                  className="w-full justify-start"
                  disabled={selectedFormations.length === 0}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Exporter en PDF
                </Button>
                <Button 
                  onClick={() => handleExportSelected('excel')} 
                  className="w-full justify-start" 
                  variant="outline"
                  disabled={selectedFormations.length === 0}
                >
                  <Table className="mr-2 h-4 w-4" />
                  Exporter en Excel
                </Button>
                <Button 
                  onClick={() => handleExportSelected('csv')} 
                  className="w-full justify-start" 
                  variant="outline"
                  disabled={selectedFormations.length === 0}
                >
                  <File className="mr-2 h-4 w-4" />
                  Exporter en CSV
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
