import { useState } from "react"
import {FaBars, FaEdit} from 'react-icons/fa'

const EditorDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    //Sample submitted articles
    const submittedArticles = [
      {
      id: 1,
      title: "Robbery attempt in Ngara Road",
      submittedBy: "user",
      date: "03/04/2025",
      time: "4:00 p.m"
    },
    {
      id: 2,
      title: "Outbreak of mysterious illness in the coastal region",
      submittedBy: "user",
      date: "03/04/2025",
      time: "4:00 p.m"
    },
    {
      id: 3,
      title: "Fuel prices reported to increase this month",
      submittedBy: "user",
      date: "03/04/2025",
      time: "4:00 p.m"
    }  
  ];

  const handleEditArticle = (articleId) =>{
    console.log(`Editing article with ID: ${articleId}`);
    
  }

  return (
    <div className="min-h screen bg-gray-50">
        {/*Button*/}
            <button
             onClick={() => setSidebarOpen(!sidebarOpen)}
             className="fixed top-4 left-4 z-40 text-blue-100 text-2xl"
            >
               <FaBars size={24} />                  
            </button>
            
        <div className="flex">
          {/*Sidebar*/}
          <aside  className={`fixed top-0 left-0 h-full w-64 bg-blue-600 text-white flex flex-col z-30 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
            <nav className="p-4 space-y-2">
              <a href="#" className="block py-3 px-4 rounded hover:bg-blue-700 transition-colors">Home</a>
              <a href="#" className="block py-3 px-4 rounded hover:bg-blue-700 transition-colors">Articles</a>
              <a href="#" className="block py-3 px-4 rounded hover:bg-blue-700 transition-colors">Profile</a>
              <a href="#" className="block py-3 px-4 rounded hover:bg-blue-700 transition-colors">Log Out</a>
            </nav>
          </aside>

        

        {/*Main Content*/}
        <main className="w-full min-h-screen bg-gray-100 p-8">
            <div className="w-full max-w-none">
               <h2 className="text-2xl font-bold text-gray-800 mb-6">Submitted Articles</h2>

               <div className="space-y-4">
                 {submittedArticles.map((article) => (
                   <div key={article.id} className="bg-blue-100 rounded-lg p-4 flex justify-between items-center hover:bg-blue-200 transition-colors">                    
                     <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-2">{article.title}</h3>
                        <p className="text-sm text-gray-600">submitted by {article.submittedBy} at {article.date} {article.time}</p>
                     </div>   

                     <button
                       onClick={() => handleEditArticle(article.id)}
                       className="ml-4 p-2 text-gray-600 hover:text-blue-600
                       hover:bg-white rounded-full transition-colors"
                       title="Edit article"
                     >
                       <FaEdit size={18} />
                     </button>
                 </div>   
                ))}
            </div> 

            {submittedArticles.length === 0 && (
                <div className="text-center py-12"> 
                  <p className="text-gray-500 text-lg">No submitted articles at the moment</p>                  
                </div>
            )}

            </div>

        </main>
    </div>
    </div>
    
  );
};

export default EditorDashboard
