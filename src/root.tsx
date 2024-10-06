import React from "react";
import ReactDOM from "react-dom/client";
import { PluginId } from ".";
import App from "./App";

// 使用 React 18 的新 API
const root = ReactDOM.createRoot(document.getElementById(PluginId));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
