import React from 'react'
import ArticleCard from './ArticleCard'

const CategorySlider = ({ category }) => {
  const articles = [
    { category: 'Politics', title: 'Governor of Salem County arrested ', author: 'Jane Drinks', date: '2023-06-13', excerpt: '...' },
    { category: 'Politics', title: 'Governor of Salem County arrested ', author: 'Jane Drinks', date: '2023-06-13', excerpt: '...' },
    { category: 'Politics', title: 'Governor of Salem County arrested ', author: 'Jane Drinks', date: '2023-06-13', excerpt: '...' },
  ]

  return (
    <section className="my-8">
      <h3 className="text-xl font-semibold mb-4">Politics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {articles.map((a, idx) => (
          <ArticleCard key={idx} article={a} />
        ))}
      </div>
    </section>
  )
}

export default CategorySlider
