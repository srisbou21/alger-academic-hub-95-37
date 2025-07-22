
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface BibliographyTabProps {
  required: string[];
  recommended: string[];
}

export const BibliographyTab = ({ required, recommended }: BibliographyTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-red-700">Bibliographie Obligatoire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {required.map((book, index) => (
              <div key={index} className="p-3 border border-red-200 rounded-lg bg-red-50">
                <p className="text-red-800 text-sm font-medium">{book}</p>
              </div>
            ))}
          </div>
          <Button className="mt-4 bg-red-600 hover:bg-red-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter référence
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-slate-700">Bibliographie Recommandée</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommended.map((book, index) => (
              <div key={index} className="p-3 border border-slate-200 rounded-lg bg-slate-50">
                <p className="text-slate-800 text-sm">{book}</p>
              </div>
            ))}
          </div>
          <Button className="mt-4 bg-slate-600 hover:bg-slate-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter référence
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
