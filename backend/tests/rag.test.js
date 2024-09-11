const request = require('supertest');
const app = require('../src/app');  // 确保这个路径指向你的app.js文件
const Document = require('../src/models/document');

jest.mock('../src/models/document');
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => {
    return {
      completions: {
        create: jest.fn().mockImplementation((options) => {
          if (options.stream) {
            const { Readable } = require('stream');
            const stream = new Readable({
              read() {
                this.push('Mocked stream answer part 1');
                this.push('Mocked stream answer part 2');
                this.push(null);
              }
            });
            return stream;
          } else {
            return Promise.resolve({
              choices: [{ text: 'Mocked answer' }]
            });
          }
        })
      },
      embeddings: {
        create: jest.fn().mockResolvedValue({
          data: [{ embedding: [0.1, 0.2, 0.3] }]
        })
      }
    };
  });
});

describe('RAG API', () => {
  describe('POST /api/documents/answer-single', () => {
    it('should answer a question based on a single document', async () => {
      const mockDocument = {
        id: 1,
        title: 'Test Document',
        content: 'This is a test document about AI.',
      };

      Document.findById.mockResolvedValue(mockDocument);

      const response = await request(app)
        .post('/api/documents/answer-single')
        .send({
          docId: 1,
          prompt: 'What is this document about?',
          history: [
            { role: 'user', content: 'Who is the author?' },
            { role: 'assistant', content: 'The author is John Doe.' }
          ],
          stream: false
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('answer');
      expect(typeof response.body.answer).toBe('string');
    });

    it('should return 404 if document is not found', async () => {
      Document.findById.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/documents/answer-single')
        .send({
          docId: 999,
          prompt: 'What is this document about?',
          history: [],
          stream: false
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Document not found');
    });

    it('should stream the answer if stream is true', async () => {
      const mockDocument = {
        id: 1,
        title: 'Test Document',
        content: 'This is a test document about AI.',
      };

      Document.findById.mockResolvedValue(mockDocument);

      const response = await request(app)
        .post('/api/documents/answer-single')
        .send({
          docId: 1,
          prompt: 'What is this document about?',
          history: [
            { role: 'user', content: 'Who is the author?' },
            { role: 'assistant', content: 'The author is John Doe.' }
          ],
          stream: true
        });

      expect(response.status).toBe(200);
      expect(response.text).toContain('Mocked stream answer part 1');
      expect(response.text).toContain('Mocked stream answer part 2');
    });
  });

  describe('POST /api/documents/answer-all', () => {
    it('should answer a question based on all documents', async () => {
      const mockDocuments = [
        { id: 1, title: 'Doc 1', content: 'Content of doc 1' },
        { id: 2, title: 'Doc 2', content: 'Content of doc 2' },
      ];

      Document.getAll.mockResolvedValue(mockDocuments);

      const response = await request(app)
        .post('/api/documents/answer-all')
        .send({
          prompt: 'What are these documents about?',
          history: [
            { role: 'user', content: 'Tell me about the documents.' },
            { role: 'assistant', content: 'There are multiple documents.' }
          ],
          stream: true
        });

      expect(response.status).toBe(200);
      expect(response.text).toContain('Mocked stream answer part 1');
      expect(response.text).toContain('Mocked stream answer part 2');
    });
  });
});