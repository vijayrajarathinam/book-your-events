import * as api from "../../services/api";

// Mock the global fetch function
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("API Service", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Default mock implementation for fetch
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
  });

  describe("fetchEvents", () => {
    test("fetches events with no filters", async () => {
      const mockEvents = [{ id: 1 }, { id: 2 }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      });

      const result = await api.fetchEvents();

      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3002/events");
      expect(result).toEqual(mockEvents);
    });

    test("fetches events with city filter", async () => {
      const mockEvents = [{ id: 1 }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      });

      const result = await api.fetchEvents("pune");

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3002/events?city=pune"
      );
      expect(result).toEqual(mockEvents);
    });

    test("fetches events with query filter", async () => {
      const mockEvents = [{ id: 1 }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      });

      const result = await api.fetchEvents(undefined, "concert");

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3002/events?&q=concert"
      );
      expect(result).toEqual(mockEvents);
    });

    test("fetches events with both city and query filters", async () => {
      const mockEvents = [{ id: 1 }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      });

      const result = await api.fetchEvents("pune", "concert");

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3002/events?city=pune&q=concert"
      );
      expect(result).toEqual(mockEvents);
    });

    test("handles fetch error", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(api.fetchEvents()).rejects.toThrow("Network error");
    });

    test("handles API error response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(api.fetchEvents()).rejects.toThrow(
        "HTTP error! Status: 500"
      );
    });
  });

  describe("fetchEventById", () => {
    test("fetches a single event by ID", async () => {
      const mockEvent = { id: "1", name: "Test Event" };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvent,
      });

      const result = await api.fetchEventById("1");

      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3002/events/1");
      expect(result).toEqual(mockEvent);
    });

    test("handles fetch error", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(api.fetchEventById("1")).rejects.toThrow("Network error");
    });

    test("handles API error response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(api.fetchEventById("1")).rejects.toThrow(
        "HTTP error! Status: 404"
      );
    });
  });

  describe("addEvent", () => {
    test("adds a new event", async () => {
      const newEvent = {
        id: 1,
        type: "CREATED",
        city: "pune",
        payload: {
          event_date: "30-07-2022",
          event_time: "15:00",
          image: "https://example.com/image.jpg",
          items: [],
        },
      };

      const createdEvent = { ...newEvent, id: 1 };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createdEvent,
      });

      const result = await api.addEvent(newEvent);

      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3002/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });
      expect(result).toEqual(createdEvent);
    });

    test("handles fetch error", async () => {
      const newEvent = {
        id: 1,
        type: "CREATED",
        city: "pune",
        payload: {
          event_date: "30-07-2022",
          event_time: "15:00",
          image: "https://example.com/image.jpg",
          items: [],
        },
      };

      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(api.addEvent(newEvent)).rejects.toThrow("Network error");
    });

    test("handles API error response", async () => {
      const newEvent = {
        id: 1,
        type: "CREATED",
        city: "pune",
        payload: {
          event_date: "30-07-2022",
          event_time: "15:00",
          image: "https://example.com/image.jpg",
          items: [],
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      await expect(api.addEvent(newEvent)).rejects.toThrow(
        "HTTP error! Status: 400"
      );
    });
  });

  describe("updateEvent", () => {
    test("updates an existing event", async () => {
      const eventUpdate = {
        city: "mumbai",
        payload: {
          event_date: "31-07-2022",
          event_time: "16:00",
          image: "https://example.com/updated-image.jpg",
          items: [],
        },
      };

      const updatedEvent = { id: "1", ...eventUpdate };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => updatedEvent,
      });

      const result = await api.updateEvent("1", eventUpdate);

      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3002/events/1", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventUpdate),
      });
      expect(result).toEqual(updatedEvent);
    });

    test("handles fetch error", async () => {
      const eventUpdate = {
        city: "mumbai",
        payload: {
          event_date: "31-07-2022",
          event_time: "16:00",
          image: "https://example.com/updated-image.jpg",
          items: [],
        },
      };

      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(api.updateEvent("1", eventUpdate)).rejects.toThrow(
        "Network error"
      );
    });

    test("handles API error response", async () => {
      const eventUpdate = {
        city: "mumbai",
        payload: {
          event_date: "31-07-2022",
          event_time: "16:00",
          image: "https://example.com/updated-image.jpg",
          items: [],
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(api.updateEvent("1", eventUpdate)).rejects.toThrow(
        "HTTP error! Status: 404"
      );
    });
  });

  describe("deleteEvent", () => {
    test("deletes an event", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      });

      await api.deleteEvent("1");

      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3002/events/1", {
        method: "DELETE",
      });
    });

    test("handles fetch error", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(api.deleteEvent("1")).rejects.toThrow("Network error");
    });

    test("handles API error response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(api.deleteEvent("1")).rejects.toThrow(
        "HTTP error! Status: 404"
      );
    });
  });
});
