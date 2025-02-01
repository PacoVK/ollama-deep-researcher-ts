import { Annotation, LangGraphRunnableConfig } from "@langchain/langgraph";

export enum SearchAPI {
  TAVILY = "tavily",
}

export const ConfigurationAnnotation = Annotation.Root({
  maxWebResearchLoops: Annotation<number>(),
  localLlm: Annotation<string>(),
  localLlmBaseUrl: Annotation<string>(),
  searchApi: Annotation<SearchAPI>(),
});

export type Configuration = typeof ConfigurationAnnotation.State;

export const ensureConfiguration = (
  config?: LangGraphRunnableConfig,
): Configuration => {
  const configurable = config?.configurable || {};
  return {
    maxWebResearchLoops: configurable?.maxWebResearchLoops || 3,
    localLlmBaseUrl:
      configurable?.localLlmBaseUrl ||
      process.env.LLM_BASE_URL ||
      "http://localhost:11434",
    localLlm: configurable?.localLlm || "llama3.2",
    searchApi: configurable?.searchApi || SearchAPI.TAVILY,
  };
};
