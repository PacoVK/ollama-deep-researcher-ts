import { SummaryState } from "../agent/state";
import { RunnableConfig } from "@langchain/core/runnables";
import { ensureConfiguration } from "../agent/configuration";
import { ChatOllama } from "@langchain/ollama";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { reflectionInstructions } from "../agent/prompts";

export const reflectOnSummary = async (
  state: SummaryState,
  config: RunnableConfig,
) => {
  const configuration = ensureConfiguration(config);
  const llm = new ChatOllama({
    model: configuration.localLlm,
    format: "json",
    temperature: 0,
    baseUrl: configuration.localLlmBaseUrl,
  });

  const result = await llm.invoke([
    new SystemMessage(reflectionInstructions(state.researchTopic)),
    new HumanMessage(
      `Identify a knowledge gap and generate a follow-up web search query based on our existing knowledge: ${state.runningSummary}`,
    ),
  ]);

  const { followUpQuery } = JSON.parse(result.content as string);

  if (!followUpQuery) {
    // Fallback to a placeholder query
    return { searchQuery: `Tell me more about ${state.researchTopic}` };
  }
  return { searchQuery: `Tell me more about ${followUpQuery}` };
};
