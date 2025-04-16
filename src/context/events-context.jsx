"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { fetchEvents as fetchEventsApi } from "../services/api";

const EventsContext = createContext(undefined);

export function EventsProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async (city, query) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEventsApi(city, query);
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <EventsContext.Provider value={{ events, loading, error, fetchEvents }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEventsContext() {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error("useEventsContext must be used within an EventsProvider");
  }
  return context;
}
