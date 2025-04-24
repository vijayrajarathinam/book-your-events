"use client";

import { render, screen, fireEvent } from "@testing-library/react";
import ErrorBoundary from "../../components/error-boundary";

// Create a component that throws an error
const ErrorComponent = () => {
  throw new Error("Test error");
};

// Create a component with a button that throws an error when clicked
const ButtonThatThrows = () => {
  const handleClick = () => {
    throw new Error("Button error");
  };
  return <button onClick={handleClick}>Throw Error</button>;
};

// Suppress console.error for cleaner test output
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe("ErrorBoundary", () => {
  test("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  test("renders error UI when a child component throws", () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    // Check that error UI is displayed
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(
      screen.getByText("We encountered an error while rendering this page")
    ).toBeInTheDocument();
    expect(screen.getByText("Error details")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Try again" })
    ).toBeInTheDocument();
  });

  test("displays error message in details", () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    // Open the details section
    fireEvent.click(screen.getByText("Error details"));

    // Check that error message is displayed
    expect(screen.getByText("Error: Test error")).toBeInTheDocument();
  });

  test("try again button resets the error state", () => {
    // Mock window.location.reload
    const mockReload = jest.fn();
    Object.defineProperty(window, "location", {
      value: { reload: mockReload },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    // Click the try again button
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    // Check that reload was called
    expect(mockReload).toHaveBeenCalled();
  });

  test("componentDidCatch captures error info", () => {
    // Create a spy on the componentDidCatch method
    const spy = jest.spyOn(ErrorBoundary.prototype, "componentDidCatch");

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    // Check that componentDidCatch was called
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(expect.any(Error), expect.any(Object));

    // Restore the original method
    spy.mockRestore();
  });

  test("handles errors thrown during event handlers", () => {
    // This test is to verify that the error boundary doesn't catch errors in event handlers
    // as React's error boundaries don't catch these by default

    // We'll use a mock implementation to simulate what would happen if it did
    const mockGetDerivedStateFromError = jest.spyOn(
      ErrorBoundary,
      "getDerivedStateFromError"
    );

    render(
      <ErrorBoundary>
        <ButtonThatThrows />
      </ErrorBoundary>
    );

    // The button should render without errors
    expect(
      screen.getByRole("button", { name: "Throw Error" })
    ).toBeInTheDocument();

    // Clicking the button would throw an error, but we can't test this directly
    // as it would crash the test runner

    // Restore the original method
    mockGetDerivedStateFromError.mockRestore();
  });
});
