const ArticleCard = ({ article }) => {
  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-lg font-bold">{article.title}</h2>
      <p className="text-sm text-gray-600">{article.excerpt}</p>
      <p className="text-xs text-gray-400">
        {article.author} – {new Date(article.date).toLocaleDateString()}
      </p>
    </div>
  )
}

export default ArticleCard