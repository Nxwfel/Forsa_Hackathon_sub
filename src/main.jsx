import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import App from "./App.jsx";
import Preloader from "./Components/Preloader.jsx";
import LandingPage from "./Pages/LandingPage.jsx";

const router = createBrowserRouter([
  { path: "/",element: <LandingPage/>, },
   {path:'/Dashboard',element: <App/>},
   
]);


const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <RouterProvider router={router} />,
);