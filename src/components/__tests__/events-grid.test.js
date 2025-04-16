import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import EventsGrid from "../../components/events-grid";

describe("EventsGrid", () => {
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

  test("renders empty state when no events are provided", () => {
    render(
      <BrowserRouter>
        <EventsGrid events={[]} />
      </BrowserRouter>
    );

    expect(screen.getByText("No events found")).toBeInTheDocument();
    expect(screen.getByText("Try changing your filters")).toBeInTheDocument();
  });

  test("renders correct number of event cards", () => {
    render(
      <BrowserRouter>
        <EventsGrid events={mockEvents} />
      </BrowserRouter>
    );

    // Check if both event titles are rendered
    expect(screen.getByText("Summer Music Festival")).toBeInTheDocument();
    expect(screen.getByText("Tech Conference")).toBeInTheDocument();
  });

  test("renders event details correctly", () => {
    render(
      <BrowserRouter>
        <EventsGrid events={mockEvents} />
      </BrowserRouter>
    );

    // Check if descriptions are rendered
    expect(
      screen.getByText("A great music festival with top artists")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Learn about the latest technologies")
    ).toBeInTheDocument();

    // Check if locations are rendered
    expect(screen.getByText("New York")).toBeInTheDocument();
    expect(screen.getByText("San Francisco")).toBeInTheDocument();
  });

  test("renders event images", () => {
    render(
      <BrowserRouter>
        <EventsGrid events={mockEvents} />
      </BrowserRouter>
    );

    // Check if images are rendered with correct alt text
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute("alt", "Summer Music Festival");
    expect(images[1]).toHaveAttribute("alt", "Tech Conference");
  });

  test("renders event categories as badges", () => {
    render(
      <BrowserRouter>
        <EventsGrid events={mockEvents} />
      </BrowserRouter>
    );

    // Check if category badges are rendered
    expect(screen.getByText("Music")).toBeInTheDocument();
    expect(screen.getByText("Technology")).toBeInTheDocument();
  });

  test("links to the correct event detail pages", () => {
    render(
      <BrowserRouter>
        <EventsGrid events={mockEvents} />
      </BrowserRouter>
    );

    // Check if links have correct hrefs
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/events/1");
    expect(links[1]).toHaveAttribute("href", "/events/2");
  });
});
