<<<<<<< HEAD
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1 className="text-2xl p-5">Welcome to VeriFy</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<h1 className="text-2xl p-5">404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
=======
import React from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar'
import NewsSection from './components/NewsSection'
import CategorySlider from './components/CategorySlider'
import Footer from './components/Footer'
import ReporterDashboard from './pages/ReporterDashboard'



const Home = () => (
  <main className='px-4 md:px-12 lg:px-20'>
    <NewsSection />
    <NewsSection />
    
  </main>
)
const Login = () => <h2>Login Page</h2>
const NotFound = () => <h2>404 Not Found</h2>


const App = () => {
    return( 
    <Router>
     <Navbar />  
     <div className='p-4'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />        
        <Route path="/reporterdashboard" element={<ReporterDashboard />} />
      </Routes>
    </div>
    <Footer />
    </Router>
  ) 
}

export default App
>>>>>>> bd7a14384a1584bde6cd64ff88668d70a73fee10
