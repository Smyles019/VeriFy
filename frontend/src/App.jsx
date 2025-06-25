import React from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar'
import NewsSection from './components/NewsSection'
import CategorySlider from './components/CategorySlider'
import Footer from './components/Footer'
import ReporterDashboard from './pages/ReporterDashboard'
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"


const Home = () => (
  <main className='px-4 md:px-12 lg:px-20'>
    <NewsSection />
    <NewsSection />
    
  </main>
)
const NotFound = () => <h2>404 Not Found</h2>


const App = () => {
    return( 
    <Router>
     <Navbar />  
     <div className='p-4'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />        
        <Route path="/reporterdashboard" element={<ReporterDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

  
        
      </Routes>
    </div>
    <Footer />
    </Router>
  ) 
}

export default App;
