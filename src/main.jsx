import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import App from "./App.jsx";
import Preloader from "./Components/Preloader.jsx";
import HomePage from "./Pages/HomePage.jsx";

const router = createBrowserRouter([
  { path: "/",element: <App/>, },
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <RouterProvider router={router} />,
);