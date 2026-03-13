import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "../../util/UserContext";
import Spinner from "react-bootstrap/Spinner";
import { Link, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import ScrollableFeed from "react-scrollable-feed";
import RequestCard from "./RequestCard";
import "./Chats.css";
import Modal from "react-bootstrap/Modal";

var socket;
const Chats = () => {
  const [showChatHistory, setShowChatHistory] = useState(true);
  const [showRequests, setShowRequests] = useState(null);
  const [requests, setRequests] = useState([]);
  const [requestLoading, setRequestLoading] = useState(false);
  const [acceptRequestLoading, setAcceptRequestLoading] = useState(false);

  const [scheduleModalShow, setScheduleModalShow] = useState(false);
  const [requestModalShow, setRequestModalShow] = useState(false);

  // to store selected chat
  const [selectedChat, setSelectedChat] = useState(null);
  // to store chat messages
  const [chatMessages, setChatMessages] = useState([]);
  // to store chats
  const [chats, setChats] = useState([]);
  const [chatLoading, setChatLoading] = useState(true);
  const [chatMessageLoading, setChatMessageLoading] = useState(false);
  // to store message
  const [message, setMessage] = useState("");

  const [selectedRequest, setSelectedRequest] = useState(null);

  const { user, setUser } = useUser();

  const navigate = useNavigate();

  const [scheduleForm, setScheduleForm] = useState({
    date: "",
    time: "",
  });

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    socket = io(axios.defaults.baseURL);
    if (user) {
      socket.emit("setup", user);
    }
    socket.on("message recieved", (newMessageRecieved) => {
      console.log("New Message Recieved: ", newMessageRecieved);
      console.log("Selected Chat: ", selectedChat);
      console.log("Selected Chat ID: ", selectedChat.id);
      console.log("New Message Chat ID: ", newMessageRecieved.chatId._id);
      if (selectedChat && selectedChat.id === newMessageRecieved.chatId._id) {
        setChatMessages((prevState) => [...prevState, newMessageRecieved]);
      }
    });
    return () => {
      socket.off("message recieved");
    };
  }, [selectedChat]);

  const fetchChats = async () => {
    try {
      setChatLoading(true);
      const tempUser = JSON.parse(localStorage.getItem("userInfo"));
      const { data } = await axios.get("/chat");
      // console.log("Chats", data.data);
      toast.success(data.message);
      if (tempUser?._id) {
        const temp = data.data.map((chat) => {
          return {
            id: chat._id,
            name: chat?.users.find((u) => u?._id !== tempUser?._id).name,
            picture: chat?.users.find((u) => u?._id !== tempUser?._id).picture,
            username: chat?.users.find((u) => u?._id !== tempUser?._id).username,
          };
        });
        setChats(temp);
      }
      // console.log(temp);
    } catch (err) {
      console.log(err);
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
        if (err.response.data.message === "Please Login") {
          localStorage.removeItem("userInfo");
          setUser(null);
          await axios.get("/auth/logout");
          navigate("/login");
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setChatLoading(false);
    }
  };

  const handleScheduleClick = () => {
    setScheduleModalShow(true);
  };

  const handleChatClick = async (chatId) => {
    try {
      setChatMessageLoading(true);
      const { data } = await axios.get(`/message/getMessages/${chatId}`);
      setChatMessages(data.data);
      // console.log("Chat Messages:", data.data);
      setMessage("");
      // console.log("Chats: ", chats);
      const chatDetails = chats.find((chat) => chat.id === chatId);
      setSelectedChat(chatDetails);
      // console.log("selectedChat", chatDetails);
      // console.log("Data", data.message);
      socket.emit("join chat", chatId);
      toast.success(data.message);
    } catch (err) {
      console.log(err);
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
        if (err.response.data.message === "Please Login") {
          localStorage.removeItem("userInfo");
          setUser(null);
          await axios.get("/auth/logout");
          navigate("/login");
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setChatMessageLoading(false);
    }
  };

  const sendMessage = async (e) => {
    try {
      socket.emit("stop typing", selectedChat._id);
      if (message === "") {
        toast.error("Message is empty");
        return;
      }
      const { data } = await axios.post("/message/sendMessage", { chatId: selectedChat.id, content: message });
      // console.log("after sending message", data);
      socket.emit("new message", data.data);
      setChatMessages((prevState) => [...prevState, data.data]);
      setMessage("");
      // console.log("Data", data.message);
      toast.success(data.message);
    } catch (err) {
      console.log(err);
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
        if (err.response.data.message === "Please Login") {
          await axios.get("/auth/logout");
          setUser(null);
          localStorage.removeItem("userInfo");
          navigate("/login");
        }
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const getRequests = async () => {
    try {
      setRequestLoading(true);
      const { data } = await axios.get("/request/getRequests");
      setRequests(data.data);
      console.log(data.data);
      toast.success(data.message);
    } catch (err) {
      console.log(err);
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
        if (err.response.data.message === "Please Login") {
          await axios.get("/auth/logout");
          setUser(null);
          localStorage.removeItem("userInfo");
          navigate("/login");
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setRequestLoading(false);
    }
  };

  const handleTabClick = async (tab) => {
    if (tab === "chat") {
      setShowChatHistory(true);
      setShowRequests(false);
      await fetchChats();
    } else if (tab === "requests") {
      setShowChatHistory(false);
      setShowRequests(true);
      await getRequests();
    }
  };

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setRequestModalShow(true);
  };

  const handleRequestAccept = async (e) => {
    console.log("Request accepted");

    try {
      setAcceptRequestLoading(true);
      const { data } = await axios.post("/request/acceptRequest", { requestId: selectedRequest._id });
      console.log(data);
      toast.success(data.message);
      // remove this request from the requests list
      setRequests((prevState) => prevState.filter((request) => request._id !== selectedRequest._id));
    } catch (err) {
      console.log(err);
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
        if (err.response.data.message === "Please Login") {
          await axios.get("/auth/logout");
          setUser(null);
          localStorage.removeItem("userInfo");
          navigate("/login");
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setAcceptRequestLoading(false);
      setRequestModalShow(false);
    }
  };

  const handleRequestReject = async () => {
    console.log("Request rejected");
    try {
      setAcceptRequestLoading(true);
      const { data } = axios.post("/request/rejectRequest", { requestId: selectedRequest._id });
      console.log(data);
      toast.success(data.message);
      setRequests((prevState) => prevState.filter((request) => request._id !== selectedRequest._id));
    } catch (err) {
      console.log(err);
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
        if (err.response.data.message === "Please Login") {
          await axios.get("/auth/logout");
          setUser(null);
          localStorage.removeItem("userInfo");
          navigate("/login");
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setAcceptRequestLoading(false);
      setRequestModalShow(false);
    }
  };

  return (
    <div className="container-overall" style={{ paddingTop: "80px" }}>
      <div className="container-right" style={{ background: "linear-gradient(135deg, #fdfdfd 0%, #fff9e6 100%)" }}>
    {/* Chat History */}
    <div className="container-left">
      {/* Tabs */}
      <div className="tabs">
        <Button
          className="chatButton"
          variant="secondary"
          style={{
            borderTop: showChatHistory ? "2px solid var(--brand-yellow)" : "1px solid var(--border)",
            borderRight: showChatHistory ? "2px solid var(--brand-yellow)" : "1px solid var(--border)",
            borderLeft: showChatHistory ? "2px solid var(--brand-yellow)" : "1px solid var(--border)",
            borderBottom: "none",
            backgroundColor: showChatHistory ? "var(--brand-yellow)" : "var(--surface)",
            color: showChatHistory ? "var(--text)" : "var(--text)",
            cursor: "pointer",
            minWidth: "150px",
            padding: "10px",
            fontWeight: showChatHistory ? 600 : 400,
            borderRadius: "10px 10px 0 0",
          }}
          onClick={() => handleTabClick("chat")}
        >
          Chat History
        </Button>
        <Button
          className="requestButton"
          style={{
            borderTop: showRequests ? "2px solid var(--brand-yellow)" : "1px solid var(--border)",
            borderRight: showRequests ? "2px solid var(--brand-yellow)" : "1px solid var(--border)",
            borderLeft: showRequests ? "2px solid var(--brand-yellow)" : "1px solid var(--border)",
            borderBottom: "none",
            backgroundColor: showChatHistory ? "var(--surface)" : "var(--brand-yellow)",
            color: showChatHistory ? "var(--text)" : "var(--text)",
            cursor: "pointer",
            minWidth: "150px",
            padding: "10px",
            fontWeight: !showChatHistory ? 600 : 400,
            borderRadius: "10px 10px 0 0",
          }}
          onClick={() => handleTabClick("requests")}
        >
          Requests
        </Button>
      </div>

          {/* Chat History or Requests List */}
          {showChatHistory && (
            <div className="container-left">
              <ListGroup className="chat-list">
                {chatLoading ? (
                  <div className="row m-auto mt-5">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <>
                    {chats.map((chat) => (
                      <ListGroup.Item
                        key={chat.id}
                        onClick={() => handleChatClick(chat.id)}
                        style={{
                          cursor: "pointer",
                          marginBottom: "10px",
                          padding: "10px",
                          backgroundColor: selectedChat?.id === chat?.id ? "#ffeb99" : "#ffffff",
                          border: "1px solid rgba(17,24,39,0.12)",
                          borderRadius: "5px",
                        }}
                      >
                        {chat.name}
                      </ListGroup.Item>
                    ))}
                  </>
                )}
              </ListGroup>
            </div>
          )}
          {showRequests && (
            <div className="container-left">
              <ListGroup style={{ padding: "10px" }}>
                {requestLoading ? (
                  <div className="row m-auto mt-5">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <>
                    {requests.map((request) => (
                      <ListGroup.Item
                        key={request.id}
                        onClick={() => handleRequestClick(request)}
                        style={{
                          cursor: "pointer",
                          marginBottom: "10px",
                          padding: "10px",
                          backgroundColor: selectedRequest && selectedRequest.id === request.id ? "#ffeb99" : "#ffffff",
                          border: "1px solid rgba(17,24,39,0.12)",
                          borderRadius: "5px",
                        }}
                      >
                        {request.name}
                      </ListGroup.Item>
                    ))}
                  </>
                )}
              </ListGroup>
            </div>
          )}
          {requestModalShow && (
            <div className="modalBG" onClick={() => setRequestModalShow(false)}>
              <div className="modalContent">
                <h2 style={{ textAlign: "center" }}>Confirm your choice?</h2>
                {selectedRequest && (
                  <RequestCard
                    name={selectedRequest?.name}
                    skills={selectedRequest?.skillsProficientAt}
                    rating="4"
                    picture={selectedRequest?.picture}
                    username={selectedRequest?.username}
                    onClose={() => setSelectedRequest(null)} // Close modal when clicked outside or close button
                  />
                )}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button className="connect-button" style={{ marginLeft: "0" }} onClick={handleRequestAccept}>
                    {acceptRequestLoading ? (
                      <div className="row m-auto ">
                        <Spinner animation="border" variant="primary" />
                      </div>
                    ) : (
                      "Accept!"
                    )}
                  </button>
                  <button className="report-button" onClick={handleRequestReject}>
                    {acceptRequestLoading ? (
                      <div className="row m-auto ">
                        <Spinner animation="border" variant="primary" />
                      </div>
                    ) : (
                      "Reject"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Right Section */}
        <div className="container-chat" style={{ background: "#ffffff", borderRadius: "10px", boxShadow: "0 4px 20px rgba(230, 194, 51, 0.1)" }}>
          {/* Profile Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "15px",
              borderBottom: "2px solid var(--brand-yellow)",
              minHeight: "60px",
              backgroundColor: "linear-gradient(90deg, #e6c233 0%, #d4a017 100%)",
              borderRadius: "10px 10px 0 0"
            }}
          >
            {/* Profile Info */}
            {selectedChat ? (
              <>
                <div>
                  <img
                    src={selectedChat?.picture ? selectedChat.picture : "https://via.placeholder.com/150"}
                    alt="Profile"
                    style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" }}
                  />
                  <span style={{ fontFamily: "Montserrat, sans-serif", color: "#111827" }}>
                    {selectedChat?.username}
                  </span>
                </div>
                <Button 
                  style={{
                    backgroundColor: "var(--brand-yellow)",
                    borderColor: "var(--brand-yellow)",
                    color: "var(--text)",
                    fontWeight: 600,
                    borderRadius: "10px",
                  }} 
                  onClick={handleScheduleClick}
                >
                  Request Video Call
                </Button>
              </>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <span style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>Select a chat to start messaging</span>
                <Button 
                  style={{
                    backgroundColor: "var(--brand-yellow)",
                    borderColor: "var(--brand-yellow)",
                    color: "var(--text)",
                    fontWeight: 600,
                    borderRadius: "10px",
                  }} 
                  onClick={() => toast.info("Please select a chat first")}
                >
                  Request Video Call
                </Button>
              </div>
            )}

            {/* Schedule Video Call Button */}
          </div>

          {/* Chat Interface */}
          <div style={{ flex: "7", position: "relative", height: "calc(100vh - 160px)" }}>
            {/* Chat Messages */}
            <div
              style={{
                height: "calc(100% - 50px)",
                color: "#111827",
                padding: "20px",
                overflowY: "auto",
                position: "relative",
                backgroundColor: "#fff7cc",
              }}
            >
              {selectedChat ? (
                <ScrollableFeed forceScroll="true">
                  {chatMessages.map((message, index) => {
                    // console.log("user:", user._id);
                    // console.log("sender:", message.sender);
                    return (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: message.sender._id == user._id ? "flex-end" : "flex-start",
                          marginBottom: "10px",
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: message.sender._id === user._id ? "#ffeb99" : "#ffffff",
                            color: "#111827",
                            border: "1px solid rgba(17,24,39,0.12)",
                            padding: "10px",
                            borderRadius: "10px",
                            maxWidth: "70%",
                            textAlign: message.sender._id == user._id ? "right" : "left",
                          }}
                        >
                          {message.content}
                        </div>
                      </div>
                    );
                  })}
                </ScrollableFeed>
              ) : (
                <>
                  {chatMessageLoading ? (
                    <div className="row h-100 d-flex justify-content-center align-items-center">
                      <Spinner animation="border" variant="primary" />
                    </div>
                  ) : (
                    <div className="row w-100 h-100 d-flex justify-content-center align-items-center">
                      <h3 className="row w-100 d-flex justify-content-center align-items-center">
                        Select a chat to start messaging
                      </h3>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Chat Input */}
            {selectedChat && (
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "0",
                  right: "0",
                  padding: "10px",
                  borderTop: "1px solid rgba(17,24,39,0.12)",
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#ffffff",
                }}
              >
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{
                    flex: "1",
                    padding: "12px",
                    borderRadius: "25px",
                    marginRight: "10px",
                    border: "2px solid var(--brand-yellow)",
                    backgroundColor: "#fff9e6",
                    fontFamily: "var(--font-body)",
                    transition: "all 0.3s ease"
                  }}
                />
                <Button variant="success" style={{ padding: "10px 20px", borderRadius: "5px" }} onClick={sendMessage}>
                  Send
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Video Call Modal */}
      {scheduleModalShow && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: "500",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "linear-gradient(145deg, var(--surface), #fff9e6)",
              border: "2px solid var(--brand-yellow)",
              boxShadow: "0 10px 30px rgba(230, 194, 51, 0.15)",
              color: "var(--text)",
              padding: "40px",
              borderRadius: "25px",
              zIndex: "1001",
              minWidth: "400px",
            }}
          >
            <h3 style={{ color: "var(--brand-yellow)", fontFamily: "var(--font-display)", marginBottom: "30px", textAlign: "center" }}>Request a Meeting</h3>
            <Form>
              <Form.Group controlId="formDate" style={{ marginBottom: "20px", zIndex: "1001" }}>
                <Form.Label style={{ color: "var(--brand-yellow)", fontWeight: 600 }}>Preferred Date</Form.Label>
                <Form.Control
                  type="date"
                  value={scheduleForm.date}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                  style={{
                    borderRadius: "10px",
                    border: "2px solid var(--brand-yellow)",
                    backgroundColor: "var(--surface)",
                    color: "var(--text)",
                  }}
                />
              </Form.Group>

              <Form.Group controlId="formTime" style={{ marginBottom: "30px", zIndex: "1001" }}>
                <Form.Label style={{ color: "var(--brand-yellow)", fontWeight: 600 }}>Preferred Time</Form.Label>
                <Form.Control
                  type="time"
                  value={scheduleForm.time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                  style={{
                    borderRadius: "10px",
                    border: "2px solid var(--brand-yellow)",
                    backgroundColor: "var(--surface)",
                    color: "var(--text)",
                  }}
                />
              </Form.Group>

              <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                <Button
                  style={{
                    backgroundColor: "var(--brand-yellow)",
                    borderColor: "var(--brand-yellow)",
                    color: "var(--text)",
                    fontWeight: 600,
                    borderRadius: "10px",
                    padding: "10px 25px",
                  }}
                  variant="success"
                  type="submit"
                  onClick={async (e) => {
                    e.preventDefault();
                    if (scheduleForm.date === "" || scheduleForm.time === "") {
                      toast.error("Please fill all the fields");
                      return;
                    }

                    scheduleForm.username = selectedChat.username;
                    try {
                      const { data } = await axios.post("/user/sendScheduleMeet", scheduleForm);
                      toast.success("Request mail has been sent successfully!");
                      setScheduleForm({
                        date: "",
                        time: "",
                      });
                    } catch (error) {
                      console.log(error);
                      if (error?.response?.data?.message) {
                        toast.error(error.response.data.message);
                        if (error.response.data.message === "Please Login") {
                          localStorage.removeItem("userInfo");
                          setUser(null);
                          await axios.get("/auth/logout");
                          navigate("/login");
                        }
                      } else {
                        toast.error("Something went wrong");
                      }
                    }
                    setScheduleModalShow(false);
                  }}
                >
                  Submit
                </Button>
                <Button 
                  style={{
                    backgroundColor: "var(--brand-orange)",
                    borderColor: "var(--brand-orange)",
                    color: "white",
                    fontWeight: 600,
                    borderRadius: "10px",
                    padding: "10px 25px",
                  }}
                  variant="danger" 
                  onClick={() => setScheduleModalShow(false)}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chats;
