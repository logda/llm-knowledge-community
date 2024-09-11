const { ChatAlibabaTongyi } = require("@langchain/community/chat_models/alibaba_tongyi");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");
const { Chroma } = require("@langchain/community/vectorstores/chroma");
// const { AlibabaEmbeddings } = require("@langchain/community/embeddings/alibaba");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { AlibabaTongyiEmbeddings } = require("@langchain/community/embeddings/alibaba_tongyi");

const Document = require("../models/document")

const alibabaApiKey = process.env.ALIBABA_API_KEY;

const model = new ChatAlibabaTongyi({
  alibabaApiKey: alibabaApiKey,
});

const embeddings = new AlibabaTongyiEmbeddings({
  alibabaApiKey: alibabaApiKey,
});

let vectorStore;

async function initializeVectorStore(documents) {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const docs = await Promise.all(
    documents.map(async (doc) => {
      const splitDocs = await textSplitter.createDocuments([doc.content]);
      return splitDocs.map(
        (splitDoc) =>
          new Document({
            pageContent: splitDoc.pageContent,
            metadata: { title: doc.title, id: doc.id },
          })
      );
    })
  );

  const flatDocs = docs.flat();

  vectorStore = await Chroma.fromDocuments(flatDocs, embeddings, {
    collectionName: "documents",
  });
}

async function answerQuestionSingleDoc(docId, prompt, history, stream) {
  const document = await Document.findById(docId);
  if (!document) {
    throw new Error("Document not found");
  }

  const context = document.content;
  const messages = [
    new SystemMessage("You are a helpful assistant. Use the following context to answer the user's question."),
    new HumanMessage(`Context: ${context}\n\nQuestion: ${prompt}`),
  ];

  history.forEach((h) => {
    if (h.role === "user") {
      messages.push(new HumanMessage(h.content));
    } else if (h.role === "assistant") {
      messages.push(new SystemMessage(h.content));
    }
  });

  if (stream) {
    return model.stream(messages);
  } else {
    const response = await model.invoke(messages);
    return response.content;
  }
}

async function answerQuestionAllDocs(prompt, history, stream) {
  if (!vectorStore) {
    const allDocuments = await Document.getAll();
    await initializeVectorStore(allDocuments);
  }

  const relevantDocs = await vectorStore.similaritySearch(prompt, 3);

  const context = relevantDocs.map((doc) => doc.pageContent).join("\n\n");

  const messages = [
    new SystemMessage("You are a helpful assistant. Use the following context to answer the user's question."),
    new HumanMessage(`Context: ${context}\n\nQuestion: ${prompt}`),
  ];

  history.forEach((h) => {
    if (h.role === "user") {
      messages.push(new HumanMessage(h.content));
    } else if (h.role === "assistant") {
      messages.push(new SystemMessage(h.content));
    }
  });

  const response = await model.invoke(messages, { stream: stream });

  return stream ? response : response.content;
}

module.exports = { answerQuestionSingleDoc, answerQuestionAllDocs, initializeVectorStore };