import { configureStore } from "@reduxjs/toolkit";
import eventsReducer, {
  fetchEvents,
  fetchEventById,
  clearSelectedEvent,
  initialState,
} from "../../../store/slices/eventsSlice";
import * as api from "../../../services/api";

// Mock the API
jest.mock("../../../services/api");

describe("eventsSlice", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        events: eventsReducer,
      },
    });
    jest.clearAllMocks();
  });

  test("should return the initial state", () => {
    expect(eventsReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  test("should handle initial state", () => {
    expect(store.getState().events).toEqual({
      events: [],
      selectedEvent: null,
      loading: false,
      error: null,
    });
  });

  describe("action creators", () => {
    test("clearSelectedEvent should clear the selected event", () => {
      // First set a selected event
      store.dispatch({
        type: fetchEventById.fulfilled.type,
        payload: { id: 1, name: "Test Event" },
      });

      // Then clear it
      store.dispatch(clearSelectedEvent());

      expect(store.getState().events.selectedEvent).toBeNull();
    });
  });

  describe("fetchEvents thunk", () => {
    test("should handle fetchEvents.pending", () => {
      store.dispatch({ type: fetchEvents.pending.type });
      expect(store.getState().events.loading).toBe(true);
      expect(store.getState().events.error).toBe(null);
    });

    test("should handle fetchEvents.fulfilled", () => {
      const mockEvents = [
        {
          id: 1,
          type: "CREATED",
          owner_id: "123663",
          city: "pune",
          payload: {
            event_date: "30-07-2022",
            event_time: "15:00",
            image: "https://example.com/image.jpg",
            items: [
              {
                event_id: "4378843",
                event_name: "Test Event",
                event_title: "Test Title",
                event_description: "Test Description",
                location: {
                  loc_address: {
                    name: "Test Name",
                    address_1: "Test Address 1",
                    address_2: "Test Address 2",
                    city_name: "Test City",
                    state_id: 1,
                    state_short_name: "TS",
                    postal_code: "123456",
                    phone_number: "1234567890",
                    country_name: "Test Country",
                    country_code: 1,
                    is_commercial: true,
                    company_name: "Test Company",
                  },
                  loc_geometry: {
                    type: "Point",
                    coordinates: [0, 0],
                  },
                },
                sell_price: "$100",
                orig_price: "$150",
              },
            ],
          },
          published_at: "30-07-2022",
        },
      ];

      store.dispatch({ type: fetchEvents.fulfilled.type, payload: mockEvents });
      expect(store.getState().events.events).toEqual(mockEvents);
      expect(store.getState().events.loading).toBe(false);
      expect(store.getState().events.error).toBe(null);
    });

    test("should handle fetchEvents.rejected", () => {
      const errorMessage = "Failed to load events";
      store.dispatch({
        type: fetchEvents.rejected.type,
        payload: errorMessage,
        error: { message: errorMessage },
      });
      expect(store.getState().events.loading).toBe(false);
      expect(store.getState().events.error).toBe(errorMessage);
    });

    test("should fetch events with thunk", async () => {
      const mockEvents = [
        {
          id: 1,
          type: "CREATED",
          owner_id: "123663",
          city: "pune",
          payload: {
            event_date: "30-07-2022",
            event_time: "15:00",
            image: "https://example.com/image.jpg",
            items: [
              {
                event_id: "4378843",
                event_name: "Test Event",
                event_title: "Test Title",
                event_description: "Test Description",
                location: {
                  loc_address: {
                    name: "Test Name",
                    address_1: "Test Address 1",
                    address_2: "Test Address 2",
                    city_name: "Test City",
                    state_id: 1,
                    state_short_name: "TS",
                    postal_code: "123456",
                    phone_number: "1234567890",
                    country_name: "Test Country",
                    country_code: 1,
                    is_commercial: true,
                    company_name: "Test Company",
                  },
                  loc_geometry: {
                    type: "Point",
                    coordinates: [0, 0],
                  },
                },
                sell_price: "$100",
                orig_price: "$150",
              },
            ],
          },
          published_at: "30-07-2022",
        },
      ];

      // Mock the API call
      jest.spyOn(api, "fetchEvents").mockResolvedValue(mockEvents);

      // Dispatch the thunk
      await store.dispatch(fetchEvents({ city: "pune", query: "test" }));

      // Check if the API was called with the correct parameters
      expect(api.fetchEvents).toHaveBeenCalledWith("pune", "test");

      // Check if the state was updated correctly
      expect(store.getState().events.events).toEqual(mockEvents);
      expect(store.getState().events.loading).toBe(false);
      expect(store.getState().events.error).toBe(null);
    });

    test("should handle API errors in fetchEvents thunk", async () => {
      // Mock the API call to throw an error
      jest.spyOn(api, "fetchEvents").mockRejectedValue(new Error("API error"));

      // Dispatch the thunk
      await store.dispatch(fetchEvents({}));

      // Check if the state was updated correctly
      expect(store.getState().events.loading).toBe(false);
      expect(store.getState().events.error).toBe(
        "Failed to load events. Please try again."
      );
    });

    test("should handle empty parameters", async () => {
      const mockEvents = [];
      jest.spyOn(api, "fetchEvents").mockResolvedValue(mockEvents);

      await store.dispatch(fetchEvents({}));

      expect(api.fetchEvents).toHaveBeenCalledWith(undefined, undefined);
      expect(store.getState().events.events).toEqual(mockEvents);
    });
  });

  describe("fetchEventById thunk", () => {
    test("should handle fetchEventById.pending", () => {
      store.dispatch({ type: fetchEventById.pending.type });
      expect(store.getState().events.loading).toBe(true);
      expect(store.getState().events.error).toBe(null);
    });

    test("should handle fetchEventById.fulfilled", () => {
      const mockEvent = {
        id: 1,
        type: "CREATED",
        owner_id: "123663",
        city: "pune",
        payload: {
          event_date: "30-07-2022",
          event_time: "15:00",
          image: "https://example.com/image.jpg",
          items: [
            {
              event_id: "4378843",
              event_name: "Test Event",
              event_title: "Test Title",
              event_description: "Test Description",
              location: {
                loc_address: {
                  name: "Test Name",
                  address_1: "Test Address 1",
                  address_2: "Test Address 2",
                  city_name: "Test City",
                  state_id: 1,
                  state_short_name: "TS",
                  postal_code: "123456",
                  phone_number: "1234567890",
                  country_name: "Test Country",
                  country_code: 1,
                  is_commercial: true,
                  company_name: "Test Company",
                },
                loc_geometry: {
                  type: "Point",
                  coordinates: [0, 0],
                },
              },
              sell_price: "$100",
              orig_price: "$150",
            },
          ],
        },
        published_at: "30-07-2022",
      };

      store.dispatch({
        type: fetchEventById.fulfilled.type,
        payload: mockEvent,
      });
      expect(store.getState().events.selectedEvent).toEqual(mockEvent);
      expect(store.getState().events.loading).toBe(false);
      expect(store.getState().events.error).toBe(null);
    });

    test("should handle fetchEventById.rejected", () => {
      const errorMessage = "Failed to load event details";
      store.dispatch({
        type: fetchEventById.rejected.type,
        payload: errorMessage,
        error: { message: errorMessage },
      });
      expect(store.getState().events.loading).toBe(false);
      expect(store.getState().events.error).toBe(errorMessage);
    });

    test("should fetch event by ID with thunk", async () => {
      const mockEvent = {
        id: 1,
        type: "CREATED",
        owner_id: "123663",
        city: "pune",
        payload: {
          event_date: "30-07-2022",
          event_time: "15:00",
          image: "https://example.com/image.jpg",
          items: [
            {
              event_id: "4378843",
              event_name: "Test Event",
              event_title: "Test Title",
              event_description: "Test Description",
              location: {
                loc_address: {
                  name: "Test Name",
                  address_1: "Test Address 1",
                  address_2: "Test Address 2",
                  city_name: "Test City",
                  state_id: 1,
                  state_short_name: "TS",
                  postal_code: "123456",
                  phone_number: "1234567890",
                  country_name: "Test Country",
                  country_code: 1,
                  is_commercial: true,
                  company_name: "Test Company",
                },
                loc_geometry: {
                  type: "Point",
                  coordinates: [0, 0],
                },
              },
              sell_price: "$100",
              orig_price: "$150",
            },
          ],
        },
        published_at: "30-07-2022",
      };

      // Mock the API call
      jest.spyOn(api, "fetchEventById").mockResolvedValue(mockEvent);

      // Dispatch the thunk
      await store.dispatch(fetchEventById("1"));

      // Check if the API was called with the correct parameters
      expect(api.fetchEventById).toHaveBeenCalledWith("1");

      // Check if the state was updated correctly
      expect(store.getState().events.selectedEvent).toEqual(mockEvent);
      expect(store.getState().events.loading).toBe(false);
      expect(store.getState().events.error).toBe(null);
    });

    test("should handle API errors in fetchEventById thunk", async () => {
      // Mock the API call to throw an error
      jest
        .spyOn(api, "fetchEventById")
        .mockRejectedValue(new Error("API error"));

      // Dispatch the thunk
      await store.dispatch(fetchEventById("1"));

      // Check if the state was updated correctly
      expect(store.getState().events.loading).toBe(false);
      expect(store.getState().events.error).toBe(
        "Failed to load event details."
      );
    });
  });

  describe("state transitions", () => {
    test("should transition from loading to success state", () => {
      // Start with loading state
      store.dispatch({ type: fetchEvents.pending.type });
      expect(store.getState().events.loading).toBe(true);

      // Transition to success state
      store.dispatch({
        type: fetchEvents.fulfilled.type,
        payload: [{ id: 1, name: "Test Event" }],
      });

      expect(store.getState().events.loading).toBe(false);
      expect(store.getState().events.error).toBe(null);
      expect(store.getState().events.events).toHaveLength(1);
    });

    test("should transition from loading to error state", () => {
      // Start with loading state
      store.dispatch({ type: fetchEvents.pending.type });
      expect(store.getState().events.loading).toBe(true);

      // Transition to error state
      store.dispatch({
        type: fetchEvents.rejected.type,
        payload: "Failed to load events",
        error: { message: "Failed to load events" },
      });

      expect(store.getState().events.loading).toBe(false);
      expect(store.getState().events.error).toBe("Failed to load events");
      expect(store.getState().events.events).toHaveLength(0);
    });

    test("should clear error when starting a new request", () => {
      // Set error state
      store.dispatch({
        type: fetchEvents.rejected.type,
        payload: "Failed to load events",
        error: { message: "Failed to load events" },
      });

      expect(store.getState().events.error).toBe("Failed to load events");

      // Start new request
      store.dispatch({ type: fetchEvents.pending.type });

      expect(store.getState().events.loading).toBe(true);
      expect(store.getState().events.error).toBe(null);
    });
  });
});
