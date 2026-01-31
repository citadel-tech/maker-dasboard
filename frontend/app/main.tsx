import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/app.css";

import Home from "./routes/home";
import Maker from "./routes/maker";
import MakerDetails from "./routes/makerDetails";
import AddMaker from "./routes/addMaker";
import Settings from "./routes/settings";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/maker" element={<Maker />} />
        <Route path="/makerDetails/:makerId" element={<MakerDetails />} />
        <Route path="/addMaker" element={<AddMaker />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
