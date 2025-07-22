
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BookOpen, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const QuickActions = () => {
  const { toast } = useToast();

  const handleQuickAction = (actionName: string) => {
    toast({
      title: "Action rapide",
      description: `${actionName} (fonctionnalité à venir)`,
    });
  };

  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <FileText className="h-5 w-5" />
          Actions rapides
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <Button
          className="w-full justify-start bg-slate-700 hover:bg-slate-800"
          size="sm"
          onClick={() => handleQuickAction("Créer un nouveau cours")}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Créer un nouveau cours
        </Button>
        <Button
          className="w-full justify-start bg-purple-600 hover:bg-purple-700"
          size="sm"
          onClick={() => handleQuickAction("Mes encadrements")}
        >
          <Users className="mr-2 h-4 w-4" />
          Mes encadrements
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          size="sm"
          onClick={() => handleQuickAction("Générer liste émargement")}
        >
          <Users className="mr-2 h-4 w-4" />
          Générer liste émargement
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          size="sm"
          onClick={() => handleQuickAction("Exporter les résultats")}
        >
          <FileText className="mr-2 h-4 w-4" />
          Exporter les résultats
        </Button>
      </CardContent>
    </Card>
  );
};
