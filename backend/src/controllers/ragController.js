const ragService = require('../services/ragService');

exports.answerQuestionSingleDoc = async (req, res) => {
  try {
    const { docId, prompt, history, stream } = req.body;
    const answer = await ragService.answerQuestionSingleDoc(docId, prompt, history, stream);

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      for await (const chunk of answer) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }
      res.end();
    } else {
      res.json({ answer });
    }
  } catch (error) {
    if (error.message === 'Document not found') {
      res.status(404).json({ message: 'Document not found' });
    } else {
      console.error('Error answering question:', error);
      res.status(500).json({ message: 'Error answering question', error: error.message });
    }
  }
};

exports.answerQuestionAllDocs = async (req, res) => {
  try {
    const { prompt, history, stream } = req.body;
    const answer = await ragService.answerQuestionAllDocs(prompt, history, stream);

    if (stream) {
      answer.on('data', (data) => {
        res.write(data);
      });

      answer.on('end', () => {
        res.end();
      });
    } else {
      res.json({ answer });
    }
  } catch (error) {
    console.error('Error answering question:', error);
    res.status(500).json({ message: 'Error answering question', error: error.message });
  }
};