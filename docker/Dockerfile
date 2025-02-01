FROM node:alpine3.20

EXPOSE 2024

RUN npm install -g npm \
    npm install -g @langchain/langgraph-cli

WORKDIR /app

ENTRYPOINT ["langgraphjs","dev", "--host", "0.0.0.0"]
