import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LogIn from "./LogIn";
import Home from "./Home";
import SignUp from "./SignUp";
import "bootstrap/dist/css/bootstrap.min.css";
import ChatProvider from "../contexts/ChatProvider";

function ChitChat() {

  const routes = [
    {
      path: "/",
      element: (
          <Home />
      ),
    },
    {
      path: "/login",
      element: <LogIn />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
  ];

  const router = createBrowserRouter(routes);

  return (
    <ChatProvider>
      <RouterProvider router={router} />
    </ChatProvider>
  );
}

export default ChitChat;
