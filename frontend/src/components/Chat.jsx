import { Add, KeyboardArrowDown, KeyboardArrowUp, Send } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Typography,
  Input,
  IconButton,
  CircularProgress,
  Fab,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { getSender } from "../config/ChatLogics";
import { ChatState } from "../contexts/ChatProvider";

function Chat() {
  const { state, setState } = ChatState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const refMessages = useRef(null);

  const fetchMessages = async () => {
    setLoading(true);
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
      setLoading(false);
    } catch (err) {}
  };

  useEffect(() => {
    fetchMessages();
  }, [state.selectedChat]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message === "") {
      return;
    }
    console.log({
      content: message,
      chatId: state.selectedChat._id,
    });
    try {
      let config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${state.user.token}`,
        },
      };
      let { data } = await axios.post(
        `/api/message`,
        {
          content: message,
          chatId: state.selectedChat._id,
        },
        config
      );
      setState((prev) => ({ ...prev, messages: [...state.messages, data] }));
      setMessage("");
    } catch (err) {}
  };

  useEffect(() => {
    refMessages.current.scrollTop = refMessages.current.scrollHeight + 10;
  }, [state.messages]);

  return (
    <Box flexGrow={1} className="chat" position="relative" ref={refMessages}>
      {state.selectedChat ? (
        <Box position="relative" minHeight="100%">
          <Box
            className="bg-grey"
            display="flex"
            alignItems="center"
            gap={1}
            p={1}
            position="sticky"
            top={0}
            width="100%"
            zIndex={2}
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
          <Box
            padding={1}
            display="flex"
            flexDirection="column"
            gap="5px"
            minHeight="500px"
          >
            <Fab color="primary" translate="">
              <KeyboardArrowUp/>
            </Fab>
            {loading ? (
              <Box>
                <CircularProgress />
              </Box>
            ) : (
              state.messages.map((ele) => {
                let sender = ele.sender._id === state.user._id;
                return (
                  <Box
                    key={ele._id}
                    display="flex"
                    justifyContent={sender ? "flex-end" : ""}
                  >
                    <Box
                      maxWidth="50%"
                      width="max-content"
                      bgcolor={sender ? "#d4fad1" : "white"}
                      padding="2px 6px"
                      fontSize={13}
                      borderRadius={1}
                    >
                      {state.selectedChat.isGroupChat && !sender ? (
                        <Typography fontSize={11}>{ele.sender.name}</Typography>
                      ) : (
                        ""
                      )}
                      {ele.content}
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>
          <Box
            position="sticky"
            bottom={0}
            width="100%"
            zIndex={2}
            bgcolor="white"
            p={1}
          >
            <form
              onSubmit={(e) => {
                sendMessage(e);
              }}
            >
              <Input
                placeholder="Type a message"
                disableUnderline
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                endAdornment={
                  <IconButton type="submit">
                    <Send />
                  </IconButton>
                }
              />
            </form>
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
