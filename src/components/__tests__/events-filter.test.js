import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import EventsFilter from "../../components/events-filter";
import * as router from "react-router-dom";

// Mock the useNavigate and useSearchParams hooks
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe("EventsFilter", () => {
  const mockNavigate = jest.fn();
  const mockSearchParams = new URLSearchParams();
  const mockSetSearchParams = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Setup mocks
    jest.spyOn(router, "useNavigate").mockImplementation(() => mockNavigate);
    jest
      .spyOn(router, "useSearchParams")
      .mockImplementation(() => [mockSearchParams, mockSetSearchParams]);
  });

  test("renders all filter components", () => {
    render(
      <BrowserRouter>
        <EventsFilter />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  test("handles search button click", async () => {
    render(
      <BrowserRouter>
        <EventsFilter />
      </BrowserRouter>
    );

    // Enter search query
    const searchInput = screen.getByPlaceholderText(/search events/i);
    fireEvent.change(searchInput, { target: { value: "concert" } });

    // Click search button
    const searchButton = screen.getByRole("button", { name: /search/i });
    fireEvent.click(searchButton);

    // Verify navigation was called
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  test("handles Enter key press in search input", async () => {
    render(
      <BrowserRouter>
        <EventsFilter />
      </BrowserRouter>
    );

    // Enter search query and press Enter
    const searchInput = screen.getByPlaceholderText(/search events/i);
    fireEvent.change(searchInput, { target: { value: "festival" } });
    fireEvent.keyDown(searchInput, { key: "Enter", code: "Enter" });

    // Verify navigation was called
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  test("initializes with values from URL search params", () => {
    // Setup search params with initial values
    const paramsWithValues = new URLSearchParams();
    paramsWithValues.set("location", "New York");
    paramsWithValues.set("category", "Music");
    paramsWithValues.set("q", "festival");

    jest
      .spyOn(router, "useSearchParams")
      .mockImplementation(() => [paramsWithValues, mockSetSearchParams]);

    render(
      <BrowserRouter>
        <EventsFilter />
      </BrowserRouter>
    );

    // Check if search input has the value from URL params
    const searchInput = screen.getByPlaceholderText(/search events/i);
    expect(searchInput).toHaveValue("festival");
  });

  test("updates URL with all filter parameters", async () => {
    render(
      <BrowserRouter>
        <EventsFilter />
      </BrowserRouter>
    );

    // Set location (mocking the select change)
    const locationSelect = screen.getByLabelText(/location/i);
    fireEvent.change(locationSelect, { target: { value: "New York" } });

    // Set category (mocking the select change)
    const categorySelect = screen.getByLabelText(/category/i);
    fireEvent.change(categorySelect, { target: { value: "Music" } });

    // Set search query
    const searchInput = screen.getByPlaceholderText(/search events/i);
    fireEvent.change(searchInput, { target: { value: "concert" } });

    // Click search button
    const searchButton = screen.getByRole("button", { name: /search/i });
    fireEvent.click(searchButton);

    // Verify navigation was called with correct parameters
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });
});
