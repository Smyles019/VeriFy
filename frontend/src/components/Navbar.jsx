import { Link } from "react-router-dom";

const Navbar = () => {
    return(
       <nav className="bg-blue-800 text-white px-6 flex
       justify-between items-center">
        <div className="flex items-center space-x-4">
            <img src="/assets/v-logo.png" className="h-8"/>
            <h1 className="text-xl font-bold">VeriFy</h1>
            <div className="hidden md: flex space-x-4 ml-8">
                <Link to="/">Latest</Link>
                <Link to="/politics">Politics</Link>
                <Link to="/health">Health</Link>
                <Link to="/business">Business</Link>
                <Link to="/entertainment">Entertainment</Link>
                <Link to="/sports">Sports</Link> 
            </div>
        </div>
        <div className="flex items-center space-x-2">
          <input 
          type="text" 
          placeholder="Search"
          className="rounded-md px-2 py-1 text-black"
          />
          <button className="bg-zinc-700 text-black px-3 py-1 rounded">Subscribe</button>
          <Link to="/login" className="underline">Sign In</Link>
          </div>
          </nav>
    )
}

export default Navbar