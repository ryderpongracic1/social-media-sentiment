import { render, screen } from "@testing-library/react";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";

// Test wrapper component
const TestFormWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe("Form Components", () => {
  it("renders Form component correctly", () => {
    render(
      <TestFormWrapper>
        <Form data-testid="test-form">
          <div>Form content</div>
        </Form>
      </TestFormWrapper>
    );

    const form = screen.getByTestId("test-form");
    expect(form).toBeInTheDocument();
    expect(form.tagName).toBe("FORM");
  });

  it("renders FormItem with correct structure", () => {
    render(
      <TestFormWrapper>
        <FormItem data-testid="form-item">
          <div>Item content</div>
        </FormItem>
      </TestFormWrapper>
    );

    const formItem = screen.getByTestId("form-item");
    expect(formItem).toBeInTheDocument();
    expect(formItem).toHaveClass("space-y-2");
  });

  it("renders FormField with Controller", () => {
    const TestComponent = () => {
      const methods = useForm({ defaultValues: { test: "" } });
      return (
        <FormProvider {...methods}>
          <FormField
            control={methods.control}
            name="test"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Label</FormLabel>
                <FormControl>
                  <input {...field} data-testid="test-input" />
                </FormControl>
              </FormItem>
            )}
          />
        </FormProvider>
      );
    };

    render(<TestComponent />);

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByTestId("test-input")).toBeInTheDocument();
  });

  it("displays form validation errors", () => {
    const TestComponent = () => {
      const methods = useForm({
        defaultValues: { test: "" },
        mode: "onChange",
      });

      // Simulate an error
      React.useEffect(() => {
        methods.setError("test", { message: "This field is required" });
      }, [methods]);

      return (
        <FormProvider {...methods}>
          <FormField
            control={methods.control}
            name="test"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Label</FormLabel>
                <FormControl>
                  <input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormProvider>
      );
    };

    render(<TestComponent />);

    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("renders FormDescription correctly", () => {
    render(
      <TestFormWrapper>
        <FormDescription>This is a description</FormDescription>
      </TestFormWrapper>
    );

    const description = screen.getByText("This is a description");
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass("text-muted-foreground");
  });
});