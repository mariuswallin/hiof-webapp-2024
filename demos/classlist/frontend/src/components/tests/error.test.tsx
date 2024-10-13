import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorMessage from "../ErrorMessage";
import "@testing-library/jest-dom";

describe("ErrorMessage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders error messages", () => {
    const errors = ["Error 1", "Error 2"];
    const onClose = vi.fn();

    render(<ErrorMessage errors={errors} onClose={onClose} />);
    for (const error of errors) {
      expect(screen.getByText(error)).toBeInTheDocument();
    }
  });

  it("does not render when there are no errors", () => {
    const onClose = vi.fn();

    const { container } = render(
      <ErrorMessage errors={[]} onClose={onClose} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("calls onClose after 6 seconds", async () => {
    const errors = ["Error 1"];
    const onClose = vi.fn();
    render(<ErrorMessage errors={errors} onClose={onClose} />);
    expect(onClose).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(6000);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("clears timeout on unmount", async () => {
    const errors = ["Error 1"];
    const onClose = vi.fn();

    const { unmount } = render(
      <ErrorMessage errors={errors} onClose={onClose} />
    );

    unmount();
    await vi.advanceTimersByTimeAsync(6000);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("renders multiple errors with correct positioning and z-index", () => {
    const errors = ["Error 1", "Error 2", "Error 3"];
    const onClose = vi.fn();

    render(<ErrorMessage errors={errors} onClose={onClose} />);

    for (const [index, error] of errors.entries()) {
      const errorElement = screen.getByText(error);
      expect(errorElement).toBeInTheDocument();

      const aside = errorElement.closest("aside");
      expect(aside).not.toBeNull();

      if (aside) {
        expect(aside).toHaveStyle({
          bottom: `${10 + 10 * (errors.length - index)}px`,
          right: `${10 + 10 * (errors.length - index)}px`,
          zIndex: String(errors.length - index),
        });
      }
    }
  });
});
