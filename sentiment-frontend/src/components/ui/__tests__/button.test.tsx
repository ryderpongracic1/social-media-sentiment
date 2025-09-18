import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { Button } from '../button';

describe('Button', () => {
  it('renders a button with default variant and size', () => {
    render(<Button>Test Button</Button>);
    const button = screen.getByRole('button', { name: /test button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2');
  });

  it('renders a button with a custom variant', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole('button', { name: /secondary button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-secondary text-secondary-foreground hover:bg-secondary/80');
  });

  it('renders a button with a custom size', () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole('button', { name: /large button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('h-11 rounded-md px-8');
  });

  it('renders a disabled button', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeDisabled();
  });
});