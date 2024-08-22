const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const upload = require('../config/upload');

router.post('/stories', upload.single('storyCover'), storyController.createStory);
router.get('/stories', storyController.getStories);
router.get('/categories', storyController.getCategories);
router.get('/stories/:id', storyController.getStory);
router.put('/stories/:id', upload.single('storyCover'), storyController.updateStory);
router.delete('/stories/:id', storyController.deleteStory);

router.post('/stories/:id/chapters', storyController.addChapter);
router.put('/chapters/:chapterId', storyController.updateChapter);
router.delete('/chapters/:chapterId', storyController.deleteChapter);
router.get('/chapters/:chapterId', storyController.getChapterDetail);

module.exports = router;
