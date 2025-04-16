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
      id: "1",
      title: "Summer Music Festival",
      description: "A great music festival with top artists",
      date: "2025-07-15T18:00:00.000Z",
      duration: "3 days",
      location: "New York",
      address: "Central Park, New York, NY",
      organizer: "NYC Events Co.",
      categories: ["Music", "Arts"],
      image: "https://placehold.co/400x200",
    },
    {
      id: "2",
      title: "Tech Conference",
      description: "Learn about the latest technologies",
      date: "2025-05-20T09:00:00.000Z",
      duration: "2 days",
      location: "San Francisco",
      address: "Moscone Center, San Francisco, CA",
      organizer: "TechEvents Global",
      categories: ["Technology", "Business"],
      image: "https://placehold.co/400x200",
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

  // xtest("shows loading state initially", () => {
  //   render(
  //     <BrowserRouter>
  //       <ThemeProvider>
  //         <EventsProvider>
  //           <EventsPage />
  //         </EventsProvider>
  //       </ThemeProvider>
  //     </BrowserRouter>
  //   );

  //   // Check if loading indicator is shown
  //   expect(screen.getByRole("status")).toBeInTheDocument();
  // });

  // xtest("displays events after loading", async () => {
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
