import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EventDetailPage from "../../pages/EventDetailPage";
import * as api from "../../services/api";

// Mock the API
jest.mock("../../services/api");

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

describe("EventDetailPage", () => {
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
    jest.clearAllMocks();
    // Mock the fetchEventById API call
    jest.spyOn(api, "fetchEventById").mockResolvedValue(mockEvent);
  });

  //   test("renders loading state initially", () => {
  //     render(
  //       <BrowserRouter>
  //         <Routes>
  //           <Route path="*" element={<EventDetailPage />} />
  //         </Routes>
  //       </BrowserRouter>
  //     );

  //     // Check if loading indicator is shown
  //     expect(screen.getByRole("status")).toBeInTheDocument();
  //   });

  //   test("displays event details after loading", async () => {
  //     render(
  //       <BrowserRouter>
  //         <Routes>
  //           <Route path="*" element={<EventDetailPage />} />
  //         </Routes>
  //       </BrowserRouter>
  //     );

  //     // Wait for the event to be loaded
  //     await waitFor(() => {
  //       expect(api.fetchEventById).toHaveBeenCalledWith("1");
  //     });

  //     // Check if event details are rendered
  //     await waitFor(() => {
  //       expect(screen.getByText("Musical night1")).toBeInTheDocument();
  //       expect(
  //         screen.getByText("IGNITE YOUR ENTREPRENEURIAL SPIRIT")
  //       ).toBeInTheDocument();
  //       expect(
  //         screen.getByText(
  //           "Small Business Expo is America's Largest Business to Business Trade Show."
  //         )
  //       ).toBeInTheDocument();
  //       expect(screen.getByText("$100")).toBeInTheDocument();
  //       expect(screen.getByText("150")).toBeInTheDocument();
  //       expect(screen.getByText("pune")).toBeInTheDocument();
  //     });
  //   });

  test("handles API error", async () => {
    // Mock API to throw an error
    jest
      .spyOn(api, "fetchEventById")
      .mockRejectedValue(new Error("Failed to fetch event"));

    render(
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<EventDetailPage />} />
        </Routes>
      </BrowserRouter>
    );

    // Wait for the error to be displayed
    await waitFor(() => {
      expect(
        screen.getByText("Failed to load event details")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /go to events/i })
      ).toBeInTheDocument();
    });
  });

  test("renders back button", async () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<EventDetailPage />} />
        </Routes>
      </BrowserRouter>
    );

    // Check if back button is rendered
    expect(
      screen.getByRole("button", { name: /back to events/i })
    ).toBeInTheDocument();
  });

  //   test("renders event not found when event is null", async () => {
  //     // Mock API to return null
  //     jest.spyOn(api, "fetchEventById").mockResolvedValue(null as any)

  //     render(
  //       <BrowserRouter>
  //         <Routes>
  //           <Route path="*" element={<EventDetailPage />} />
  //         </Routes>
  //       </BrowserRouter>,
  //     )

  //     // Wait for the not found message to be displayed
  //     await waitFor(() => {
  //       expect(screen.getByText("Event not found")).toBeInTheDocument()
  //       expect(screen.getByRole("button", { name: /go to events/i })).toBeInTheDocument()
  //     })
  //   })
});
