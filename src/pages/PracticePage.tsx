import { PageMetadata } from "@/components/seo/PageMetadata";
import { PracticeLab } from "@/features/practice-lab/PracticeLab";

export function PracticePage() {
  return (
    <>
      <PageMetadata
        title="Practice Lab"
        description="Practice identifying phishing and social engineering in fictional, interactive scenarios with immediate explanations and session-only results."
        path="/practice"
      />
      <PracticeLab />
    </>
  );
}
