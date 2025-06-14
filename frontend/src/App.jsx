import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home'
import ArticleDetails from './pages/ArticleDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import Navbar from './components/Navbar';
import NewsSection from './components/NewsSection';
import CategorySlider from './components/CategorySlider';
import Footer from './components/Footer';

function App(){
    return(
   <Router>
     <div className="min-h-screen flex flex-col">
      <Navbar/>
       <main className='flex-grow px-6'>
    <Routes>
      <Route path="/" element = {
        <>
        <NewsSection/>
        <CategorySlider/>
        </>
      }/>
      <Route path="/" element={<Home />} />
      <Route path="/article/:id" element={<ArticleDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </main>
    <Footer />
    </div>
    </Router>
    ); 
}


export default App
