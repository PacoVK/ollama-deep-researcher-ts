import { routeResearch } from "../src/route/research";
import { SummaryState } from "../src/agent/state";

describe("Routers", () => {
  it("Test research router continues with websearch if maxWebResearchLoops is not reached", async () => {
    const res = routeResearch({ researchLoopCount: 1 } as SummaryState, {
      configurable: { maxWebResearchLoops: 2 },
    });
    expect(res).toEqual("webResearch");
  });

  it("Test research router routes to next step if maxWebResearchLoops is surpassed", async () => {
    const res = routeResearch({ researchLoopCount: 3 } as SummaryState, {
      configurable: { maxWebResearchLoops: 2 },
    });
    expect(res).toEqual("finalizeSummary");
  });
});
