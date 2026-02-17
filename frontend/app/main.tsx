import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/app.css";

import Home from "./routes/home";
import MakerDetails from "./routes/makerDetails";
import AddMaker from "./routes/addMaker";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/makerDetails/:makerId" element={<MakerDetails />} />
        <Route path="/addMaker" element={<AddMaker />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
