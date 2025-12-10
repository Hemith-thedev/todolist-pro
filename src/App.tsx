import "./App.css";

import { Pages, PageNotFoundRoute } from "./data/Pages";

import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { Analytics } from "@vercel/analytics/react";

function App() {
  const location = useLocation();
  useEffect(() => {
    const CurrentRoute = Pages.find((page) => page.path === location.pathname);
    if (CurrentRoute) {
      document.title = `Todolist PRO | ${CurrentRoute?.title}`;
    } else {
      document.title = "Todolist PRO | 404";
    }
  }, [location.pathname]);
  return (
    <>
      <Routes location={location} key={location.pathname}>
        {Pages.map((page, index) => (
          <Route key={index} path={page.path} element={<page.component />} />
        ))}
        <Route path={PageNotFoundRoute.path} element={<PageNotFoundRoute.component />} />
      </Routes>
      <Analytics />
    </>
  );
}

export default App;
