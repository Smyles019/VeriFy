import { useState, useEffect } from 'react'
import { FaEdit, FaTrashAlt, FaBars } from 'react-icons/fa'
import Modal from '../components/Modal'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axios from 'axios'
import ReporterSidebar from '../components/ReporterSidebar'
import { toast } from 'react-toastify';


const ReporterDashboard = () => {
  const [isReporterSidebarOpen, setReporterSidebarOpen] = useState(false);
  const toggleSidebar = () => setReporterSidebarOpen((prev) => !prev);
  const [modalOpen, setModalOpen] = useState(false);
  const [drafts, setDrafts] = useState ([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [user, setUser] = useState(null);
  const [reporterName, setReporterName] = useState("");

  //State for editing drafts
  const [editingDraft, setEditingDraft] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log("Logged-in user:", storedUser);
    setUser(storedUser);

    if (storedUser?.fullName) {
    axios.get(`http://localhost:5000/api/drafts?submittedBy=${storedUser.fullName}`)
       .then(res => {
         console.log("Filtered drafts:", res.data);
         setDrafts(res.data); 
       })
       .catch(err => console.error(err));
       setReporterName(storedUser.fullName || storedUser.email);
    }
  }, []);

  //Function to open modal for new article
  const openNewArticleModal = () => {
    setIsEditing(false);
    setEditingDraft(null);
    clearForm();
    setModalOpen(true);
  };

  //Function to open modal for existing article
  const openEditModal = (draft) => {
    setIsEditing(true);
    setEditingDraft(draft);
    setTitle(draft.title);
    setContent(draft.content || "");
    setTags(draft.tags || []);
    setImageFile(null);
    setImagePreview(draft.image ? `http://localhost:5000/uploads/${draft.image}` : null);
    setModalOpen(true);
  };
  
  //Function to clear form
  const clearForm = () => {
    setTitle("");
    setContent("");
    setTags([]);
    setNewTag("");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSaveDraft = async () => {
    if(!title.trim()) return;

    try{
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('tags', tags[0] || '');
      formData.append('submittedBy', user.fullName);

      if (imageFile){
        formData.append('image', imageFile);
      } else if (isEditing && editingDraft?.image) {
        //Preserve existing image file name
        formData.append('existingImage', editingDraft.image);
      }

      if(isEditing && editingDraft){
      
        //Update exisiting draft
      const res =  await axios.put(`http://localhost:5000/api/drafts/${editingDraft._id}`,
        formData,
         { headers: { 'Content-Type' : 'multipart/form-data' } }           
      );

      //Update the drafts array with the updated draft      
      setDrafts(drafts.map(d => d._id === editingDraft._id ? res.data : d));
    } else {
      //Create new draft
      const res = await axios.post('http://localhost:5000/api/drafts',
        formData, 
        { headers: { 'Content-Type' : 'multipart/form-data' } }       
    );
      setDrafts([...drafts, res.data]);
     }   
    } catch (error) {
      console.error('Failed to save draft:', error);
    }

    //close modal and reset form
    setModalOpen(false);
    clearForm();
    setIsEditing(false);
    setEditingDraft(null);  
  };

  const handleSendDraft = async () => {
    if(!title.trim()) return;

      try{
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('tags',  tags[0] || '');
        if (imageFile){
         formData.append('image', imageFile);
        } else if (isEditing && editingDraft?.image) {
          formData.append('existingImage', editingDraft.image); 
        } 
        formData.append('submittedBy', user.fullName);  
        formData.append('submittedAt', new Date().toLocaleString());
        formData.append('status', 'pending_review');

     //Send draft to editor as article
     const response = await axios.post('http://localhost:5000/api/articles', 
      formData, { headers: { 'Content-Type' : 'multipart/form-data' } }
     );

     if(response.status === 200 || response.status === 201){
        //Show success message
        toast.success('Draft sent successfully!');
        
        //Close modal and reset form
        setModalOpen(false);
        clearForm();
        setIsEditing(false);
        setEditingDraft(null);

        //Remove from drafts if it's an existing draft
        if(isEditing && editingDraft){
          setDrafts(drafts.filter(d => d._id !== editingDraft._id));
        }        
     }
    } catch (error) {
      console.error('Failed to send draft:', error);
      toast.error('Failed to send draft. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try{
      await axios.delete(`http://localhost:5000/api/drafts/${id}`);
      setDrafts(drafts.filter(d => d._id !==id )); 
      toast.success('Draft deleted successfully.');  
    } catch (error){
      console.error('Failed to delete draft:', error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    clearForm();
    setIsEditing(false);
    setEditingDraft(null);
  };

 return (
      <div className="relative min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <ReporterSidebar isOpen={isReporterSidebarOpen} onClose={() => setReporterSidebarOpen(false)} />

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="text-blue-800 text-2xl m-4 focus:outline-none"
      >
        <FaBars />
      </button>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${isReporterSidebarOpen ? "ml-64" : "ml-0"} p-6 bg-blue-50 min-h-screen`}>
        <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
      
         <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your drafts</h2>
          <button onClick={openNewArticleModal} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + New Article
          </button>
        </div>

        <div className="space-y-4">
          {drafts.map((draft, idx) => (
            <div key={draft._id || idx} className="bg-blue-100 px-4 py-3 rounded flex justify-between items-center">
              <div>
              <p className='font-semibold'>{draft.title}</p>
              <p className='text-sm text-gray-600'>
                {draft.tags && draft.tags.length > 0 && draft.tags.map(tag => `#${tag}`).join('')}
              </p>
              <p className='text-xs text-gray-500'>
                {new Date(draft.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </p>
              </div>
              <div className="space-x-4">
                <button onClick={() => openEditModal(draft)} className="text-gray-700 hover:text-blue-800">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(draft._id)} className="text-gray-700 hover:text-red-600">
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
      </main>

      {/*Modal*/}
      <Modal isOpen={modalOpen} onClose={handleCloseModal}>
        <div className='space-y-4'>
          <h2 className='text-xl font-bold'>
            {isEditing ? `Edit: ${editingDraft?.title || 'Article'}` : 'New Article'}
          </h2>
          <input
            type='text'
            placeholder='Title'
            className='w-full p-2 border rounded'
            value={title}
            onChange={e => setTitle(e.target.value)}         
          />

          <ReactQuill theme="snow" value={content} onChange={setContent} />

          <input
            type='file'
            accept='image/*'
            className='mt-2'
            onChange={(e) => {
                setImageFile(e.target.files[0]);
                setImagePreview(URL.createObjectURL(e.target.files[0]));
             }}
          />

          {imagePreview && <img src={imagePreview} alt='Preview' className='h-32 mt-2 object-cover rounded'/>}

          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>Category</label>
            <select
              value={tags[0] || ''}
              onChange={(e) => setTags(e.target.value ? [e.target.value] : [])}
              className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value="">Select category</option>
              <option value="Latest">Latest</option>
              <option value="Politics">Politics</option>
              <option value="Health">Health</option>
              <option value="Business">Business</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Sports">Sports</option>
            </select>
            
            {tags.length > 0 && (
              <div className='flex items-center gap-2'>
                <span className="bg-blue-200 px-3 py-1 rounded-full text-sm">
                  {tags[0]}
                </span>
              </div>
            )}
          </div> 

          {/*Two button layout*/}         
          <div className='flex gap-3 mt-4'>

          <button
            onClick={handleSaveDraft}
            className="flex-1 bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition-colors"
          >
           {isEditing ? 'Update Article' : 'Save Article'}         
          </button>
          <button onClick={handleSendDraft}
          className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
          >
            Send Article
          </button>
          </div>
        </div>

          </Modal>

    </div>
  );
};

export default ReporterDashboard