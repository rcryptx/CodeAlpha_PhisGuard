import { PageMetadata } from "@/components/seo/PageMetadata";
import { Assessments } from "@/features/assessments/Assessments";

export function AssessmentsPage() {
  return (
    <>
      <PageMetadata
        title="Assessments"
        description="Test your phishing-awareness knowledge with curriculum-aligned assessments, deterministic scoring, explanations, and lesson review."
        path="/assessments"
      />
      <Assessments />
    </>
  );
}
