import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import App from "./App.jsx";
import Preloader from "./Components/Preloader.jsx";
import LandingPage from "./Pages/LandingPage.jsx";
import Chatbot from "./Pages/Chatbot.jsx";

const router = createBrowserRouter([
  { path: "/",element: <LandingPage />, },
  { path: "/Commercial",element: <App/>, },
  { path: "/chatbot",element: <Chatbot />, },

]);


const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <RouterProvider router={router} />,
);