import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const getArticles = async () => {
  const { data, error } = await supabase.from('articles').select("*");
  if (error) {
    console.error('Error fetching articles: ', error);
    return null;
  }
  return data;
}

export const getCommentsFromArticle = async (article_id) => {
  const { data, error } = await supabase.from('comments').select('*').eq('article_id', article_id);
  if (error) {
    console.error('Error fetching articles: ', error);
    return null;
  }
  return data;
}

export const addCommentToArticle = async (article_id, user, content) => {
  const { data, error } = await supabase.from('comments').insert([
    {
      article_id: article_id,
      user: user,
      content: content
    }
  ]);
  if (error)
  {
    console.error('Error inserting comment: ', error);
  }
  else 
  {
    console.log(data);
  }
}


export const addArticle = async (title, description, content) => {
  const { data, error } = await supabase.from('articles').insert([
    {
      title: title,
      content: description,
      article_content: content,
      img: content[0].img
    }
  ]);

  if (error)
  {
    console.error('Error inserting article: ', error);
  }
  else 
  {
    console.log(data);
  }
}

export const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
};