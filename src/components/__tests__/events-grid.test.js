import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import EventsGrid from "../../components/events-grid";

describe("EventsGrid", () => {
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
    expect(screen.getByText("Musical night1")).toBeInTheDocument();
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
      screen.getByText(
        "Small Business Expo is America's Largest Business to Business Trade Show."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("Join the biggest tech conference of the year.")
    ).toBeInTheDocument();

    // Check if cities are rendered
    expect(screen.getAllByText("pune")[0]).toBeInTheDocument();
    expect(screen.getAllByText("mumbai")[0]).toBeInTheDocument();
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
    expect(images[0]).toHaveAttribute("alt", "Musical night1");
    expect(images[1]).toHaveAttribute("alt", "Tech Conference");
  });

  test("renders price information", () => {
    render(
      <BrowserRouter>
        <EventsGrid events={mockEvents} />
      </BrowserRouter>
    );

    // Check if prices are rendered
    expect(screen.getByText("$100")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();
    expect(screen.getByText("$200")).toBeInTheDocument();
    expect(screen.getByText("250")).toBeInTheDocument();
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
