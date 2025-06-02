import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/components/pages/Landing";
import Ranking from "@/components/pages/Ranking";
import Gamemodes from "@/components/pages/Gamemodes";
import Maps from "@/components/pages/Maps";
import Learn from "@/components/pages/Learn";
import Servers from "@/components/pages/Servers";
import Faq from "@/components/pages/Faq";
import Login from "@/components/sections/Login";
import Signup from "@/components/sections/Signup";
import Contributing from "@/components/sections/Contributing";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/ranking" element={<Ranking />} />
                <Route path="/gamemodes" element={<Gamemodes />} />
                <Route path="/maps" element={<Maps />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/servers" element={<Servers />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/contributing" element={<Contributing />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);