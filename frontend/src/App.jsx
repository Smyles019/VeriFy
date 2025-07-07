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
import MyClaims from './pages/MyClaims'
import ClaimReview from './pages/ReviewClaim'
import ReaderDashboard from './pages/ReaderDashboard'
import Application from './components/ApplicationModal'
import ReaderApplications from './components/ReporterApplications'
import MyApplications from './components/Myapplications'
import AllClaims from './components/AdminClaimList'
import ReaderClaims from './pages/Readerclaims'
import FlaggedArticles from './components/FlaggedArticles'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const Home = () => {
  const [approvedArticles, setApprovedArticles] = useState([]);

  useEffect(() => {
    const fetchApprovedArticles = async () => {
      try{
        const response = await axios.get('http://localhost:5000/api/articles');
        const filtered = response.data.filter(article => article.status === 'approved');
        setApprovedArticles(filtered);       
      } catch (error) {
        console.error('Error fetching approved articles:', error);
      }
    };
    fetchApprovedArticles();
  }, []);

  //Group articles by their first tag/category
  const groupedArticles = approvedArticles.reduce((acc, article) => {
    const category = article.tags?.[0] || 'Uncategorized';
    if(!acc[category]) acc[category] = [];
    acc[category].push(article);
    return acc;
    
  }, {});
 
  return (
    <main className="px-4 md:px-12 lg:px-20"> 
     {Object.entries(groupedArticles).map(([category, articles]) => (
      <NewsSection  key={category} category={category} articles={articles} />
    ))}
    </main>
  );
};


const NotFound = () => <h2>404 Not Found</h2>

const App = () => {
    
    return( 
    <Router>
     <Navbar />  

    <ToastContainer position="top-center" autoClose={3000} />
     
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
        <Route path="/review/:id" element={<ClaimReview />} />
        <Route path="/myclaims" element={<MyClaims />} />
        <Route path="/readerdashboard" element={<ReaderDashboard />} />
        <Route path="/application" element={<Application />} />
        <Route path="/admin/applications" element={<ReaderApplications />} />
        <Route path="/reader/myapplications" element={<MyApplications />} />
        <Route path="/reader/readerclaims" element={<ReaderClaims />} />
        <Route path="/admin/claims" element={<AllClaims />} />
        <Route path="/claim/:id" element={<ClaimDetails />} />
        <Route path="/admin/flagged-articles" element={<FlaggedArticles />} />


  
        
      </Routes>
    
    </div>

    <Footer />
    </Router>
  ) 
}

export default App;
