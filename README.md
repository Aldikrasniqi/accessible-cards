# Accessible Pet Adoption Cards

A design system demonstrating production-ready, fully accessible UI components with comprehensive documentation. Built to showcase how pet adoption websites should implement accessibility patterns.

## Overview

This project features two core accessible components (`PetCard` and `PetModal`) with complete keyboard navigation, screen reader support, and ARIA documentation. Each component state is documented with keyboard interactions, screen reader announcements, and focus management patterns.

## Components

- **PetCard** - Accessible card component with interactive and non-interactive states
- **PetModal** - Modal dialog with focus trapping, keyboard navigation, and focus restoration
- **StateDocumentation** - Reusable component for documenting accessibility patterns

## Getting Started

### Development

```bash
npm install
npm run dev
```

### Storybook

```bash
npm run storybook
```

View components and accessibility documentation at `http://localhost:6006`

### Build

```bash
npm run build
npm run build-storybook
```

### Testing

```bash
npm test          # Run tests once
npm run test:watch # Run tests in watch mode
```

Tests are written as Storybook `play` functions, testing component interactions, accessibility, and keyboard navigation. Tests run in a browser environment using Vitest + Playwright.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Storybook
- Vitest

## Accessibility Features

- Full keyboard navigation (Enter, Space, Tab, Escape)
- Screen reader support with proper ARIA attributes
- Focus management and trapping
- Semantic HTML
- Comprehensive state documentation
