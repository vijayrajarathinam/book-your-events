import { configureStore } from "@reduxjs/toolkit";
import eventsReducer, {
  fetchEvents,
  fetchEventById,
} from "../../store/slices/eventsSlice";
import * as api from "../../services/api";

// Mock the API
jest.mock("../../services/api");

describe("Redux Store Integration", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        events: eventsReducer,
      },
    });
    jest.clearAllMocks();
  });

  test("should handle a complete fetch events flow", async () => {
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

    // Initial state
    expect(store.getState().events.loading).toBe(false);
    expect(store.getState().events.events).toEqual([]);

    // Dispatch the thunk
    const fetchPromise = store.dispatch(fetchEvents({ city: "pune" }));

    // Loading state
    expect(store.getState().events.loading).toBe(true);

    // Wait for the thunk to complete
    await fetchPromise;

    // Success state
    expect(store.getState().events.loading).toBe(false);
    expect(store.getState().events.events).toEqual(mockEvents);
    expect(store.getState().events.error).toBe(null);
  });

  test("should handle a complete fetch event by ID flow", async () => {
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

    // Initial state
    expect(store.getState().events.loading).toBe(false);
    expect(store.getState().events.selectedEvent).toBe(null);

    // Dispatch the thunk
    const fetchPromise = store.dispatch(fetchEventById("1"));

    // Loading state
    expect(store.getState().events.loading).toBe(true);

    // Wait for the thunk to complete
    await fetchPromise;

    // Success state
    expect(store.getState().events.loading).toBe(false);
    expect(store.getState().events.selectedEvent).toEqual(mockEvent);
    expect(store.getState().events.error).toBe(null);
  });

  test("should handle error flows correctly", async () => {
    // Mock the API call to throw an error
    jest.spyOn(api, "fetchEvents").mockRejectedValue(new Error("API error"));

    // Initial state
    expect(store.getState().events.loading).toBe(false);
    expect(store.getState().events.error).toBe(null);

    // Dispatch the thunk
    const fetchPromise = store.dispatch(fetchEvents({}));

    // Loading state
    expect(store.getState().events.loading).toBe(true);

    // Wait for the thunk to complete
    await fetchPromise;

    // Error state
    expect(store.getState().events.loading).toBe(false);
    expect(store.getState().events.error).toBe(
      "Failed to load events. Please try again."
    );
  });

  test("should handle multiple sequential actions correctly", async () => {
    const mockEvents = [{ id: 1, name: "Test Event" }];
    const mockEvent = { id: 1, name: "Test Event Detail" };

    // Mock API calls
    jest.spyOn(api, "fetchEvents").mockResolvedValue(mockEvents);
    jest.spyOn(api, "fetchEventById").mockResolvedValue(mockEvent);

    // Fetch events
    await store.dispatch(fetchEvents({}));
    expect(store.getState().events.events).toEqual(mockEvents);

    // Fetch event by ID
    await store.dispatch(fetchEventById("1"));
    expect(store.getState().events.selectedEvent).toEqual(mockEvent);

    // Both should be in the store now
    expect(store.getState().events.events).toEqual(mockEvents);
    expect(store.getState().events.selectedEvent).toEqual(mockEvent);
  });
});
