import { Link } from "react-router-dom";
import logo from '../assets/logo.png'

const Navbar = () => {

    return (
    <>
      {/* Top blue section */}
      <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center">
        {/*Left: Logo*/}
        <div className="flex items-center space-x-4">  
          <img className='w-12'src={logo}/>    
        </div>

        {/*Center: Title */}
         <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold">VeriFy</h1>

         {/*Right: Search sign in, subscribe */}
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search"
            className="rounded-md px-3 py-1 text-black focus:outline-none"
          />
          <Link to="/register">
          <button className="bg-black text-white px-4 py-1 rounded">Subscribe</button>
          </Link>
          <Link to="/login" className="underline">Sign in</Link>
        </div>
      </nav>

      {/* Bottom white section with nav links */}
      <div className="bg-gray-100 text-black px-6 py-2 flex justify-center space-x-6 text-sm font-medium">
        <Link to="/">LATEST</Link>
        <Link to="/politics">POLITICS</Link>
        <Link to="/health">HEALTH</Link>
        <Link to="/business">BUSINESS</Link>
        <Link to="/entertainment">ENTERTAINMENT</Link>
        <Link to="/sports">SPORTS</Link>
      </div>
    </>
  ) 
    

}

export default Navbar