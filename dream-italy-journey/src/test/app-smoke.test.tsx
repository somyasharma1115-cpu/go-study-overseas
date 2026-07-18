import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import App from "@/App";

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe("App smoke test", () => {
  it("renders the homepage heading", async () => {
    window.scrollTo = () => undefined;
    Object.defineProperty(window, "IntersectionObserver", {
      writable: true,
      value: IntersectionObserverMock,
    });
    Object.defineProperty(globalThis, "IntersectionObserver", {
      writable: true,
      value: IntersectionObserverMock,
    });
    Object.defineProperty(window, "ResizeObserver", {
      writable: true,
      value: ResizeObserverMock,
    });
    Object.defineProperty(globalThis, "ResizeObserver", {
      writable: true,
      value: ResizeObserverMock,
    });

    render(<App />);
    expect(await screen.findByText(/Study abroad with top scholarships/i)).toBeInTheDocument();
  });
});
