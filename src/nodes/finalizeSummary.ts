import { SummaryState } from "../agent/state";

export const finalizeSummary = (state: SummaryState) => {
  const allSources = state.sourcesGathered
    .map((source) => `* ${source}`)
    .join("\n");
  state.runningSummary = `## Summary
    
${state.runningSummary}
    
### Sources:
${allSources}`;
  return { runningSummary: state.runningSummary };
};
