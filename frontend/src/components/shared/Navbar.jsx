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
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const getCloudinaryUrl = (publicId) =>
  `https://res.cloudinary.com/dihk6mdzv/image/upload/${publicId}`;

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
}, [dispatch, navigate, user]);  // ✅ Now includes `dispatch`, `navigate`, and `user`



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
      toast.error(error.response.data.message);
    }
  };

  const navLinks = user?.role === "recruiter" ? [
    { to: "/admin/dashboard", label: "Dashboard", icon: Briefcase },
    { to: "/admin/companies", label: "Companies", icon: Building2 },
    { to: "/admin/jobs", label: "Jobs", icon: Briefcase },
  ] : [
    { to: "/", label: "Home" },
    { to: "/jobs", label: "Jobs", icon: Briefcase },
    { to: "/browse", label: "Browse", icon: Clock },
  ];

  return (
    <div className="bg-white shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto h-16 px-4">
        <Link to="/" className="text-2xl font-bold">
          Job<span className="text-[#F83002]">Portal</span>
        </Link>

        <ul className="flex font-medium items-center gap-8">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <Link to={to} className="flex items-center gap-2 hover:text-[#F83002] transition-colors">
                {Icon && <Icon className="w-4 h-4" />} {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login"><Button variant="outline">Login</Button></Link>
              <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button></Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
                </PopoverTrigger>
                <PopoverContent>
                  <h4 className="font-medium">Notifications</h4>
                  <p className="text-sm text-muted-foreground">No new notifications</p>
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      {user?.profile?.avatar ? (
                        <AvatarImage src={user.profile.avatar.startsWith("http") ? user.profile.avatar : getCloudinaryUrl(user.profile.avatar)} alt={user.fullname || "User"} />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
                          {user?.fullname?.charAt(0) || "U"}
                        </div>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium">{user.fullname}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === "student" && (
                    <DropdownMenuItem asChild>
                      <Link to="/profile"><User2 className="mr-2 h-4 w-4" /> Profile</Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === "recruiter" && (
                    <>
                      <DropdownMenuItem asChild><Link to="/admin/jobs"><LayoutDashboard className="mr-2 h-4 w-4" /> Jobs</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link to="/admin/companies"><Building2 className="mr-2 h-4 w-4" /> Companies</Link></DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={logoutHandler}><LogOut className="mr-2 h-4 w-4" /> Log out</DropdownMenuItem>
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