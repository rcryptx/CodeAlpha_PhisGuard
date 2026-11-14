import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";

// Route-level code splitting keeps the initial bundle small: content-heavy
// screens (curriculum, glossary, assessment bank) load only when visited.
const LearnPage = lazy(() =>
  import("@/pages/LearnPage").then((module) => ({ default: module.LearnPage })),
);
const LessonPage = lazy(() =>
  import("@/pages/LessonPage").then((module) => ({
    default: module.LessonPage,
  })),
);
const InspectorPage = lazy(() =>
  import("@/pages/InspectorPage").then((module) => ({
    default: module.InspectorPage,
  })),
);
const PracticePage = lazy(() =>
  import("@/pages/PracticePage").then((module) => ({
    default: module.PracticePage,
  })),
);
const FlashcardsPage = lazy(() =>
  import("@/pages/FlashcardsPage").then((module) => ({
    default: module.FlashcardsPage,
  })),
);
const AssessmentsPage = lazy(() =>
  import("@/pages/AssessmentsPage").then((module) => ({
    default: module.AssessmentsPage,
  })),
);
const ProgressPage = lazy(() =>
  import("@/pages/ProgressPage").then((module) => ({
    default: module.ProgressPage,
  })),
);
const ResourcesPage = lazy(() =>
  import("@/pages/ResourcesPage").then((module) => ({
    default: module.ResourcesPage,
  })),
);
const GlossaryPage = lazy(() =>
  import("@/pages/GlossaryPage").then((module) => ({
    default: module.GlossaryPage,
  })),
);
const GlossaryTermPage = lazy(() =>
  import("@/pages/GlossaryTermPage").then((module) => ({
    default: module.GlossaryTermPage,
  })),
);
const ZynxPage = lazy(() =>
  import("@/pages/ZynxPage").then((module) => ({ default: module.ZynxPage })),
);

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
        <Route path="/glossary" element={<GlossaryPage />} />
        <Route path="/glossary/:termId" element={<GlossaryTermPage />} />
        <Route path="/zynx" element={<ZynxPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
