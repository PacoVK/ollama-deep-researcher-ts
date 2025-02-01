import { END, START, StateGraph } from "@langchain/langgraph";
import { StateAnnotation } from "./state";
import { generateQuery } from "../nodes/generateQuery";
import { webResearch } from "../nodes/webResearch";
import { summarizeSources } from "../nodes/summarizeSources";
import { reflectOnSummary } from "../nodes/reflectSummary";
import { finalizeSummary } from "../nodes/finalizeSummary";
import { routeResearch } from "../route/research";

const builder = new StateGraph(StateAnnotation)
  .addNode("generateQuery", generateQuery)
  .addNode("webResearch", webResearch)
  .addNode("summarizeSources", summarizeSources)
  .addNode("reflectOnSummary", reflectOnSummary)
  .addNode("finalizeSummary", finalizeSummary)

  .addEdge(START, "generateQuery")
  .addEdge("generateQuery", "webResearch")
  .addEdge("webResearch", "summarizeSources")
  .addEdge("summarizeSources", "reflectOnSummary")
  .addConditionalEdges("reflectOnSummary", routeResearch)
  .addEdge("finalizeSummary", END);

export const graph = builder.compile();

graph.name = "Deep Researcher";
