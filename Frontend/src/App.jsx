import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Footer from "./Components/Footer/Footer";
import Discover from "./Pages/Discover/Discover";
import Login from "./Pages/Login/Login";
import Header from "./Components/Navbar/Navbar";
import LandingPage from "./Pages/LandingPage/LandingPage";
import AboutUs from "./Pages/AboutUs/AboutUs";
import Chats from "./Pages/Chats/Chats";
import Report from "./Pages/Report/Report";
import Profile from "./Pages/Profile/Profile";
import NotFound from "./Pages/NotFound/NotFound";
import Register from "./Pages/Register/Register";
import Rating from "./Pages/Rating/Rating";
import EditProfile from "./Pages/EditProfile/EditProfile";
import PrivateRoutes from "./util/PrivateRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Handle OAuth callback and cookie authentication
  useEffect(() => {
    // Check if we have an access token cookie
    const checkAuth = async () => {
      try {
        // Make a request to verify authentication status
        const response = await fetch('http://localhost:8000/api/user/registered/getDetails', {
          credentials: 'include' // Important for cookies
        });
        
        if (response.ok) {
          const userData = await response.json();
          // Store user info in localStorage
          localStorage.setItem('userInfo', JSON.stringify(userData.data));
          
          // If we're on login page, redirect to discover
          if (window.location.pathname === '/login') {
            navigate('/discover');
          }
        }
      } catch (error) {
        // Not authenticated, that's fine
        console.log('Not authenticated');
      }
    };
    
    checkAuth();
  }, [navigate]);

  return (
    <>
      <Header />
      <ToastContainer position="top-right" />
      <div className="page-container" style={{ paddingTop: location.pathname === "/chats" ? "0" : "60px", paddingBottom: "80px" }}>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/chats" element={<Chats />} />
          </Route>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about_us" element={<AboutUs />} />
          <Route path="/edit_profile" element={<EditProfile />} />
          <Route path="/report/:username" element={<Report />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/rating/:username" element={<Rating />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
    </>
  );
};

export default App;
