import { useState, useEffect } from "react"
import {FaBars, FaEdit, FaEye, FaCheck, FaTimes, FaSave} from 'react-icons/fa'
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'
import axios from 'axios'
import Modal from '../components/Modal'
import EditorSidebar from "../components/editorSidebar"
import { toast } from "react-toastify";

const EditorDashboard = () => {
    const [isEditorSidebarOpen, setEditorSidebarOpen] = useState(false);
    const toggleSidebar = () => setEditorSidebarOpen((prev) => !prev);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [currentArticle, setCurrentArticle] = useState(null);
    const [editedContent, setEditedContent] = useState('');
    const [editedTitle, setEditedTitle] = useState('');
    const [saving, setSaving] = useState(false);

    const quillModules = {
      toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ] 
    };

    const quillFormats = [
        'header', 'bold', 'italic', 'underline',
        'list', 'bullet', 'link', 'image'
    ];

    //Fetch submitted articles submitted by reporters
    useEffect(() => {
        const fetchArticles = async () => {
            try{
               setLoading(true);
               const response = await axios.get("http://localhost:5000/api/articles");
               setArticles(response.data);
               setError(null); 
            } catch (error) {
               console.error('Failed to fetch articles:', error);
               setError('Failed to load articles'); 
            } finally{
                setLoading(false);
            }
        };

        fetchArticles();

        //Refresh articles every 30 seconds to get new submissions
        const interval = setInterval(fetchArticles, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleViewArticle = (articleId) => {
        const article = articles.find(article => article._id === articleId);
        if (article) {
            setCurrentArticle(article);
            setViewModalOpen(true);
        }
    };

  const handleEditArticle = (articleId) =>{
    const article = articles.find(article => article._id === articleId);
    if (article) {
       setCurrentArticle(article);
       setEditedTitle(article.title);
       setEditedContent(article.content);
       setEditModalOpen(true);
    }   
  };

  const handleApproveArticle = async (articleId) => {
    try{
      await axios.put(`http://localhost:5000/api/articles/${articleId}/status`, {
       status: 'approved', 
      });

      //Update local state
      setArticles(articles.map(article =>
        article._id === articleId ? {...article, status: 'approved'} : article       
      ));

      toast.success('Article approved!');
    } catch (error) {
        console.error('Failed to approve article:', error);
        toast.error('Failed to approve article');
    }
  };

  const handleRejectArticle = async (articleId) => {
     try{
       await axios.put(`http://localhost:5000/api/articles/${articleId}/status`, {
          status: 'rejected',
       }); 

       //Update local state
       setArticles(articles.map(article =>
          article._id === articleId ? {...article, status: 'rejected'} : article
       ));

       toast.success('Article rejected');
     } catch (error){
        console.error('Failed to reject article:', error);
        toast.error('Failed to reject article')
     }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };

    const formattedDate = date.toLocaleDateString('en-GB', dateOptions);
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

    return { date: formattedDate, time: formattedTime };
  };

  const getStatusColor = (status) => {
    switch(status) {
        case 'approved': return 'text-green-600 bg-green-100';
        case 'rejected': return 'text-red-600 bg-red-100';
        case 'pending-review': return 'text-yellow-600 bg-yellow-100';
        default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
      <div className="relative min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <EditorSidebar isOpen={isEditorSidebarOpen} onClose={() => setEditorSidebarOpen(false)} />

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="text-blue-800 text-2xl m-4 focus:outline-none"
      >
        <FaBars />
      </button>

        {/*Main Content*/}
         <main className={`transition-all duration-300 ${isEditorSidebarOpen ? "ml-64" : "ml-0"} p-6 bg-blue-50 min-h-screen`}>
        <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
            <div className="w-full max-w-none">
                <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Articles from Reporters</h2>
              <div className="text-sm text-gray-600">
                Total: {articles.length} articles
              </div>
            </div>

            {loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Loading articles...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <p className="text-red-500 text-lg">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && (
              <div className="space-y-4">
                {articles.map((article) => {
                  const { date, time } = formatDateTime(article.submittedAt || article.createdAt);
                  
                  return (
                    <div key={article._id || article.id} className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">                    
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          {article.image && (
                            <img 
                               src={`http://localhost:5000/uploads/${article.image}`}
                               alt="Article"
                               className="w-full max-w-xs mb-3 rounded"
                            />
                          )}
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-800 text-lg">{article.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
                              {article.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">
                            Submitted by <span className="font-medium text-blue-600">{article.submittedBy}</span> on {date} at {time}
                          </p>
                          
                          {article.content && (
                            <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                              {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                            </p>
                          )}
                          
                          {article.tags && article.tags.length > 0 && (
                            <div className="flex gap-2 mb-3">
                              {article.tags.map((tag, index) => (
                                <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>   

                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleViewArticle(article._id || article.id)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="View article"
                          >
                            <FaEye size={18} />
                          </button>
                          
                          <button
                            onClick={() => handleEditArticle(article._id || article.id)}
                            className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
                            title="Edit article"
                          >
                            <FaEdit size={18} />
                          </button>

                          {article.status !== 'approved' && (
                            <button
                              onClick={() => handleApproveArticle(article._id || article.id)}
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                              title="Approve article"
                            >
                              <FaCheck size={18} />
                            </button>
                          )}

                          {article.status !== 'rejected' && (
                            <button
                              onClick={() => handleRejectArticle(article._id || article.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                              title="Reject article"
                            >
                              <FaTimes size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>   
                  );
                })}
              </div>
            )}

            {!loading && !error && articles.length === 0 && (
              <div className="text-center py-12"> 
                <p className="text-gray-500 text-lg">No articles submitted yet</p>
                <p className="text-gray-400 text-sm mt-2">Articles sent by reporters will appear here</p>                  
              </div>
            )}
          </div>
        </div>
        </div>
        </main>

      {/*View Modal*/}

      {viewModalOpen && currentArticle && (
        <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)}>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">{currentArticle.title}</h3>
            <p className="text-sm text-gray-600">
              By {currentArticle.submittedBy} on {formatDateTime(currentArticle.submittedAt || currentArticle.createdAt).date}
            </p>

            {currentArticle.tags && currentArticle.tags.length > 0 && (
               <div className="flex gap-2 flex-wrap"> 
                 {currentArticle.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                     #{tag}
                  </span> 
                ))}
               </div>
            )}

            {currentArticle.image && (
              <img 
                 src={`http://localhost:5000/uploads/${currentArticle.image}`}
                 alt="Article Preview"
                 className="w-full h-48 object-cover rounded mb-4"
              />
            )}

            <div
             className="prose max-w-none"
             dangerouslySetInnerHTML={{__html: currentArticle.content || 'No content available.' }}
            />
          </div>

        </Modal>
      )}

      {/*Edit Modal*/}

      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <div className="space-y-4">
          <input
             type="text"
             value={editedTitle}
             onChange={(e) => setEditedTitle(e.target.value)}
             placeholder="Edit title"
             className="w-full p-2 border rounded"
          />   

          <ReactQuill
            value={editedContent}
            onChange={setEditedContent}
            modules={quillModules}
            formats={quillFormats}
            placeholder="Edit article content"          
          />

          <button 
            onClick={() => setEditModalOpen(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
          >
           Cancel 
          </button>

          <button onClick={async() => {
            if(!currentArticle) return;
             try{
               setSaving(true);
               await axios.put(
                `http://localhost:5000/api/articles/${currentArticle._id}`,
                { title: editedTitle, content: editedContent,}
            );
            setArticles((prev) =>
                prev.map((article) => 
                  article._id === currentArticle._id
                  ? {...article, title: editedTitle, content: editedContent} : article
                )
             );
             setEditModalOpen(false);
             toast.success("Article updated!");
             } catch (error) {
                console.error("Error updating article:", error);
                toast.error("Failed to update article.");
             } finally {
                setSaving(false);
             }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
            
        </div> 
      </Modal>
    </div>               
  );
};

export default EditorDashboard