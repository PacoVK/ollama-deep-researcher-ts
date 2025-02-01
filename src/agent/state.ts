import { Annotation } from "@langchain/langgraph";

export type SummaryState = typeof StateAnnotation.State;

export const StateAnnotation = Annotation.Root({
  researchTopic: Annotation<string>,
  searchQuery: Annotation<string>,
  webResearchResults: Annotation<string[]>({
    reducer: (state, update) => state.concat(update),
    default: () => [],
  }),
  sourcesGathered: Annotation<string[]>({
    reducer: (state, update) => state.concat(update),
    default: () => [],
  }),
  researchLoopCount: Annotation<number>,
  runningSummary: Annotation<string>,
});
