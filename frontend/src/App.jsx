import { useEffect, useState} from 'react'
import axios from 'axios'
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
import FactCheckerDashboard from './pages/FactCheckerDashboard'
import ReviewClaim from './pages/ReviewClaim'
import AdminDashboard from './pages/AdminDashboard'
import UserProfile from './components/UserProfile'
import EditorDashboard from './pages/EditorDashboard'
import UsersTable from './components/UsersTable'
import ArticleList from './components/Articlelist'
import ClaimDetails from './pages/ClaimDetails'
import ArticlePage from './pages/ArticlePage'
import SubmitClaim from './components/Submitclaim'

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
        <Route path="/editordashboard" element={<EditorDashboard />} />
        <Route path="/factcheckerdashboard" element={<FactCheckerDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/reviewclaim" element={<ReviewClaim />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/admin/users" element={<UsersTable />} />
        <Route path="/claimdetails" element={<ClaimDetails />} />
        <Route path="/admin/articles" element={<ArticleList />} />
         <Route path="/submitclaim" element={<SubmitClaim />} />
         <Route path="/article/:id" element={<ArticlePage />} />


  
        
      </Routes>
    
    </div>

    <Footer />
    </Router>
  ) 
}

export default App;
