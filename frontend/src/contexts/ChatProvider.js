import React, { createContext, useContext, useState } from "react";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [state, setState] = useState({
    user: undefined,
    chats: [],
    users: [],
    selectedChat: undefined,
    messages:[]
  });

  return (
    <ChatContext.Provider value={{ state, setState }}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
