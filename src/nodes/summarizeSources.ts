import { SummaryState } from "../agent/state";
import { RunnableConfig } from "@langchain/core/runnables";
import { ensureConfiguration } from "../agent/configuration";
import { ChatOllama } from "@langchain/ollama";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { summarizerInstructions } from "../agent/prompts";

export const summarizeSources = async (
  state: SummaryState,
  config: RunnableConfig,
) => {
  const existingSummary = state.runningSummary;
  const mostRecentWebResearch =
    state.webResearchResults[state.webResearchResults.length - 1];
  let humanMessageContent;

  if (existingSummary) {
    humanMessageContent = `<User Input> \n ${state.researchTopic} \n <User Input>\n\n
<Existing Summary> \n ${existingSummary} \n <Existing Summary>\n\n
<New Search Results> \n ${mostRecentWebResearch} \n <New Search Results>`;
  } else {
    humanMessageContent = `<User Input> \n ${state.researchTopic} \n <User Input>\n\n 
<Search Results> \n ${mostRecentWebResearch} \n <Search Results>`;
  }

  const configuration = ensureConfiguration(config);
  const llm = new ChatOllama({
    model: configuration.localLlm,
    temperature: 0,
    baseUrl: configuration.localLlmBaseUrl,
  });

  const result = await llm.invoke([
    new SystemMessage(summarizerInstructions),
    new HumanMessage(humanMessageContent),
  ]);

  // TODO: This is a hack to remove the <think> tags w/ Deepseek models
  // It appears very challenging to prompt them out of the responses
  const runningSummary = (result.content as string)
    .replaceAll("<think>", " ")
    .replaceAll("</think>", " ");

  return { runningSummary: runningSummary };
};
