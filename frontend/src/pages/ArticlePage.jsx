import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

const ArticlePage = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try{
              const res = await axios.get(`http://localhost:5000/api/articles/${id}`);
              setArticle(res.data);  
            } catch (error) {
                setError("Failed to load article");               
            } finally {
                setLoading(false);
            }
        }
        fetchArticle();
    }, [id]);

    if (loading) return <div className='p-8 text-center'>Loading article...</div>;
    if (error) return <div className='p-8 text-center text-red-500'>{error}</div>;

    return (
       <div className='max-w-3xl mx-auto p-6'>
        <h1 className='text-2xl font-bold mb-4'>{article.title}</h1>
        <p className='text-gray-700 mb-2'>{article.description}</p>

        <div className='text-sm text-gray-500 flex justify-between items-center mb-4'>
            <span className='uppercase font-semibold'>{article.submittedBy}</span>
            <span>{new Date(article.createdAt).toLocaleDateString('en-GB')}</span>
        </div>

        <hr className='my-4' />

        <div className='prose max-w-none' dangerouslySetInnerHTML={{__html: article.content }}/>
       </div> 
    );
}

export default ArticlePage