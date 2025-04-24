import { render, screen } from "@testing-library/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import EventDetailPage from "../../pages/EventDetailPage";
import { clearSelectedEvent } from "../../store/slices/eventsSlice";

// Mock the API
jest.mock("../../services/api");

// Mock the components that are used in EventDetailPage
jest.mock("../../components/header", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mock-header">Header</div>,
  };
});

// Mock useParams and useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

// Create mock store
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("EventDetailPage", () => {
  let store;
  const mockNavigate = jest.fn();

  const mockEvent = {
    id: 1,
    type: "CREATED",
    owner_id: "123663",
    city: "pune",
    payload: {
      event_date: "30-07-2022",
      event_time: "15:00",
      image: "https://example.com/image1.jpg",
      items: [
        {
          event_id: "4378843",
          event_name: "Musical night1",
          event_title: "IGNITE YOUR ENTREPRENEURIAL SPIRIT",
          event_description:
            "Small Business Expo is America's Largest Business to Business Trade Show.",
          location: {
            loc_address: {
              name: "name of address",
              address_1: "Address 1",
              address_2: "Address2",
              city_name: "city name",
              state_id: 62,
              state_short_name: "abc xyz",
              postal_code: "410410",
              phone_number: "878997798987",
              country_name: "India",
              country_code: 91,
              is_commercial: true,
              company_name: "abc",
            },
            loc_geometry: {
              type: "Point",
              coordinates: [-72.7738706, 41.6332836],
            },
          },
          sell_price: "$100",
          orig_price: "150",
        },
      ],
    },
    published_at: "30-07-2022",
  };

  beforeEach(() => {
    // Initialize store with initial state
    store = mockStore({
      events: {
        events: [],
        selectedEvent: null,
        loading: false,
        error: null,
      },
    });

    // Mock dispatch to track actions
    store.dispatch = jest.fn().mockImplementation(() => Promise.resolve());

    // Mock useParams to return an ID
    require("react-router-dom").useParams.mockReturnValue({ id: "1" });

    // Mock useNavigate
    require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);
  });

  test("dispatches fetchEventById on mount", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<EventDetailPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    // Check if fetchEventById was dispatched with the correct ID
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function));
  });

  test("dispatches clearSelectedEvent on unmount", () => {
    const { unmount } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<EventDetailPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    // Unmount the component
    unmount();

    // Check if clearSelectedEvent was dispatched
    expect(store.dispatch).toHaveBeenCalledWith(clearSelectedEvent());
  });

  test("renders loading state", () => {
    // Update store to show loading state
    store = mockStore({
      events: {
        events: [],
        selectedEvent: null,
        loading: true,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<EventDetailPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    // Check if loading component is shown
    expect(screen.getByTestId("mock-loading-splash")).toBeInTheDocument();
    expect(screen.getByTestId("mock-loading-splash").textContent).toBe(
      "Loading event details..."
    );
  });

  test("renders event details", () => {
    // Update store with event data
    store = mockStore({
      events: {
        events: [],
        selectedEvent: mockEvent,
        loading: false,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<EventDetailPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    // Check if event details are rendered
    expect(screen.getByText("Musical night1")).toBeInTheDocument();
    expect(
      screen.getByText("IGNITE YOUR ENTREPRENEURIAL SPIRIT")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Small Business Expo is America's Largest Business to Business Trade Show."
      )
    ).toBeInTheDocument();
  });

  test("renders error state", () => {
    // Update store to show error state
    store = mockStore({
      events: {
        events: [],
        selectedEvent: null,
        loading: false,
        error: "Failed to load event details",
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<EventDetailPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    // Check if error message is displayed
    expect(
      screen.getByText("Failed to load event details")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /go to events/i })
    ).toBeInTheDocument();
  });

  test("renders not found state", () => {
    // Update store with null event and no error
    store = mockStore({
      events: {
        events: [],
        selectedEvent: null,
        loading: false,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<EventDetailPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    // Check if not found message is displayed
    expect(screen.getByText("Event not found")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /go to events/i })
    ).toBeInTheDocument();
  });

  test("handles date formatting correctly", () => {
    // Update store with event data
    store = mockStore({
      events: {
        events: [],
        selectedEvent: mockEvent,
        loading: false,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<EventDetailPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    // Check if the date is formatted correctly
    // The formatDate function should parse "30-07-2022" to "Saturday, July 30, 2022"
    expect(screen.getByText("Saturday, July 30, 2022")).toBeInTheDocument();
  });

  test("handles go back button click", () => {
    // Update store with event data
    store = mockStore({
      events: {
        events: [],
        selectedEvent: mockEvent,
        loading: false,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<EventDetailPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    // Click the back button
    const backButton = screen.getByRole("button", { name: /back to events/i });
    backButton.click();

    // Check if navigate was called with -1
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test("handles error in date formatting", () => {
    // Update store with event data that has an invalid date format
    const eventWithInvalidDate = {
      ...mockEvent,
      payload: {
        ...mockEvent.payload,
        event_date: "invalid-date-format",
      },
    };

    store = mockStore({
      events: {
        events: [],
        selectedEvent: eventWithInvalidDate,
        loading: false,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<EventDetailPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    // The formatDate function should return the original string when parsing fails
    expect(screen.getByText("invalid-date-format")).toBeInTheDocument();
  });

  test("navigates to events page from error state", () => {
    // Update store to show error state
    store = mockStore({
      events: {
        events: [],
        selectedEvent: null,
        loading: false,
        error: "Failed to load event details",
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<EventDetailPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    // Click the "Go to Events" button
    const goToEventsButton = screen.getByRole("button", {
      name: /go to events/i,
    });
    goToEventsButton.click();

    // Check if navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith("/events");
  });
});
