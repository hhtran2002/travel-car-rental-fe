import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
<<<<<<< HEAD
import "./index.css";   // ✅ bật Tailwind lại
import "./style/app.css"; 
=======
import "./style/app.css";
import "./index.css";
>>>>>>> origin/minh
// import "./index.css";

import "leaflet/dist/leaflet.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
