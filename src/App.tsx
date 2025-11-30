import "./App.css";

import Pages from "./data/Pages";

import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState<string>(location.pathname);
  useEffect(() => {
    const currentPage = Pages.find((page) => page.path === currentPath);
    document.title = `Todolist Pro | ${
      currentPage?.found ? currentPage?.title : "Page Not Found"
    }`;
  }, [currentPath]);
  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);
  return (
    <>
      <Routes location={location} key={location.pathname}>
        {Pages.map((page, index) => (
          <Route key={index} path={page.path} element={page.component} />
        ))}
      </Routes>
    </>
  );
}

export default App;
