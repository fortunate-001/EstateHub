import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom" // BrowserRouter is here
import "./index.css"
import App from "./App"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter> {/* BrowserRouter is only here */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
)