import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  List,
  ListItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { ChatState } from "../contexts/ChatProvider";

const AddGroupChatModal = (props) => {
  const { state, setState } = ChatState();
  const [groupUsers, setGroupUsers] = useState([]);
  const [formData, setFormData] = useState({ groupName: "" });
  const [toast, setToast] = useState({ open: false, type: "", message: "" });

  const { addGroupChat, setAddGroupChat } = { ...props };

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
      setGroupUsers(
        data.map((ele) => {
          return { ...ele, selected: false };
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleClose = () => {
    setAddGroupChat(false);
  };

  const toggleUser = (userId) => {
    let temp = groupUsers.map((ele) =>
      ele._id === userId ? { ...ele, selected: !ele.selected } : ele
    );
    setGroupUsers([...temp]);
  };

  const startGroupChat = async () => {
    if (formData.groupName === "") {
      setToast({
        open: true,
        type: "error",
        message: "Group name cannot be empty",
      });
      return;
    }
    if (groupUsers.filter((ele) => ele.selected).length < 2) {
      setToast({
        open: true,
        type: "error",
        message: "Add atleast two members in the group",
      });
      return;
    }
    try {
      let config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${state.user.token}`,
        },
      };

      let obj = {
        name: formData.groupName,
        users: JSON.stringify(
          groupUsers
            .filter((ele) => ele.selected)
            .map((innereEle) => innereEle._id)
        ),
      };

      let { data } = await axios.post("/api/chat/group", obj, config);
      handleClose();
      console.log(data);
      setState((prev) => ({
        ...prev,
        chats: [...state.chats, data],
        selectedChat: data,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog open={addGroupChat} onClose={handleClose} scroll="paper">
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => {
          setToast({ ...toast, open: false });
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => {
            setToast({ ...toast, open: false });
          }}
          severity={toast.type}
        >
          {toast.message}
        </Alert>
      </Snackbar>
      <Box p={2} maxWidth={300}>
        <TextField
          size="small"
          placeholder="Group Name"
          value={formData.groupName}
          onChange={(e) => {
            setFormData({ ...formData, groupName: e.target.value });
          }}
        />
        <Box display="flex" flexWrap="wrap" gap={1} p={1}>
          {groupUsers
            .filter((ele) => ele.selected)
            .map((ele) => (
              <Chip
                key={ele._id}
                color="success"
                size="small"
                label={ele.name}
                onDelete={() => {
                  toggleUser(ele._id);
                }}
                avatar={<Avatar src={ele.pic} />}
              />
            ))}
        </Box>
        <Typography marginY={1}>Select users</Typography>
        <List sx={{ maxHeight: 230, overflowY: "scroll", margin: "5px 0" }}>
          {groupUsers
            .filter((ele) => !ele.selected)
            .map((ele) => (
              <ListItem
                button
                key={ele._id}
                onClick={() => {
                  toggleUser(ele._id);
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar alt="chat avatar" src={ele.pic} />
                  <span>{ele.name}</span>
                </Box>
              </ListItem>
            ))}
        </List>
        <Button
          onClick={startGroupChat}
          variant="contained"
          className="bg-wtspgreen"
        >
          Create Group
        </Button>
      </Box>
    </Dialog>
  );
};

export default AddGroupChatModal;
