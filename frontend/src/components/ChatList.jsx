import axios from "axios";
import React from "react";
import { useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import {
  ChatOutlined,
  GroupsOutlined,
  MoreVertOutlined,
  Search,
} from "@mui/icons-material";
import { getSender } from "../config/ChatLogics";
import { ChatState } from "../contexts/ChatProvider";
import {
  Avatar,
  Box,
  InputAdornment,
  List,
  ListItem,
  OutlinedInput,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import AddChatModal from "./AddChatModal";
import AddGroupChatModal from "./AddGroupChatModal";

function ChatList() {
  const { state, setState } = ChatState();
  const [addChat, setAddChat] = useState(false);
  const [addGroupChat, setAddGroupChat] = useState(false);

  const fetchChats = async () => {
    try {
      let config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${state.user.token}`,
        },
      };
      let { data } = await axios.get("/api/chat", config);
      setState((prev) => ({ ...prev, chats: data }));
    } catch (err) {}
  };

  useEffect(() => {
    fetchChats();
  }, [state.user]);

  return (
    <div className="chatlist">
      {state.user ? (
        <>
          <Box
            className="bg-grey"
            display="flex"
            justifyContent="space-between"
            p={1}
          >
            <Avatar src={state.user.pic} alt="user avatar" />
            <Box>
              <Tooltip title="New Chat">
                <IconButton
                  onClick={() => {
                    setAddChat(true);
                  }}
                >
                  <ChatOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="New Group Chat">
                <IconButton
                  onClick={() => {
                    setAddGroupChat(true);
                  }}
                >
                  <GroupsOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
              <IconButton>
                <MoreVertOutlined fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Box p={1} display="flex" alignItems="center" justifyContent="center">
            <OutlinedInput
              size="small"
              placeholder="Search for a chat"
              startAdornment={
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              }
            />
          </Box>
          <List>
            {state.chats.map((ele) => (
              <ListItem
                key={ele._id}
                divider
                onClick={() => {
                  setState({ ...state, selectedChat: ele });
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar
                    alt="chat avatar"
                    src={
                      ele.isGroupChat
                        ? ele.groupAdmin.pic
                        : getSender(state.user._id, ele.users).pic
                    }
                  />
                  <span>
                    {ele.isGroupChat
                      ? ele.chatName
                      : getSender(state.user._id, ele.users).name}
                  </span>
                </Box>
              </ListItem>
            ))}
          </List>
          <AddChatModal addChat={addChat} setAddChat={setAddChat} />
          <AddGroupChatModal
            addGroupChat={addGroupChat}
            setAddGroupChat={setAddGroupChat}
          />
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default ChatList;