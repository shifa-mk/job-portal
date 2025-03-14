import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { LogOut, User2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/auth.slice";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";

// Helper function to get Cloudinary URL
const getCloudinaryUrl = (publicId) =>
  `https://res.cloudinary.com/dihk6mdzv/image/upload/${publicId}`;

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/verify`, {
          withCredentials: true,
        });
        if (!res.data.success) {
          dispatch(setUser(null));
          navigate("/login");
        }
      } catch (error) {
        dispatch(setUser(null));
        navigate("/login");
      }
    };

    if (user) {
      verifySession();
    }
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(error.response.data.message);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get avatar URL with fallback
  const avatarUrl = user?.profile?.avatar
    ? user?.profile?.avatar.startsWith("http")
      ? user?.profile?.avatar
      : getCloudinaryUrl(user?.profile?.avatar)
    : null;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="font-bold text-xl"
        >
          Job Portal
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <div
              className="relative"
              ref={dropdownRef}
            >
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 hover:text-blue-600 focus:outline-none"
              >
                <Avatar className="h-8 w-8">
                  {avatarUrl ? (
                    <AvatarImage
                      src={avatarUrl}
                      alt={user.name || "User"}
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-medium">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </Avatar>
                <span>{user.name}</span>
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="hover:text-blue-600"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
