const StoryModel = require('../models/Story'); 
const { supabaseUrl, supabaseKey } = require('../config');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(supabaseUrl, supabaseKey);

exports.createStory = async (req, res) => {
    try {
        console.log(req)
        const { title, author, synopsis, category, tags, status } = req.body;
        const story_cover = req.file ? req.file.filename : null; 

        const storyData = {
            title,
            author,
            synopsis,
            category,
            story_cover,
            tags: tags ? tags.split(',') : [], 
            status
        };

        const story = await StoryModel.createStory(storyData);
        res.status(201).json(story);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getStories = async (req, res) => {
    try {
        const stories = await StoryModel.getStories();
        res.status(200).json(stories);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getStory = async (req, res) => {
    try {
        const story = await StoryModel.getStoryById(req.params.id);
        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }
        res.status(200).json(story);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateStory = async (req, res) => {
    try {
        const { title, author, synopsis, category, tags, status } = req.body;
        const updatedData = {
            title,
            author,
            synopsis,
            category,
            tags: tags ? tags.split(',') : [],
            status
        };
        if (req.file) {
            updatedData.story_cover = req.file.filename;
        }
        const updatedStory = await StoryModel.updateStory(req.params.id, updatedData);
        if (!updatedStory) {
            return res.status(404).json({ message: 'Story not found' });
        }
        res.status(200).json(updatedStory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteStory = async (req, res) => {
    try {
        await StoryModel.deleteStory(req.params.id);
        res.status(204).json({ message: 'Story deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.addChapter = async (req, res) => {
    try {
        const { title, content } = req.body;
        const storyId = req.params.id;

        const result = await StoryModel.addChapter(storyId, { title, content });

        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateChapter = async (req, res) => {
    try {
        const chapterId = req.params.chapterId;
        const chapterData = req.body;

        const updatedChapter = await StoryModel.updateChapter(chapterId, chapterData);
        if (!updatedChapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }
        res.status(200).json(updatedChapter);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteChapter = async (req, res) => {
    try {
        const { storyId, chapterId } = req.params;

        await StoryModel.deleteChapter(chapterId);
        
        res.status(204).json({ message: 'Chapter deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getChapterDetail = async (req, res) => {
    try {
        const { chapterId } = req.params;
        const chapter = await StoryModel.getChapterById(chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }
        res.status(200).json(chapter);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getCategories = async (req, res) => {
    try {
        const categories = await StoryModel.getCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

