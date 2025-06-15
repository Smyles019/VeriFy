import React from "react"
import ArticleCard from "./ArticleCard"

  const articles = [
    {
        category: "Trending",
        title: "Israel kills 23 Palestinians in Gaza",
        author: "Terry Washington",
        date: "15 June 2025",
        description: "Lorem ipsum dolor"
    },

    {
    category: "Politics",
    title: "Governor of Salem County arrested over fraud charges",
    author: "John Doe",
    date: "13 June 2025",
    description: "Nunc vulputate efficitur tortor sit amet sodales. Aenean pharetra ut mauris sit amet commodo...",
  },
  {
    category: "Business",
    title: "Deep dive into Kenya's budget for 2025/2026",
    author: "Freddy Nomics",
    date: "14 June 2025",
    description: "Nunc vulputate efficitur tortor sit amet sodales. Aenean pharetra ut mauris sit amet commodo...",
  },

  ]
    
const NewsSection = () => {
    return(
      <section className="px-8 py-6">
         <h2 className="text-2xl font-bold mb-6">Latest</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4 flex flex-col">
                <div className="h-32 bg-gray-200 rounded mb-4"></div>  {/*Placeholder image*/}
                <p className="text-xs text-zinc-950 font-semibold uppercase">{article.category}</p>
                <h2 className="font-bold text-lg mb-1">{article.title}</h2>
                <div className="text-xs text-zinc-950 mb-2 flex justify-between">
                    <span>{article.author}</span>
                    <span>{article.date}</span>
                </div>
                <p className="text-sm text-zinc-950">{article.description}</p>            
              </div>             
             ))}

        </div>

      </section>  
    )
}


export default NewsSection
