
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Calendar, Calculator, History, Target, FileText } from "lucide-react";

export const AcademicTabsList = () => {
  return (
    <TabsList className="grid w-full grid-cols-6 mb-8 bg-white shadow-sm border border-slate-200">
      <TabsTrigger 
        value="schedule"
        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
      >
        <Calendar className="h-4 w-4 mr-2" />
        Emploi du Temps
      </TabsTrigger>
      <TabsTrigger 
        value="grades"
        className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
      >
        <BookOpen className="h-4 w-4 mr-2" />
        Notes
      </TabsTrigger>
      <TabsTrigger 
        value="averages"
        className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
      >
        <Calculator className="h-4 w-4 mr-2" />
        Moyennes
      </TabsTrigger>
      <TabsTrigger 
        value="history"
        className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
      >
        <History className="h-4 w-4 mr-2" />
        Historique
      </TabsTrigger>
      <TabsTrigger 
        value="simulation"
        className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
      >
        <Target className="h-4 w-4 mr-2" />
        Simulation
      </TabsTrigger>
      <TabsTrigger 
        value="exams"
        className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
      >
        <FileText className="h-4 w-4 mr-2" />
        Examens
      </TabsTrigger>
    </TabsList>
  );
};
