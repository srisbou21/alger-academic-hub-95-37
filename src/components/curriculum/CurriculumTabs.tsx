
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormationStructure } from "../FormationStructure";
import { CanevasManager } from "./CanevasManager";
import { BookOpen, Palette } from "lucide-react";

interface CurriculumTabsProps {
  selectedFormation: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const CurriculumTabs = ({ selectedFormation, activeTab, onTabChange }: CurriculumTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="canevas" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Canevas
        </TabsTrigger>
        <TabsTrigger value="visualisation" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Visualisation
        </TabsTrigger>
      </TabsList>

      <TabsContent value="canevas" className="space-y-6">
        <CanevasManager />
      </TabsContent>

      <TabsContent value="visualisation" className="space-y-6">
        <FormationStructure selectedFormation={selectedFormation} />
      </TabsContent>
    </Tabs>
  );
};
