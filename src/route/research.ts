import { SummaryState } from "../agent/state";
import { RunnableConfig } from "@langchain/core/runnables";
import { ensureConfiguration } from "../agent/configuration";

export const routeResearch = (state: SummaryState, config: RunnableConfig) => {
  const configuration = ensureConfiguration(config);
  if (state.researchLoopCount <= configuration.maxWebResearchLoops) {
    return "webResearch";
  } else {
    return "finalizeSummary";
  }
};
