import { Avatar, Box, Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { getSender } from "../config/ChatLogics";
import { ChatState } from "../contexts/ChatProvider";

function Chat() {
  const { state, setState } = ChatState();

  const fetchMessages = async () => {
    try {
      let config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${state.user.token}`,
        },
      };
      let { data } = await axios.get(
        `/api/message/${state.selectedChat._id}`,
        config
      );
      console.log(data);
      setState((prev) => ({ ...prev, messages: data }));
    } catch (err) {}
  };

  useEffect(() => {
    fetchMessages();
  }, [state.selectedChat]);

  return (
    <Box flexGrow={1} className="chat">
      {state.selectedChat ? (
        <Box>
          <Box
            className="bg-grey"
            display="flex"
            alignItems="center"
            gap={1}
            p={1}
          >
            <Avatar
              alt="chat avatar"
              src={
                state.selectedChat.isGroupChat
                  ? state.selectedChat.groupAdmin.pic
                  : getSender(state.user._id, state.selectedChat.users).pic
              }
            />
            <span>
              {state.selectedChat.isGroupChat
                ? state.selectedChat.chatName
                : getSender(state.user._id, state.selectedChat.users).name}
            </span>
          </Box>
          <Box>
            {state.messages.map((ele) =>
              ele.sender._id === state.user._id ? (
                <Box bgcolor="#d4fad1" textAlign="right">
                  {ele.content}
                </Box>
              ) : (
                <Box textAlign="left">{ele.content}</Box>
              )
            )}
          </Box>
        </Box>
      ) : (
        <Box>
          <Typography textAlign="center" variant="h4">
            Click on a chat to start
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default Chat;
