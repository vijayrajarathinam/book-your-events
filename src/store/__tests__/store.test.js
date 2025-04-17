import { store } from "../../store";

describe("Redux store", () => {
  test("should have the correct initial state", () => {
    const state = store.getState();

    expect(state).toHaveProperty("events");
    expect(state.events).toEqual({
      events: [],
      selectedEvent: null,
      loading: false,
      error: null,
    });
  });

  test("should have the correct reducer structure", () => {
    const reducerKeys = Object.keys(store.getState());

    expect(reducerKeys).toContain("events");
    expect(reducerKeys.length).toBe(1); // Only events reducer for now
  });
});
