import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/components/pages/Landing";
import Gameplay from "@/components/pages/Gameplay";
import Ranking from "@/components/pages/Ranking";
import Maps from "@/components/pages/Maps";
import Gamemodes from "@/components/pages/Gamemodes";
import Servers from "@/components/pages/Servers";
import Faq from "@/components/pages/Faq";
import Login from "@/components/sections/Authentication/Login";
import Signup from "@/components/sections/Authentication/Signup";
import EarlyAccess from "@/components/sections/EarlyAccess";
import Contributing from "@/components/sections/Contributing";
import Commits from "@/components/sections/Commits";
import Roadmap from "@/components/sections/Roadmap";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/gameplay" element={<Gameplay />} />
                <Route path="/ranking" element={<Ranking />} />
                <Route path="/maps" element={<Maps />} />
                <Route path="/gamemodes" element={<Gamemodes />} />
                <Route path="/servers" element={<Servers />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/earlyaccess" element={<EarlyAccess />} />
                <Route path="/contributing" element={<Contributing />} />
                <Route path="/commits" element={<Commits />} />
                <Route path="/roadmap" element={<Roadmap />} />

                {/* Wildcard route - any unmatched url */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);