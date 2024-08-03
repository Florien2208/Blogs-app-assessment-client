import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { ChevronDown, User, Mail, MapPin, LogOut } from "lucide-react";
import photo from "../../assets/download.png";

const Header = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const token = Cookies.get("accessToken");

  useEffect(() => {
    const userData = Cookies.get("User");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("User");
    setUser(null);
    setShowDropdown(false);
    window.location.reload()
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/">
            <img src={photo} alt="logo-icon-black" className="w-24" />
          </Link>
        </div>
        <nav className="space-x-4 flex items-center">
          <Link to="/" className="hover:underline">
            Posts
          </Link>

          {token && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-1 hover:underline focus:outline-none"
              >
                <span>{user.username}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md overflow-hidden shadow-xl z-10">
                  <div className="p-4 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-700">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="py-2">
                    <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <span>{user.username}</span>
                    </div>
                    <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{user.email}</span>
                    </div>
                    <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{user.location || "N/A"}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100 items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Login or Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
