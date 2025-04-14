import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./context/theme-provider";
import { EventsProvider } from "./context/events-context";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" defaultColorTheme="blue">
        <EventsProvider>
          <App />
        </EventsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
