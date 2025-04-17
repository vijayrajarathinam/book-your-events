import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchEvents as fetchEventsApi,
  fetchEventById as fetchEventByIdApi,
} from "../../services/api";

const initialState = {
  events: [],
  selectedEvent: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async ({ city, query }, { rejectWithValue }) => {
    try {
      return await fetchEventsApi(city, query);
    } catch {
      return rejectWithValue("Failed to load events. Please try again.");
    }
  }
);

export const fetchEventById = createAsyncThunk(
  "events/fetchEventById",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchEventByIdApi(id);
    } catch {
      return rejectWithValue("Failed to load event details.");
    }
  }
);

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload;
        state.loading = false;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch event by ID
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.selectedEvent = action.payload;
        state.loading = false;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedEvent } = eventsSlice.actions;

export default eventsSlice.reducer;
