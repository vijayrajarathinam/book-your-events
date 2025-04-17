import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import EventsPage from "../../pages/EventsPage";
import { ThemeProvider } from "../../context/theme-provider";
// import { jest, beforeEach, describe, test, xtest, expect } from "@jest/globals";

// Mock the components that are used in EventsPage
jest.mock("../../components/header", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mock-header">Header</div>,
  };
});

jest.mock("../../components/events-filter", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mock-events-filter">Events Filter</div>,
  };
});

jest.mock("../../components/events-grid", () => {
  return {
    __esModule: true,
    default: ({ events }) => (
      <div data-testid="mock-events-grid">
        Events Grid: {events.length} events
      </div>
    ),
  };
});

jest.mock("../../components/events-list", () => {
  return {
    __esModule: true,
    default: ({ events }) => (
      <div data-testid="mock-events-list">
        Events List: {events.length} events
      </div>
    ),
  };
});

// Create mock store
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("EventsPage with Redux", () => {
  let store;

  const mockEvents = [
    {
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
    },
    {
      id: 2,
      type: "CREATED",
      owner_id: "123663",
      city: "mumbai",
      payload: {
        event_date: "30-07-2022",
        event_time: "16:00",
        image: "https://example.com/image2.jpg",
        items: [
          {
            event_id: "4378844",
            event_name: "Tech Conference",
            event_title: "TECH INNOVATION SUMMIT",
            event_description: "Join the biggest tech conference of the year.",
            location: {
              loc_address: {
                name: "abc xyz",
                address_1: "abc xyz",
                address_2: "abc xyz",
                city_name: "abc xyz",
                state_id: 62,
                state_short_name: "abc xyz",
                postal_code: "abc xyz",
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
            sell_price: "$200",
            orig_price: "250",
          },
        ],
      },
      published_at: "30-07-2022",
    },
  ];

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

  test("renders the page with all components", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider>
            <EventsPage />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );

    // Check if header and filter components are rendered
    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(screen.getByTestId("mock-events-filter")).toBeInTheDocument();

    // Check if the page title is rendered
    expect(screen.getByText("Events")).toBeInTheDocument();
    expect(
      screen.getByText("Discover amazing events happening near you")
    ).toBeInTheDocument();

    // Verify that fetchEvents action was dispatched
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function));
  });

  test("shows loading state initially", () => {
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
            <EventsPage />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );

    // Check if loading indicator is shown
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  xtest("displays events after loading", () => {
    // Update store with events data
    store = mockStore({
      events: {
        events: mockEvents,
        selectedEvent: null,
        loading: false,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider>
            <EventsPage />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );

    // Check if events grid and list are rendered with the correct number of events
    expect(screen.getByTestId("mock-events-grid")).toHaveTextContent(
      "Events Grid: 2 events"
    );
    expect(screen.getByTestId("mock-events-list")).toHaveTextContent(
      "Events List: 2 events"
    );
  });

  test("handles API error", () => {
    // Update store to show error state
    store = mockStore({
      events: {
        events: [],
        selectedEvent: null,
        loading: false,
        error: "Failed to load events",
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider>
            <EventsPage />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );

    // Check if error message is displayed
    expect(screen.getByText("Failed to load events")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /try again/i })
    ).toBeInTheDocument();
  });
});
