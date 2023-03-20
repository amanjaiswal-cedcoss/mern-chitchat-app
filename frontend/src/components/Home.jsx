import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChatState } from "../contexts/ChatProvider";
import Chat from "./Chat";
import ChatList from "./ChatList";

function Home() {
  const navigate = useNavigate();
  const { state, setState } = ChatState();
  const location=useLocation()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("chitChatUser"));
    if (user) {
      setState({ ...state, user: user });
    }
    else{
      navigate('/login')
    }
  }, [location]);

  const logOut = () => {
    localStorage.removeItem("chitChatUser");
    setState({ ...state, user: undefined });
    navigate("/login");
  };

  console.log(state)

  return (
    <Box display='flex' className="home">
      <ChatList />
      <Chat />
    </Box>
  );
}

export default Home;
