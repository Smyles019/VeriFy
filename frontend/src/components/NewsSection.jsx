//import { useState, useEffect} from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import ArticleCard from "./ArticleCard"
 
const NewsSection = ({ title, articles }) => {
  const sectionTitle = title || articles[0]?.category || articles[0]?.tags?.[0] || "Latest";

    return(
      <section className="px-8 py-6">
         <h2 className="text-2xl font-bold mb-6">{sectionTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <Link to={`/article/${article._id}`} key={index} className="bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-lg transition-shadow" >
                {article.image ? (
                  <img 
                     src = {`http://localhost:5000/uploads/${article.image}`}
                     alt={article.title}
                     className="h-32 w-full object-cover rounded mb-4" />
                ) : (
                  <div className="h-32 bg-gray-200 rounded mb-4"></div>
               
                )}
                <p className="text-xs text-zinc-950 font-semibold uppercase">{article.category || article.tags?.[0]}</p>
                <h2 className="font-bold text-lg mb-1">{article.title}</h2>
                <div className="text-xs text-zinc-950 mb-2 flex justify-between">
                    <span>{article.submittedBy}</span>
                    <span>{new Date(article.createdAt).toLocaleDateString('en-GB')}</span>
                </div>
                <p className="text-sm text-zinc-950">
                  {article.content.replace(/<[^>]+>/g, '').slice(0, 100)}...
                </p>
                </Link>            
             ))}
        </div>
      </section>  
    )
}

export default NewsSection