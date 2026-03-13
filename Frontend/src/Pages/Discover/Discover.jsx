import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../util/UserContext";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ProfileCard from "./ProfileCard";
import "./Discover.css";
import Search from "./Search";
import Spinner from "react-bootstrap/Spinner";

const Discover = () => {
  const navigate = useNavigate();

  const { user, setUser } = useUser();

  const [loading, setLoading] = useState(false);

  const [discoverUsers, setDiscoverUsers] = useState([]);

  const [webDevUsers, setWebDevUsers] = useState([]);

  const [mlUsers, setMlUsers] = useState([]);

  const [otherUsers, setOtherUsers] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/user/registered/getDetails`);
        console.log(data.data);
        setUser(data.data);
        localStorage.setItem("userInfo", JSON.stringify(data.data));
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        }
        localStorage.removeItem("userInfo");
        setUser(null);
        await axios.get("/auth/logout");
        navigate("/login");
      }
    };
    const getDiscoverUsers = async () => {
      try {
        const { data } = await axios.get("/user/discover");
        console.log(data);
        
        // Fetch ratings for each user
        const usersWithRatings = await Promise.all(
          data.data.forYou.map(async (user) => {
            try {
              const ratingResponse = await axios.get(`/rating/getRatings/${user.username}`);
              return {
                ...user,
                rating: ratingResponse.data.data.userRating || 0
              };
            } catch (error) {
              console.error(`Error fetching rating for ${user.username}:`, error);
              return {
                ...user,
                rating: 0
              };
            }
          })
        );
        
        const webDevUsersWithRatings = await Promise.all(
          data.data.webDev.map(async (user) => {
            try {
              const ratingResponse = await axios.get(`/rating/getRatings/${user.username}`);
              return {
                ...user,
                rating: ratingResponse.data.data.userRating || 0
              };
            } catch (error) {
              console.error(`Error fetching rating for ${user.username}:`, error);
              return {
                ...user,
                rating: 0
              };
            }
          })
        );
        
        const mlUsersWithRatings = await Promise.all(
          data.data.ml.map(async (user) => {
            try {
              const ratingResponse = await axios.get(`/rating/getRatings/${user.username}`);
              return {
                ...user,
                rating: ratingResponse.data.data.userRating || 0
              };
            } catch (error) {
              console.error(`Error fetching rating for ${user.username}:`, error);
              return {
                ...user,
                rating: 0
              };
            }
          })
        );
        
        const otherUsersWithRatings = await Promise.all(
          data.data.others.map(async (user) => {
            try {
              const ratingResponse = await axios.get(`/rating/getRatings/${user.username}`);
              return {
                ...user,
                rating: ratingResponse.data.data.userRating || 0
              };
            } catch (error) {
              console.error(`Error fetching rating for ${user.username}:`, error);
              return {
                ...user,
                rating: 0
              };
            }
          })
        );
        
        setDiscoverUsers(usersWithRatings);
        setWebDevUsers(webDevUsersWithRatings);
        setMlUsers(mlUsersWithRatings);
        setOtherUsers(otherUsersWithRatings);
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        }
        localStorage.removeItem("userInfo");
        setUser(null);
        await axios.get("/auth/logout");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    getUser();
    getDiscoverUsers();
  }, []);

  return (
    <>
      <div className="discover-page">
        <div className="content-container">
          <div className="nav-bar">
            <div className="logo-container">
              <h2 style={{ 
                fontFamily: "Josefin Sans, sans-serif", 
                color: "#111827", 
                fontWeight: 700, 
                letterSpacing: "0.08em",
                marginBottom: "2rem",
                textAlign: "center"
              }}>
                SKILL SWAP
              </h2>
            </div>
            <Nav defaultActiveKey="/home" className="flex-column">
              <Nav.Link href="#for-you" className="navlink" id="foryou">
                For You
              </Nav.Link>
              <Nav.Link href="#popular" className="navlink" id="popular1">
                Popular
              </Nav.Link>
              <Nav.Link href="#web-development" className="navlink">
                Web Development
              </Nav.Link>
              <Nav.Link href="#machine-learning" className="navlink">
                Machine Learning
              </Nav.Link>
              {/* <Nav.Link href="#graphic-design" className="navlink">
                Graphic Design
              </Nav.Link>
              <Nav.Link href="#soft-skills" className="navlink">
                Soft Skills
              </Nav.Link> */}
              <Nav.Link href="#others" className="navlink">
                Others
              </Nav.Link>
            </Nav>
          </div>
          <div className="heading-container">
            {loading ? (
              <div className="container d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <>
                {/* <div>
                  <Search />
                </div> */}
                <h1
                  id="for-you"
                  style={{
                    fontFamily: "Josefin Sans, sans-serif",
                    color: "#5c5c5cff",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                  }}
                >
                  For You
                </h1>
                <div className="profile-cards">
                  {discoverUsers && discoverUsers.length > 0 ? (
                    discoverUsers.map((user) => (
                      <ProfileCard
                        profileImageUrl={user?.picture}
                        name={user?.name}
                        rating={user?.rating ? user?.rating : 5}
                        bio={user?.bio}
                        skills={user?.skillsProficientAt}
                        username={user?.username}
                      />
                    ))
                  ) : (
                    <h1 style={{ color: "#e6c233" }}>No users to show</h1>
                  )}
                  {/* <ProfileCard
                    profileImageUrl="/assets/images/sample_profile.jpg"
                    name="Paakhi Maheshwari"
                    rating="⭐⭐⭐⭐⭐"
                    bio="Computer Science student specialising in data science and machine learning"
                    skills={["Machine Learning", "Python", "Data Science", "English", "Communication"]}
                  />
                  <ProfileCard
                    profileImageUrl="/assets/images/sample_profile2.jpeg"
                    name="Harsh Sharma"
                    rating="⭐⭐⭐⭐⭐"
                    bio="Web Developer and Competitive programmer, specialising in MERN stack."
                    skills={["React.JS", "MongoDB", "DSA", "Node.JS"]}
                  /> */}
                </div>
                <h1
                  id="popular"
                  style={{
                    fontFamily: "Josefin Sans, sans-serif",
                    color: "#4b4b4a69ff",
                    marginTop: "1rem",
                    marginBottom: "3rem",
                  }}
                >
                  Popular
                </h1>
                <h2 
                  id="web-development" 
                  style={{
                    fontFamily: "Josefin Sans, sans-serif",
                    color: "#111827",
                    marginTop: "3rem",
                    marginBottom: "1.5rem",
                    fontSize: "1.3rem",
                    fontWeight: 500,
                    borderBottom: "1px solid #e6c233",
                    paddingBottom: "0.3rem",
                    display: "inline-block"
                  }}
                >Web Development</h2>
                <div className="profile-cards">
                  {/* Profile cards go here */}
                  {webDevUsers && webDevUsers.length > 0 ? (
                    webDevUsers.map((user) => (
                      <ProfileCard
                        profileImageUrl={user?.picture}
                        name={user?.name}
                        rating={4}
                        bio={user?.bio}
                        skills={user?.skillsProficientAt}
                        username={user?.username}
                      />
                    ))
                  ) : (
                    <h1 style={{ color: "#e6c233" }}>No users to show</h1>
                  )}
                  {/* Add more ProfileCard components as needed */}
                </div>
                <h2 
                  id="machine-learning" 
                  style={{
                    fontFamily: "Josefin Sans, sans-serif",
                    color: "#111827",
                    marginTop: "3rem",
                    marginBottom: "1.5rem",
                    fontSize: "1.3rem",
                    fontWeight: 500,
                    borderBottom: "1px solid #e6c233",
                    paddingBottom: "0.3rem",
                    display: "inline-block"
                  }}
                >Machine Learning</h2>
                <div className="profile-cards">
                  {mlUsers && mlUsers.length > 0 ? (
                    mlUsers.map((user) => (
                      <ProfileCard
                        profileImageUrl={user?.picture}
                        name={user?.name}
                        rating={4}
                        bio={user?.bio}
                        skills={user?.skillsProficientAt}
                        username={user?.username}
                      />
                    ))
                  ) : (
                    <h1 style={{ color: "#e6c233" }}>No users to show</h1>
                  )}
                  {/* <ProfileCard
                    profileImageUrl="/assets/images/profile2.png"
                    name="Madan Gupta"
                    rating="⭐⭐⭐⭐⭐"
                    bio="Experienced professor specialising in data science and machine learning"
                    skills={["Machine Learning", "Python", "Data Science", "English", "Communication"]}
                  />
                  <ProfileCard
                    profileImageUrl="/assets/images/profile4.jpg"
                    name="Karuna Yadav"
                    rating="⭐⭐⭐⭐"
                    bio="Working professional specialising in Artificial Intelligence and Machine Learning Research."
                    skills={["Machine Learning", "Python", "Data Science", "Artificial Intelligence"]}
                  /> */}
                </div>
                {/* <h2 id="graphic-design">Graphic Design</h2>
                <div className="profile-cards">
                  <ProfileCard
                    profileImageUrl="profile-image-url"
                    name="Name"
                    rating="⭐⭐⭐⭐⭐"
                    bio="yahan apan bio rakhre"
                    skills={["HTML", "CSS", "JS"]}
                  />
                  <ProfileCard
                    profileImageUrl="profile-image-url"
                    name="Name"
                    rating="⭐⭐⭐⭐⭐"
                    bio="yahan apan bio rakhre"
                    skills={["HTML", "CSS", "JS"]}
                  />
                </div>
                <h2 id="soft-skills">Soft Skills</h2>
                <div className="profile-cards">
                  <ProfileCard
                    profileImageUrl="profile-image-url"
                    name="Name"
                    rating="⭐⭐⭐⭐⭐"
                    bio="yahan apan bio rakhre"
                    skills={["HTML", "CSS", "JS"]}
                  />
                  <ProfileCard
                    profileImageUrl="profile-image-url"
                    name="Name"
                    rating="⭐⭐⭐⭐⭐"
                    bio="yahan apan bio rakhre"
                    skills={["HTML", "CSS", "JS"]}
                  />
                </div> */}
                <h2 
                  id="others" 
                  style={{
                    fontFamily: "Josefin Sans, sans-serif",
                    color: "#111827",
                    marginTop: "3rem",
                    marginBottom: "1.5rem",
                    fontSize: "1.3rem",
                    fontWeight: 500,
                    borderBottom: "1px solid #e6c233",
                    paddingBottom: "0.3rem",
                    display: "inline-block"
                  }}
                >Others</h2>
                <div className="profile-cards">
                  {/* Profile cards go here */}
                  {otherUsers && otherUsers.length > 0 ? (
                    otherUsers.map((user) => (
                      <ProfileCard
                        profileImageUrl={user?.picture}
                        name={user?.name}
                        rating={4}
                        bio={user?.bio}
                        skills={user?.skillsProficientAt}
                        username={user?.username}
                      />
                    ))
                  ) : (
                    <h1 style={{ color: "#e6c233" }}>No users to show</h1>
                  )}
                  {/* <ProfileCard
                    profileImageUrl="/assets/images/profile.jpg"
                    name="Anil Khosla"
                    rating="⭐⭐⭐⭐"
                    bio="Professor - Maths 2 @ IIIT Raipur. Specialising in Algebra"
                    skills={["Mathematics", "Algebra", "Arithmetic"]}
                  />
                  <ProfileCard
                    profileImageUrl="/assets/images/profile3.jpg"
                    name="Rahul Goel"
                    rating="⭐⭐⭐⭐"
                    bio="Photography and art enthusiast. National Wildlife Photography Awardee."
                    skills={["Art", "Photography"]}
                  /> */}
                  {/* Add more ProfileCard components as needed */}
                </div>
                {/* Add more ProfileCard components as needed */}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Discover;
