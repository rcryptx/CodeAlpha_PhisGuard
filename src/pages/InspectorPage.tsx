import { PlannedFeaturePage } from "@/components/features/PlannedFeaturePage";

export function InspectorPage() {
  return (
    <PlannedFeaturePage
      title="URL Inspector"
      description="A future local-first tool will explain suspicious URL indicators without visiting submitted addresses or claiming that a URL is safe based only on heuristics."
      path="/inspector"
    />
  );
}
