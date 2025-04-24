"use client";

import { render, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "../theme-provider";

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

// Mock document.documentElement
const originalClassList = document.documentElement.classList;
const mockClassList = {
  add: jest.fn(),
  remove: jest.fn(),
  contains: jest.fn(),
};

// Test component that uses the theme context
const TestComponent = () => {
  const { theme, colorTheme, setTheme, setColorTheme } = useTheme();
  return (
    <div data-testid="test-component">
      <div data-testid="theme">{theme}</div>
      <div data-testid="color-theme">{colorTheme}</div>
      <button data-testid="set-theme-light" onClick={() => setTheme("light")}>
        Set Light
      </button>
      <button data-testid="set-theme-dark" onClick={() => setTheme("dark")}>
        Set Dark
      </button>
      <button
        data-testid="set-color-blue"
        onClick={() => setColorTheme("blue")}
      >
        Set Blue
      </button>
      <button
        data-testid="set-color-green"
        onClick={() => setColorTheme("green")}
      >
        Set Green
      </button>
    </div>
  );
};

describe("ThemeProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(document.documentElement, "classList", {
      value: mockClassList,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(document.documentElement, "classList", {
      value: originalClassList,
      configurable: true,
    });
  });

  test("provides default theme values", () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(getByTestId("theme").textContent).toBe("system");
    expect(getByTestId("color-theme").textContent).toBe("blue");
  });

  test("allows changing theme", () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    act(() => {
      getByTestId("set-theme-light").click();
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "vite-ui-theme",
      "light"
    );
    expect(mockClassList.remove).toHaveBeenCalledWith("light", "dark");
    expect(mockClassList.add).toHaveBeenCalledWith("light");
  });

  test("allows changing color theme", () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    act(() => {
      getByTestId("set-color-green").click();
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "vite-ui-color-theme",
      "green"
    );
    expect(mockClassList.remove).toHaveBeenCalledWith(
      "theme-blue",
      "theme-green",
      "theme-purple",
      "theme-orange",
      "theme-pink",
      "theme-red"
    );
    expect(mockClassList.add).toHaveBeenCalledWith("theme-green");
  });

  test("loads theme from localStorage", () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === "vite-ui-theme") return "dark";
      if (key === "vite-ui-color-theme") return "purple";
      return null;
    });

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(getByTestId("theme").textContent).toBe("dark");
    expect(getByTestId("color-theme").textContent).toBe("purple");
  });

  test("handles system theme", () => {
    // Mock matchMedia
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { getByTestId } = render(
      <ThemeProvider defaultTheme="system">
        <TestComponent />
      </ThemeProvider>
    );

    expect(getByTestId("theme").textContent).toBe("system");
    expect(mockClassList.add).toHaveBeenCalledWith("dark");
  });

  test("throws error when useTheme is used outside ThemeProvider", () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useTheme must be used within a ThemeProvider");

    // Restore console.error
    console.error = originalError;
  });
});
