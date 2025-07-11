import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MetricsCard from "./MetricsCard";

describe("MetricsCard", () => {
  it("renders with basic props for globalMetrics", () => {
    render(
      <MetricsCard
        title="Total Allocation"
        value="$2,533,557.32"
        type="globalMetrics"
      />
    );

    expect(screen.getByText("Total Allocation")).toBeInTheDocument();
    expect(screen.getByText("$2,533,557.32")).toBeInTheDocument();
  });

  it("renders globalMetrics with secondary value", () => {
    render(
      <MetricsCard
        title="Day Change"
        value="+$4,482.29"
        secondaryValue="(0.18%)"
        type="globalMetrics"
      />
    );

    expect(screen.getByText("Day Change")).toBeInTheDocument();
    expect(screen.getByText("+$4,482.29")).toBeInTheDocument();
    expect(screen.getByText("(0.18%)")).toBeInTheDocument();
  });

  it("applies correct styles for globalMetrics value", () => {
    render(
      <MetricsCard
        title="Total Allocation"
        value="$2,533,557.32"
        type="globalMetrics"
      />
    );

    const valueElement = screen.getByText("$2,533,557.32");
    expect(valueElement).toHaveClass("text-[#152935]", "font-[600]");
  });

  it("applies correct styles for annualizedReturns value", () => {
    render(
      <MetricsCard title="7-Day" value="7.382%" type="annualizedReturns" />
    );

    const valueElement = screen.getByText("7.382%");
    expect(valueElement).toHaveClass("text-[#5AD700]", "font-[600]");
  });

  it("applies green color to secondary value when value is positive in globalMetrics", () => {
    render(
      <MetricsCard
        title="Day Change"
        value="+$4,482.29"
        secondaryValue="(0.18%)"
        type="globalMetrics"
      />
    );

    const secondaryValueElement = screen.getByText("(0.18%)");
    expect(secondaryValueElement).toHaveClass("text-[#5AD700]", "font-medium");
  });

  it("applies default color to secondary value when value is not positive in globalMetrics", () => {
    render(
      <MetricsCard
        title="Day Change"
        value="-$1,234.56"
        secondaryValue="(-2.5%)"
        type="globalMetrics"
      />
    );

    const secondaryValueElement = screen.getByText("(-2.5%)");
    expect(secondaryValueElement).toHaveClass("text-[#152935]", "font-medium");
  });

  it("applies default color to secondary value when value has no sign in globalMetrics", () => {
    render(
      <MetricsCard
        title="Total Value"
        value="$1,234.56"
        secondaryValue="(neutral)"
        type="globalMetrics"
      />
    );

    const secondaryValueElement = screen.getByText("(neutral)");
    expect(secondaryValueElement).toHaveClass("text-[#152935]", "font-medium");
  });

  it("does not render secondary value for annualizedReturns type", () => {
    render(
      <MetricsCard
        title="All-Time"
        value="8.838%"
        secondaryValue="(should not render)"
        type="annualizedReturns"
      />
    );

    expect(screen.getByText("8.838%")).toBeInTheDocument();
    expect(screen.queryByText("(should not render)")).not.toBeInTheDocument();
  });

  it("does not render secondary value when not provided", () => {
    render(
      <MetricsCard
        title="Total Allocation"
        value="$2,533,557.32"
        type="globalMetrics"
      />
    );

    expect(screen.queryByText("(")).not.toBeInTheDocument();
  });

  it("applies custom className when provided", () => {
    const { container } = render(
      <MetricsCard
        title="Test Title"
        value="Test Value"
        type="globalMetrics"
        className="custom-class"
      />
    );

    const cardElement = container.querySelector(".custom-class");
    expect(cardElement).toBeInTheDocument();
  });

  it("applies correct background color and box shadow styles", () => {
    const { container } = render(
      <MetricsCard title="Test Title" value="Test Value" type="globalMetrics" />
    );

    const cardElement =
      container.querySelector("[data-testid]") || container.firstChild;
    expect(cardElement).toHaveClass("shadow-custom");
  });

  it("has correct text styling for title", () => {
    render(
      <MetricsCard title="Test Title" value="Test Value" type="globalMetrics" />
    );

    const titleElement = screen.getByText("Test Title");
    expect(titleElement).toHaveClass(
      "text-[#152935]",
      "font-normal",
      "text-[11px]"
    );
  });

  it("detects positive value automatically from + prefix", () => {
    render(
      <MetricsCard
        title="Positive Change"
        value="+$100.00"
        secondaryValue="(+5%)"
        type="globalMetrics"
      />
    );

    const secondaryValueElement = screen.getByText("(+5%)");
    expect(secondaryValueElement).toHaveClass("text-[#5AD700]", "font-medium");
  });
});
