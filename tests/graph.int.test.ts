import { graph } from "../src/agent/graph.js";

describe("Graph", () => {
  it("should process input through the graph", async () => {
    const input = "Tell me more about the climate crisis";
    const result = await graph.invoke({ researchTopic: input });

    expect(result).toBeDefined();
    expect(typeof result).toBe("object");
    expect(result.searchQuery).toBeDefined();
    expect(Array.isArray(result.sourcesGathered)).toBe(true);
    expect(result.sourcesGathered.length).toBeGreaterThan(0);
  }, 180000); // Increased timeout to 180 seconds
});
