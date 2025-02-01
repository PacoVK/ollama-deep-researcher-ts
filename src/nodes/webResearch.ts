import { SummaryState } from "../agent/state";
import { RunnableConfig } from "@langchain/core/runnables";
import { ensureConfiguration, SearchAPI } from "../agent/configuration";
import { tavily } from "@tavily/core";

declare type TavilySearchResult = {
  title: string;
  url: string;
  content: string;
  rawContent?: string;
  score: number;
  publishedDate: string;
};

declare type TavilySearchResponse = {
  results: TavilySearchResult[];
};

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

const deduplicateAndFormatSources = (
  searchResponse: TavilySearchResponse,
  maxTokensPerSource: number,
) => {
  // Deduplicate by URL
  const uniqueSources: { [key: string]: TavilySearchResult } = {};
  searchResponse.results.forEach((source) => {
    if (!uniqueSources[source.url]) {
      uniqueSources[source.url] = source;
    }
  });

  // Format output
  let formattedText = "Sources:\n\n";
  Object.values(uniqueSources).forEach((source) => {
    formattedText += `Source ${source.title}:\n===\n`;
    formattedText += `URL: ${source.url}\n===\n`;
    formattedText += `Most relevant content from source: ${source.content}\n===\n`;
    const charLimit = maxTokensPerSource * 4;
    let rawContent = source.rawContent || "";
    if (rawContent.length > charLimit) {
      rawContent = rawContent.substring(0, charLimit) + "... [truncated]";
    }
    formattedText += `Full source content limited to ${maxTokensPerSource} tokens: ${rawContent}\n\n`;
  });

  return formattedText.trim();
};

export const webResearch = async (
  state: SummaryState,
  config: RunnableConfig,
) => {
  const configuration = ensureConfiguration(config);
  let sources: string;
  let webResearchResults: string;

  switch (configuration.searchApi) {
    case SearchAPI.TAVILY:
      {
        const tvly = tavily({
          apiKey: TAVILY_API_KEY,
        });
        const context = await tvly.search(state.searchQuery, {
          maxResults: 3,
          includeRawContent: true,
        });
        webResearchResults = deduplicateAndFormatSources(context, 1000);
        sources = context.results
          .map((source) => `* ${source.title} : ${source.url}`)
          .join("\n");
      }
      break;
    default:
      throw new Error(`Unsupported search API: ${configuration.searchApi}`);
  }

  return {
    sourcesGathered: [sources],
    researchLoopCount: state.researchLoopCount + 1,
    webResearchResults: [webResearchResults],
  };
};
