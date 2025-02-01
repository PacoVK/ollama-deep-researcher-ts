# Ollama Deep Researcher

---

##### Typescript Edition

---

> This repo is a Typescript edition of the [Ollama Deep Researcher](https://github.com/langchain-ai/ollama-deep-researcher) and the repo structure is inspired by the [langgraphjs-starter-template](https://github.com/langchain-ai/new-langgraphjs-project)

Ollama Deep Researcher is a fully local web research assistant that uses any LLM hosted by [Ollama](https://ollama.com/search). Give it a topic and it will generate a web search query, gather web search results (via [Tavily](https://www.tavily.com/)), summarize the results of web search, reflect on the summary to examine knowledge gaps, generate a new search query to address the gaps, search, and improve the summary for a user-defined number of cycles. It will provide the user a final markdown summary with all sources used.

![research-rabbit](https://github.com/user-attachments/assets/4308ee9c-abf3-4abb-9d1e-83e7c2c3f187)

Short summary:
<video src="https://github.com/user-attachments/assets/02084902-f067-4658-9683-ff312cab7944" controls></video>

## 📺 Video Tutorials

See it in action or build it yourself? Check out these helpful video tutorials:

- [Overview of Ollama Deep Researcher with R1](https://www.youtube.com/watch?v=sGUjmyfof4Q) - Load and test [DeepSeek R1](https://api-docs.deepseek.com/news/news250120) [distilled models](https://ollama.com/library/deepseek-r1).
- [Building Ollama Deep Researcher from Scratch](https://www.youtube.com/watch?v=XGuTzHoqlj8) - Overview of how this is built.

## 🚀 Quickstart

### Configuration

In `./src/agent/configuration.ts` you can set the following configurations:

- Set the name of your local LLM to use with Ollama (it will by default be `llama3.2`)
- You can set the depth of the research iterations (it will by default be `3`)
- You can set the base url of your llm (it will by default be `http://localhost:11434`)

### Mac

1. Download the Ollama app for Mac [here](https://ollama.com/download).

2. Pull a local LLM from [Ollama](https://ollama.com/search). As an [example](https://ollama.com/library/deepseek-r1:8b):

```bash
ollama pull deepseek-r1:8b
```

3. Setup web search tool:

- [Tavily API](https://tavily.com/)

Set the corresponding environment variable via `.env` file you can simply copy from `.env.example`:

```dotenv
TAVILY_API_KEY=<your_tavily_api_key>
```

5. Clone the repository and launch the assistant with the LangGraph server:

```bash
# Clone the repository and start the LangGraph server
git clone https://github.com/pacovk/ollama-deep-researcher-ts.git
cd ollama-deep-researcher-ts
yarn install
```

### Using the LangGraph Studio UI

#### Docker Compose

You can use the provided `docker-compose.yml` file to run LangGraph Studio with the Ollama Deep Researcher assistant.

1. Start the LangGraph server with the Ollama Deep Researcher assistant:

```bash
docker compose up -d
```

Visit [LangGraph Studio Web UI](https://smith.langchain.com/studio/?baseUrl=http://127.0.0.1:2024) to interact with the assistant.

Give the assistant a topic for research, and you can visualize its process!

<img width="1621" alt="Screenshot 2025-01-24 at 10 08 22 PM" src="https://github.com/user-attachments/assets/4de6bd89-4f3b-424c-a9cb-70ebd3d45c5f" />

ℹ️ There is also a Ollama Web UI available at [http://localhost:2024](http://localhost:2024) to interact with the assistant.

## How it works

Ollama Deep Researcher is inspired by [IterDRAG](https://arxiv.org/html/2410.04343v1#:~:text=To%20tackle%20this%20issue%2C%20we,used%20to%20generate%20intermediate%20answers.). This approach will decompose a query into sub-queries, retrieve documents for each one, answer the sub-query, and then build on the answer by retrieving docs for the second sub-query. Here, we do similar:

- Given a user-provided topic, use a local LLM (via [Ollama](https://ollama.com/search)) to generate a web search query
- Uses a search engine (configured for [Tavily](https://www.tavily.com/)) to find relevant sources
- Uses LLM to summarize the findings from web search related to the user-provided research topic
- Then, it uses the LLM to reflect on the summary, identifying knowledge gaps
- It generates a new search query to address the knowledge gaps
- The process repeats, with the summary being iteratively updated with new information from web search
- It will repeat down the research rabbit hole
- Runs for a configurable number of iterations (see `configuration` tab)

## Outputs

The output of the graph is a markdown file containing the research summary, with citations to the sources used.

All sources gathered during research are saved to the graph state.

You can visualize them in the graph state, which is visible in LangGraph Studio:

![Screenshot 2024-12-05 at 4 08 59 PM](https://github.com/user-attachments/assets/e8ac1c0b-9acb-4a75-8c15-4e677e92f6cb)

The final summary is saved to the graph state as well:

![Screenshot 2024-12-05 at 4 10 11 PM](https://github.com/user-attachments/assets/f6d997d5-9de5-495f-8556-7d3891f6bc96)
