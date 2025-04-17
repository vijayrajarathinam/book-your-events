import { render, screen } from "@testing-library/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import EventDetailPage from "../../pages/EventDetailPage";
import { ThemeProvider } from "../../context/theme-provider";
// import { jest, beforeEach, describe, test, xtest, expect } from "@jest/globals";

// Mock the components that are used in EventDetailPage
jest.mock("../../components/header", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mock-header">Header</div>,
  };
});

// Mock useParams
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "1" }),
  useNavigate: () => jest.fn(),
}));

// Create mock store
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("EventDetailPage with Redux", () => {
  let store;

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
  });

  xtest("renders loading state initially", () => {
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
          <ThemeProvider>
            <Routes>
              <Route path="*" element={<EventDetailPage />} />
            </Routes>
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );

    // Check if loading indicator is shown
    expect(screen.getByRole("status")).toBeInTheDocument();

    // Verify that fetchEventById action was dispatched
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function));
  });

  xtest("displays event details after loading", () => {
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
          <ThemeProvider>
            <Routes>
              <Route path="*" element={<EventDetailPage />} />
            </Routes>
          </ThemeProvider>
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
    expect(screen.getByText("$100")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();
    expect(screen.getByText("pune")).toBeInTheDocument();
  });

  test("handles API error", () => {
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
          <ThemeProvider>
            <Routes>
              <Route path="*" element={<EventDetailPage />} />
            </Routes>
          </ThemeProvider>
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

  test("renders back button", () => {
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
          <ThemeProvider>
            <Routes>
              <Route path="*" element={<EventDetailPage />} />
            </Routes>
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );

    // Check if back button is rendered
    expect(
      screen.getByRole("button", { name: /back to events/i })
    ).toBeInTheDocument();
  });

  test("renders event not found when event is null", () => {
    // Update store with null event
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
          <ThemeProvider>
            <Routes>
              <Route path="*" element={<EventDetailPage />} />
            </Routes>
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );

    // Check if not found message is displayed
    expect(screen.getByText("Event not found")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /go to events/i })
    ).toBeInTheDocument();
  });
});
