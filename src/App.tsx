import { Route, Routes } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import { AssessmentsPage } from "@/pages/AssessmentsPage";
import { FlashcardsPage } from "@/pages/FlashcardsPage";
import { HomePage } from "@/pages/HomePage";
import { InspectorPage } from "@/pages/InspectorPage";
import { LessonPage } from "@/pages/LessonPage";
import { LearnPage } from "@/pages/LearnPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PracticePage } from "@/pages/PracticePage";
import { ProgressPage } from "@/pages/ProgressPage";
import { ResourcesPage } from "@/pages/ResourcesPage";
import { ZynxPage } from "@/pages/ZynxPage";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/learn/:slug" element={<LessonPage />} />
        <Route path="/inspector" element={<InspectorPage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/flashcards" element={<FlashcardsPage />} />
        <Route path="/assessments" element={<AssessmentsPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/zynx" element={<ZynxPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
