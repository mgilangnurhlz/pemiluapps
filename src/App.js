import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Nasional from "./Pages/Nasional";
import Provinsi from "./Pages/Provinsi";
import Kabupaten from "./Pages/Kabupaten";
import Kecamatan from "./Pages/Kecamatan";
import Kelurahan from "./Pages/Kelurahan";
import TPS from "./Pages/TPS";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Nasional />} />
          <Route path="/hitungsuara/:id" element={<Provinsi />} />
          <Route path="/hitungsuara/:id/:id2" element={<Kabupaten />} />
          <Route path="/hitungsuara/:id/:id2/:id3" element={<Kecamatan />} />
          <Route
            path="/hitungsuara/:id/:id2/:id3/:id4"
            element={<Kelurahan />}
          />
          <Route
            path="/hitungsuara/:id/:id2/:id3/:id4/:id5"
            element={<TPS />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
