import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FormInput from "../ui/FormInput";
import FormTextarea from "../ui/FormTextarea";

describe("FormInput", () => {
  const onChange = jest.fn();
  const styles = {
    "field-group": "group",
    inputWrapper: "wrapper",
    input: "input-class",
    inputWithIcon: "input-icon-class",
    inputIcon: "icon-class",
  };
  const MockIcon = () => <div data-testid="mock-icon" />;

  it("renders with label, placeholder, and handles change", () => {
    render(
      <FormInput
        label="Test Input"
        name="test"
        value="hello"
        onChange={onChange}
        placeholder="Enter text"
        styles={styles}
      />
    );

    expect(screen.getByLabelText("Test Input")).toBeInTheDocument();
    const input = screen.getByPlaceholderText("Enter text");
    expect(input.value).toBe("hello");

    fireEvent.change(input, { target: { value: "world" } });
    expect(onChange).toHaveBeenCalled();
  });

  it("renders as required and with an icon", () => {
    render(
      <FormInput
        label="Required Input"
        name="test-req"
        value=""
        onChange={onChange}
        required={true}
        icon={MockIcon}
        styles={styles}
      />
    );

    expect(screen.getByText("Required Input *")).toBeInTheDocument();
    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
    const input = screen.getByLabelText("Required Input *");
    expect(input).toHaveAttribute("required");
    expect(input).toHaveClass("input-icon-class");
  });
});

describe("FormTextarea", () => {
  const onChange = jest.fn();
  const styles = {
    "field-group": "group",
    inputWrapper: "wrapper",
    textarea: "textarea-class",
    textareaWithIcon: "textarea-icon-class",
    inputIcon: "icon-class",
  };
  const MockIcon = () => <div data-testid="mock-icon" />;

  it("renders with default rows and handles change", () => {
    render(
      <FormTextarea
        label="Test Textarea"
        name="test"
        value="hello"
        onChange={onChange}
        placeholder="Enter long text"
        styles={styles}
      />
    );

    const textarea = screen.getByPlaceholderText("Enter long text");
    expect(textarea.value).toBe("hello");
    expect(textarea).toHaveAttribute("rows", "5");

    fireEvent.change(textarea, { target: { value: "world" } });
    expect(onChange).toHaveBeenCalled();
  });

  it("renders as required, with custom rows and icon", () => {
    render(
      <FormTextarea
        label="Required Textarea"
        name="test-req"
        value=""
        onChange={onChange}
        required={true}
        rows={10}
        icon={MockIcon}
        styles={styles}
      />
    );

    expect(screen.getByText("Required Textarea *")).toBeInTheDocument();
    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
    const textarea = screen.getByLabelText("Required Textarea *");
    expect(textarea).toHaveAttribute("required");
    expect(textarea).toHaveAttribute("rows", "10");
    expect(textarea).toHaveClass("textarea-icon-class");
  });
});
