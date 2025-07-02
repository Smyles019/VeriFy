//import { useState, useEffect} from "react"
import axios from "axios"
import ArticleCard from "./ArticleCard"
 
const NewsSection = ({ title, articles }) => {

    return(
      <section className="px-8 py-6">
         <h2 className="text-2xl font-bold mb-6">Latest</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4 flex flex-col">
                <div className="h-32 bg-gray-200 rounded mb-4"></div>  {/*Placeholder image*/}
                <p className="text-xs text-zinc-950 font-semibold uppercase">{article.category || article.tags?.[0]}</p>
                <h2 className="font-bold text-lg mb-1">{article.title}</h2>
                <div className="text-xs text-zinc-950 mb-2 flex justify-between">
                    <span>{article.submittedBy}</span>
                    <span>{new Date(article.createdAt).toLocaleDateString('en-GB')}</span>
                </div>
                <p className="text-sm text-zinc-950">
                  {article.content.replace(/<[^>]+>/g, '').slice(0, 100)}...
                </p>            
              </div>             
             ))}
        </div>
      </section>  
    )
}


export default NewsSection
