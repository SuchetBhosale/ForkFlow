import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import App from "./App.jsx";
import "./index.css";

const saved = localStorage.getItem("ff-theme") || "light";
document.documentElement.setAttribute("data-bs-theme", saved);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);