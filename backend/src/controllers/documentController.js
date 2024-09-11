const Document = require('../models/document');

exports.createDocument = async (req, res) => {
  try {
    const { title, content, path } = req.body;
    const documentId = await Document.create(title, content, path);
    res.status(201).json({ message: 'Document created successfully', documentId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating document', error: error.message });
  }
};

exports.getDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving document', error: error.message });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const id = req.params.id;
    const { title = '', content = '', path = '' } = req.body;
    await Document.update(id, title, content, path);
    res.json({ message: 'Document updated successfully' });
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ message: 'Error updating document', error: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    await Document.delete(req.params.id);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting document', error: error.message });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.getAll();
    res.json(documents);
  } catch (error) {
    console.error('Error fetching all documents:', error);
    res.status(500).json({ message: 'Error fetching documents' });
  }
};

exports.getDocumentsByPath = async (req, res) => {
  try {
    const path = req.query.path || '/';
    const documents = await Document.findByPath(path);
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving documents', error: error.message });
  }
};