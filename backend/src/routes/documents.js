const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const ragController = require('../controllers/ragController');

// 移除 authMiddleware
// const authMiddleware = require('../middleware/authMiddleware');
// router.use(authMiddleware);

router.post('/', documentController.createDocument);
router.get('/:id', documentController.getDocument);
router.put('/:id', documentController.updateDocument);
router.delete('/:id', documentController.deleteDocument);
router.get('/', documentController.getAllDocuments);

router.post('/answer-single', ragController.answerQuestionSingleDoc);
router.post('/answer-all', ragController.answerQuestionAllDocs);

module.exports = router;