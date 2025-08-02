import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";

// Context Providers
import { MaterialUIControllerProvider } from "context";
import { MemberProvider } from "context/MemberContext"; // <-- Adjust the path as per your structure

const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <MaterialUIControllerProvider>
      <MemberProvider>
        {" "}
        {/* Wrap App with MemberProvider */}
        <App />
      </MemberProvider>
    </MaterialUIControllerProvider>
  </BrowserRouter>
);
