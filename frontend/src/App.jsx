import "./App.css";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./components/shared components/Home.jsx";
import axios from "axios";


import Navbar from "./components/shared components/Navbar.jsx"


function App() {
 
  return (
    <>
        <Navbar/>
       <Routes>
       <Route path="/" element={<Home />} />

      </Routes>
    </>
  );
}

export default App;
