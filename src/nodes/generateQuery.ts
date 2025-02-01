import { RunnableConfig } from "@langchain/core/runnables";
import { ensureConfiguration } from "../agent/configuration";
import { queryWriterInstructions } from "../agent/prompts";
import { ChatOllama } from "@langchain/ollama";
import { SummaryState } from "../agent/state";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const generateQuery = async (
  state: SummaryState,
  config: RunnableConfig,
) => {
  //  Generate a query for web search
  const configuration = ensureConfiguration(config);
  const llm = new ChatOllama({
    model: configuration.localLlm,
    format: "json",
    temperature: 0,
    baseUrl: configuration.localLlmBaseUrl,
  });

  const result = await llm.invoke([
    new SystemMessage(queryWriterInstructions(state.researchTopic)),
    new HumanMessage("Generate a query for web search:"),
  ]);
  return { searchQuery: JSON.parse(result.content as string).query };
};
