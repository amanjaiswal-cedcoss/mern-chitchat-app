import { Avatar, Box, Dialog, List, ListItem, Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { ChatState } from "../contexts/ChatProvider";

const AddChatModal = (props) => {
  const { state, setState } = ChatState();
  const { addChat, setAddChat } = { ...props };

  const fetchAllUsers = async () => {
    try {
      let config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${state.user.token}`,
        },
      };
      let { data } = await axios.get("/api/user", config);
      setState((prev) => ({ ...prev, users: data }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleClose = () => {
    setAddChat(false);
  };

  const startChat = async (userId) => {
    try {
      let config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${state.user.token}`,
        },
      };
      let { data } = await axios.post("/api/chat", { userId }, config);
      console.log(data);
      if (state.chats.find((ele) => ele._id === data._id)) {
        setState((prev) => ({ ...prev, selectedChat: data }));
      } else {
        setState((prev) => ({ ...prev, chats: [...state.chats, data] }));
      }
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog open={addChat} onClose={handleClose} scroll="paper">
      <Box maxWidth={300}>
        <Typography margin={2} variant="h6">
          Tap on a user to start chat
        </Typography>
        <List>
          {state.users.map((ele) => (
            <ListItem
              button
              key={ele._id}
              divider
              onClick={() => {
                startChat(ele._id);
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar alt="chat avatar" src={ele.pic} />
                <span>{ele.name}</span>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </Dialog>
  );
};

export default AddChatModal;
