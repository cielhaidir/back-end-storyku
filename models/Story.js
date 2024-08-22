const { createClient } = require('@supabase/supabase-js');
const { supabaseUrl, supabaseKey } = require('../config');

const supabase = createClient(supabaseUrl, supabaseKey);

async function createStory(storyData) {
    const { title, author, synopsis, category, story_cover, tags, status, chapters } = storyData;
    console.log(storyData)
    const { data: story, error: storyError } = await supabase
        .from('stories')
        .insert([{ title, author, synopsis, category, story_cover, tags, status }])
        .select();

    if (storyError) throw new Error(storyError.message);

    if (chapters && chapters.length > 0) {
        const chaptersData = chapters.map(chapter => ({
            title: chapter.title,
            content: chapter.content,
            story_id: story[0].id, 
            last_updated: new Date()
        }));

        const { error: chapterError } = await supabase
            .from('chapters')
            .insert(chaptersData);

        if (chapterError) throw new Error(chapterError.message);
    }

    return story[0];
}

async function getStories() {
    const { data: stories, error } = await supabase
        .from('stories')
        .select('*');

    if (error) throw new Error(error.message);

    return stories;
}

async function getStoryById(id) {
    const { data: story, error } = await supabase
        .from('stories')
        .select(`
            *,
            chapters (id, title, content, last_updated)
        `)
        .eq('id', id)
        .single();

    if (error) throw new Error(error.message);

    return story;
}

async function updateStory(id, storyData) {
    const { data, error } = await supabase
        .from('stories')
        .update(storyData)
        .eq('id', id)
        .select();

    if (error) throw new Error(error.message);

    return data[0];
}

async function deleteStory(id) {
    const { error: chapterError } = await supabase
        .from('chapters')
        .delete()
        .eq('story_id', id);

    if (chapterError) throw new Error(chapterError.message);

    const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);

    return { message: 'Story deleted successfully' };
}

async function getCategories() {
    const { data: categories, error } = await supabase
        .from('stories')
        .select('category');

    if (error) throw new Error(error.message);

    const uniqueCategories = Array.from(new Set(categories.map(cat => cat.category)));

    return uniqueCategories;
}

async function addChapter(storyId, chapterData) {
    const { title, content } = chapterData;

    const { error } = await supabase
        .from('chapters')
        .insert([{
            title,
            content,
            story_id: storyId,
            last_updated: new Date().toISOString()
        }]);

    if (error) throw new Error(error.message);

    return { message: 'Chapter added successfully' };
}

async function deleteChapter(chapterId) {
    const { error } = await supabase
        .from('chapters')
        .delete()
        .eq('id', chapterId);

    if (error) throw new Error(error.message);

    return { message: 'Chapter deleted successfully' };
}

async function updateChapter(chapterId, chapterData) {
    const { data, error } = await supabase
        .from('chapters')
        .update(chapterData)
        .eq('id', chapterId)
        .select();

    if (error) throw new Error(error.message);

    return data[0];
}

async function getChapterById(id) {
    const { data: chapter, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw new Error(error.message);

    return chapter;
}

module.exports = {
    createStory,
    getStories,
    getStoryById,
    updateStory,
    deleteStory,
    getCategories,
    addChapter,
    deleteChapter,
    updateChapter,
    getChapterById
};
