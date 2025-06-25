import { useState } from 'react'
import { FaEdit, FaTrashAlt, FaBars } from 'react-icons/fa'
import Modal from '../components/Modal'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axios from 'axios'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom';


const ReporterDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [drafts, setDrafts] = useState ([
    "Robbery attempt in Ngara Road",
    "Outbreak of mysterious illness in the coastal region",
    "Fuel prices reported to increase this month"
  ]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [image, setImage] = useState(null);

  const handleSave = () => {
    if (title.trim()) {
      setDrafts([...drafts, title]);
    }
    setModalOpen(false);
    setTitle("");
    setContent("");
    setTags([]);
    setNewTag("");
    setImage(null);
  };

 return (
    <div className="relative min-h-screen font-sans">
      {/* Hamburger Button */}
      <button
        className="fixed top-4 left-4 z-40 text-blue-800 text-2xl"
        onClick={() => setSidebarOpen(true)}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-blue-800 text-white flex flex-col z-30 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-center h-16 border-b border-blue-700">
          <img className='w-12'src={logo}/>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-4">
          <Link to="/" className="block hover:bg-blue-700 rounded px-3 py-2">Home</Link>
          <a href="#" className="block hover:bg-blue-700 rounded px-3 py-2">My Articles</a>
          <a href="#" className="block hover:bg-blue-700 rounded px-3 py-2">Claims</a>
          <a href="#" className="block hover:bg-blue-700 rounded px-3 py-2">Profile</a>
          <a href="#" className="block hover:bg-blue-700 rounded px-3 py-2">Log Out</a>
        </nav>
      </div>

      {/* Overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-20"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your drafts</h2>
          <button onClick={() => setModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + New Article
          </button>
        </div>

        <div className="space-y-4">
          {drafts.map((title, idx) => (
            <div key={idx} className="bg-blue-100 px-4 py-3 rounded flex justify-between items-center">
              <p>{title}</p>
              <div className="space-x-4">
                <button className="text-gray-700 hover:text-blue-800">
                  <FaEdit />
                </button>
                <button className="text-gray-700 hover:text-red-600">
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/*Modal*/}
      <Modal isOpen={modalOpen} onClose={handleSave}>
        <div className='space-y-4'>
          <h2 className='text-xl font-bold'>New Article</h2>

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
            onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}         
          />

          {image && <img src={image} alt='Preview' className='h-32 mt-2 object-cover rounded'/>}

          <div className='flex items-center flex-wrap gap-2 mt-2'>
            {tags.map((tag, i) => (
              <span
                key={i}
                className="bg-blue-200 px-2 py-1 rounded-full text-sm flex items-center"
              >
                #{tag}
                <button
                  onClick={() => setTags(tags.filter((_, index) => index !==1))}
                  className='ml-2 text-red-600 font-bold'                  
                >
                  x
                </button>
              </span>            
          ))}
          <input 
            type='text'
            placeholder='Add Tags'
            value={newTag}
            onChange={e => setNewTag(e.target.value)}  
            className='border px-2 py-1 rounded'                
          />

          <button 
               onClick={() => {
                if (newTag.trim()) {
                  nsetTags([...tags, newTag.trim()]);
                  setNewTag("");
                }
              }}
              className="px-2 py-1 bg-blue-600 text-white rounded"    
          >
            +
          </button>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-blue-700 text-white py-2 rounded mt-4"
          >
            Save Article          
          </button>
        </div>

          </Modal>

    </div>
  );
};


export default ReporterDashboard