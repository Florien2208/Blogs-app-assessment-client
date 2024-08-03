import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import photo from "../../assets/download.png";

const Header = () => {
  const [username, setUsername] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const token = Cookies.get("accessToken");

  useEffect(() => {
    const user1 = Cookies.get("User");
    if (user1) {
      try {
        const userData = JSON.parse(user1);
        setUsername(userData.username);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("User");
    setUsername("");
    setShowDropdown(false);
    // Optionally, you can redirect to the home page or login page here
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/">
            <img src={photo} alt="logo-icon-black" className="w-24" />
          </Link>
        </div>
        <nav className="space-x-4 flex items-center">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          {/* <Link to="/posts" className="hover:underline">
            Posts
          </Link> */}
          {token ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="hover:underline focus:outline-none"
              >
                {username}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Login or 
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
