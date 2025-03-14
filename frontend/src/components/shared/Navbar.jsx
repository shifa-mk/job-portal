import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import {
  LogOut,
  User2,
  Briefcase,
  Building2,
  Clock,
  Bell,
  LayoutDashboard,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/auth.slice";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const recruiterLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: Briefcase },
    { to: "/admin/companies", label: "Companies", icon: Building2 },
    { to: "/admin/jobs", label: "Jobs", icon: Briefcase },
  ];

  const candidateLinks = [
    { to: "/", label: "Home", icon: null },
    { to: "/jobs", label: "Jobs", icon: Briefcase },
    { to: "/browse", label: "Browse", icon: Clock },
  ];

  return (
    <div className="bg-white shadow-sm">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
        {/* Logo */}
        <div>
          <Link
            to="/"
            className="text-2xl font-bold"
          >
            Job<span className="text-[#F83002]">Portal</span>
          </Link>
        </div>

        {/* Center Navigation Links */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <ul className="flex font-medium items-center gap-8">
            {user && user.role === "recruiter"
              ? recruiterLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="flex items-center gap-2 hover:text-[#F83002] transition-colors"
                    >
                      {link.icon && <link.icon className="w-4 h-4" />}
                      {link.label}
                    </Link>
                  </li>
                ))
              : candidateLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="flex items-center gap-2 hover:text-[#F83002] transition-colors"
                    >
                      {link.icon && <link.icon className="w-4 h-4" />}
                      {link.label}
                    </Link>
                  </li>
                ))}
          </ul>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* Notifications Popover - Optional */}
              <Popover>
                <PopoverTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                  >
                    <Bell className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="space-y-2">
                    <h4 className="font-medium">Notifications</h4>
                    <div className="text-sm text-muted-foreground">
                      No new notifications
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      {avatarUrl ? (
                        <AvatarImage
                          src={avatarUrl}
                          alt={user?.fullname || "User"}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
                          {user?.fullname?.charAt(0) || "U"}
                        </div>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.fullname}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user?.role === "student" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          to="/profile"
                          className="flex items-center"
                        >
                          <User2 className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          to="/applications"
                          className="flex items-center"
                        >
                          <Briefcase className="mr-2 h-4 w-4" />
                          <span>My Applications</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {user?.role === "recruiter" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center"
                        >
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          to="/admin/companies"
                          className="flex items-center"
                        >
                          <Building2 className="mr-2 h-4 w-4" />
                          <span>Companies</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={logoutHandler}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
