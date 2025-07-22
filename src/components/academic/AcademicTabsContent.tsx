
import { TabsContent } from "@/components/ui/tabs";
import { PersonalizedSchedule } from "./PersonalizedSchedule";
import { RealTimeGrades } from "./RealTimeGrades";
import { AutomaticAverages } from "./AutomaticAverages";
import { GradeSimulation } from "./GradeSimulation";
import { ExamCalendar } from "./ExamCalendar";

export const AcademicTabsContent = () => {
  return (
    <>
      <TabsContent value="schedule" className="space-y-6">
        <PersonalizedSchedule />
      </TabsContent>

      <TabsContent value="grades" className="space-y-6">
        <RealTimeGrades />
      </TabsContent>

      <TabsContent value="averages" className="space-y-6">
        <AutomaticAverages />
      </TabsContent>

      <TabsContent value="simulation" className="space-y-6">
        <GradeSimulation />
      </TabsContent>

      <TabsContent value="exams" className="space-y-6">
        <ExamCalendar />
      </TabsContent>
    </>
  );
};
