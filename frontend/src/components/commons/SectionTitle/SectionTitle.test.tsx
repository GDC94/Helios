import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SectionTitle from "./SectionTitle";

describe("SectionTitle", () => {
  it("renders with the provided text", () => {
    render(<SectionTitle>Global Metrics</SectionTitle>);

    expect(screen.getByText("Global Metrics")).toBeInTheDocument();
  });

  it("renders as an h2 element", () => {
    render(<SectionTitle>Test Title</SectionTitle>);

    const titleElement = screen.getByRole("heading", { level: 2 });
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent("Test Title");
  });

  it("applies the correct default styling", () => {
    render(<SectionTitle>Test Title</SectionTitle>);

    const titleElement = screen.getByText("Test Title");
    expect(titleElement).toHaveClass(
      "text-[15px]",
      "pl-[1px]",
      "font-custom600",
      "leading-[15px]",
      "text-sectionTitle",
      "mb-2"
    );
  });

  it("applies custom className when provided", () => {
    render(<SectionTitle className="custom-class">Test Title</SectionTitle>);

    const titleElement = screen.getByText("Test Title");
    expect(titleElement).toHaveClass("custom-class");
  });

  it("maintains base classes when custom className is provided", () => {
    render(<SectionTitle className="custom-class">Test Title</SectionTitle>);

    const titleElement = screen.getByText("Test Title");
    expect(titleElement).toHaveClass(
      "text-[15px]",
      "pl-[1px]",
      "font-custom600",
      "leading-[15px]",
      "text-sectionTitle",
      "mb-2",
      "custom-class"
    );
  });

  it("renders different title texts correctly", () => {
    const { rerender } = render(<SectionTitle>Global Metrics</SectionTitle>);
    expect(screen.getByText("Global Metrics")).toBeInTheDocument();

    rerender(<SectionTitle>Annualized Returns</SectionTitle>);
    expect(screen.getByText("Annualized Returns")).toBeInTheDocument();

    rerender(<SectionTitle>Performance</SectionTitle>);
    expect(screen.getByText("Performance")).toBeInTheDocument();
  });
});
