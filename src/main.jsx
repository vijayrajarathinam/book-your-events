import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./context/theme-provider";
// import { EventsProvider } from "./context/events-context";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" defaultColorTheme="blue">
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </ReduxProvider>
  </React.StrictMode>
);
