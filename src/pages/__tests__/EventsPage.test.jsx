import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import EventsPage from "../../pages/EventsPage";
import { EventsProvider } from "../../context/events-context";
import { ThemeProvider } from "../../context/theme-provider";
import * as api from "../../services/api";

// Mock the API
jest.mock("../../services/api");

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

describe("EventsPage", () => {
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
    jest.clearAllMocks();
    // Mock the fetchEvents API call
    jest.spyOn(api, "fetchEvents").mockResolvedValue(mockEvents);
  });

  test("renders the page with all components", async () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <EventsProvider>
            <EventsPage />
          </EventsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    // Check if header and filter components are rendered
    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(screen.getByTestId("mock-events-filter")).toBeInTheDocument();

    // Check if the page title is rendered
    expect(screen.getByText("Events")).toBeInTheDocument();
    expect(
      screen.getByText("Discover amazing events happening near you")
    ).toBeInTheDocument();

    // Wait for the events to be loaded
    await waitFor(() => {
      expect(api.fetchEvents).toHaveBeenCalled();
    });
  });

  test("shows loading state initially", () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <EventsProvider>
            <EventsPage />
          </EventsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    // Check if loading indicator is shown
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  // test("displays events after loading", async () => {
  //   render(
  //     <BrowserRouter>
  //       <ThemeProvider>
  //         <EventsProvider>
  //           <EventsPage />
  //         </EventsProvider>
  //       </ThemeProvider>
  //     </BrowserRouter>
  //   );

  //   // Wait for the events to be loaded
  //   await waitFor(() => {
  //     expect(api.fetchEvents).toHaveBeenCalled();
  //   });

  //   // Check if events grid and list are rendered with the correct number of events
  //   await waitFor(() => {
  //     expect(screen.getByTestId("mock-events-grid")).toHaveTextContent(
  //       "Events Grid: 2 events"
  //     );
  //     expect(screen.getByTestId("mock-events-list")).toHaveTextContent(
  //       "Events List: 2 events"
  //     );
  //   });
  // });

  test("handles API error", async () => {
    // Mock API to throw an error
    jest
      .spyOn(api, "fetchEvents")
      .mockRejectedValue(new Error("Failed to fetch events"));

    render(
      <BrowserRouter>
        <ThemeProvider>
          <EventsProvider>
            <EventsPage />
          </EventsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    // Wait for the error to be displayed
    await waitFor(() => {
      expect(screen.getByText("Failed to load events")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /try again/i })
      ).toBeInTheDocument();
    });
  });
});
