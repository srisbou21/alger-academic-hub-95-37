
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Edit, Plus } from "lucide-react";

interface Chapter {
  title: string;
  duration: string;
  content: string[];
}

interface SyllabusTabProps {
  chapters: Chapter[];
}

export const SyllabusTab = ({ chapters }: SyllabusTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <FileText className="h-5 w-5" />
          Contenu du Programme
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {chapters.map((chapter, index) => (
            <div key={index} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-blue-800">
                  Chapitre {index + 1}: {chapter.title}
                </h4>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-600 text-white">{chapter.duration}</Badge>
                  <Button size="sm" variant="ghost" className="text-blue-600">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <ul className="space-y-1 text-blue-700">
                {chapter.content.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter chapitre
        </Button>
      </CardContent>
    </Card>
  );
};
