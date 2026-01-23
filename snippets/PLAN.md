# Code Snippet Viewer Application

## Overview

A simple Next.js application that renders code snippets from base64-encoded strings in the URL path. The application uses the route structure `/s/[language]/[base64]` where:

- `[language]` specifies the programming language for syntax highlighting
- `[base64]` contains the base64-encoded code to display

## Architecture

```
User Request → /s/[language]/[base64]?embed=true (optional)
    ↓
Decode base64 string
    ↓
Validate language
    ↓
Check if embed mode (query parameter)
    ↓
Render with syntax highlighting
    ↓
Display embed code (if not in embed mode)
    ↓
Return page (iframe-friendly headers)
```

## Implementation Details

### 1. Route Structure

Create a dynamic route at `app/s/[language]/[base64]/page.tsx` that:

- Extracts `language` and `base64` from URL params
- Decodes the base64 string to get the original code
- Handles decoding errors gracefully

### 2. Syntax Highlighting

Use **shiki** for syntax highlighting:
- Modern, fast syntax highlighting library
- Works well with Next.js Server Components (no client-side JavaScript needed)
- Supports a wide range of programming languages
- Provides high-quality syntax highlighting with theme support
- **Custom USU Themes**: Two custom themes matching Utah State University brand colors
  - Light theme: Uses USU primary dark blue (#003366) with light backgrounds
  - Dark theme: Uses USU dark blue backgrounds with light text
  - Themes stored as JSON files following shiki theme format
  - User can toggle between themes via UI switch
  - Embedded version accepts theme via `?theme=light` or `?theme=dark` query parameter

### 3. UI Components

Create a clean, readable code display with:

- Syntax-highlighted code block
- Copy-to-clipboard functionality (Client Component)
- Embed code generator (shows iframe code for Canvas LMS)
- **Theme Toggle Switch**: Client component to switch between light and dark code themes
  - Toggle visible on snippet page (not in embed mode)
  - Persists theme preference (localStorage or URL state)
  - Updates CodeBlock theme dynamically
- Responsive design using Tailwind CSS
- Dark mode support (already configured in the project)
- Error handling UI for invalid base64 or unsupported languages
- Compact layout option for iframe embedding (query parameter or automatic detection)

### 4. Home Page Updates

Update `app/page.tsx` to:

- Provide instructions on how to use the snippet viewer
- Optionally include a simple form to generate snippet URLs (Client Component)
- Show example usage

### 5. Error Handling

- Invalid base64 encoding → Show error message
- Unsupported language → Fallback to plain text or show error
- Missing params → Redirect or show helpful message

### 6. Iframe Embedding Support

Configure the application to support iframe embedding for Canvas LMS:

- Set proper headers in `next.config.ts` to allow iframe embedding (remove X-Frame-Options restriction)
- Add a query parameter `?embed=true` to show a compact, iframe-optimized version
- Display embed code on the snippet page with a copy button
- Generate iframe HTML code with appropriate dimensions
- Ensure the layout works well when embedded (minimal padding, full-width code blocks)

## Files to Create/Modify

1. **`app/s/[language]/[base64]/page.tsx`** - Main snippet display page (Server Component)
2. **`app/components/CodeBlock.tsx`** - Syntax-highlighted code display component (Server Component)
3. **`app/components/CopyButton.tsx`** - Copy-to-clipboard button (Client Component)
4. **`app/components/EmbedCode.tsx`** - Embed code generator component (Client Component)
5. **`app/page.tsx`** - Update home page with instructions and optional form
6. **`next.config.ts`** - Configure headers to allow iframe embedding
7. **`package.json`** - Add dependencies (shiki, Jest, React Testing Library)
8. **`jest.config.js`** - Jest configuration for Next.js
9. **`__tests__/utils/base64.test.ts`** - Tests for base64 decoding utilities
10. **`__tests__/components/CodeBlock.test.tsx`** - Tests for CodeBlock component
11. **`__tests__/components/CopyButton.test.tsx`** - Tests for CopyButton component
12. **`__tests__/components/EmbedCode.test.tsx`** - Tests for EmbedCode component
13. **`__tests__/app/s/[language]/[base64]/page.test.tsx`** - Tests for snippet page
14. **`__tests__/app/page.test.tsx`** - Tests for home page

## Dependencies

- `shiki` - Syntax highlighting library (works with Server Components)

## Testing

### Testing Framework

Use **Jest** with React Testing Library for test-driven development:

- **Jest** - JavaScript testing framework
- **@testing-library/react** - React component testing utilities
- **@testing-library/jest-dom** - Custom Jest matchers for DOM elements
- **@testing-library/user-event** - User interaction simulation
- **jest-environment-jsdom** - DOM environment for Jest

### Testing Strategy

Follow Test-Driven Development (TDD) approach:

1. **Write tests first** - Write failing tests that define the expected behavior
2. **Implement functionality** - Write minimal code to make tests pass
3. **Refactor** - Improve code while keeping tests green

### Test Coverage

Write tests for:

- **Base64 decoding utilities** - Test decoding logic and error handling
- **CodeBlock component** - Test syntax highlighting rendering
- **CopyButton component** - Test copy-to-clipboard functionality
- **EmbedCode component** - Test embed code generation and display
- **Snippet page** - Test route handling, base64 decoding, error states, and embed mode
- **Error handling** - Test invalid base64, unsupported languages, missing params
- **Home page** - Test instructions display and URL generation form (if implemented)

## Styling

- Use Tailwind CSS (already configured)
- Match existing dark mode theme
- Ensure code blocks are readable with proper contrast
- Add subtle borders/backgrounds for code containers
- Compact layout for iframe embedding (reduced padding, optimized spacing)

## Theming - Utah State University

### Color Palette

Based on Utah State University's brand colors:

- **Primary Blue (Dark)**: Used for headers, navigation, and primary buttons
  - Approximate hex: `#003366` or similar dark blue (`#1a365d`, `#1e3a8a`)
  - Used for: Navigation bars, primary CTAs, headings

- **Secondary Blue (Light)**: Used for accent buttons and highlights
  - Approximate hex: `#4A90E2` or similar light blue (`#3b82f6`, `#60a5fa`)
  - Used for: Secondary buttons (e.g., "Ask USU" button), links, accents

- **Text Colors**:
  - Dark text on light backgrounds: Dark blue or near-black (`#171717`, `#1a1a1a`)
  - Light text on dark backgrounds: White (`#ffffff`) or light gray (`#f5f5f5`)

- **Background Colors**:
  - Light backgrounds: White (`#ffffff`) or very light gray (`#f9fafb`)
  - Dark backgrounds: Dark blue matching primary color

### Typography

- Use clean, professional sans-serif fonts
- Headings should use the primary dark blue color
- Body text should maintain good contrast for readability

### Component Styling

- **Buttons**:
  - Primary: Dark blue background with white text
  - Secondary: Light blue background with white text or dark blue text
  - Hover states: Slightly lighter/darker shades

- **Code Blocks**:
  - Maintain readability with proper contrast
  - Use USU blue accents for borders or highlights
  - Ensure syntax highlighting remains clear

- **Forms**:
  - Input fields with subtle borders
  - Focus states using USU blue
  - Consistent spacing and padding

### Implementation

- Create custom Tailwind theme configuration with USU colors
- Update `app/globals.css` with USU color variables
- Apply theme consistently across all components
- Maintain accessibility standards (WCAG contrast ratios)
- Ensure theme works in both light and dark modes (if dark mode is retained)

## Iframe Embedding

### Configuration

- Configure Next.js to allow iframe embedding by setting proper headers in `next.config.ts`
- Remove or set `X-Frame-Options` to allow embedding
- Optionally add `Content-Security-Policy` headers that permit iframe embedding

### Embed Code Generation

- Display iframe embed code on each snippet page
- Include default dimensions (e.g., width="100%" height="400px")
- Provide copy-to-clipboard functionality for easy sharing
- Show example usage for Canvas LMS
- **Dynamic Height Calculation**: Automatically calculate iframe height based on the number of lines of code being embedded
  - Count the number of lines in the code snippet
  - Estimate height using a formula that accounts for line height, padding, and header space
  - Provide a reasonable default height for very short snippets (minimum height)
  - Ensure the calculated height accommodates the full code block without unnecessary scrolling

### Layout Optimization

- Support `?embed=true` query parameter for compact iframe view
- When embedded, reduce padding and margins
- Ensure code blocks are full-width and properly scrollable
- Maintain readability in both standalone and embedded contexts

## Tasks

### Setup Phase

1. **Install dependencies** - Add shiki, Jest, and React Testing Library to `package.json`
2. **Configure Jest** - Create `jest.config.js` with Next.js and jsdom environment setup
3. **Configure iframe embedding** - Update `next.config.ts` to allow iframe embedding (set headers to permit X-Frame-Options)

### Test-Driven Development Phase

For each component/feature, follow TDD: Write tests first, then implement.

4. **Write base64 utility tests** - Create `__tests__/utils/base64.test.ts` for base64 decoding and error handling
5. **Implement base64 utilities** - Create utility functions to pass the tests

6. **Write CodeBlock component tests** - Create `__tests__/components/CodeBlock.test.tsx` for syntax highlighting rendering
7. **Implement CodeBlock component** - Create `app/components/CodeBlock.tsx` as a Server Component using shiki

8. **Write CopyButton component tests** - Create `__tests__/components/CopyButton.test.tsx` for copy-to-clipboard functionality
9. **Implement CopyButton component** - Create `app/components/CopyButton.tsx` as a Client Component

10. **Write EmbedCode component tests** - Create `__tests__/components/EmbedCode.test.tsx` for embed code generation and display
11. **Implement EmbedCode component** - Create `app/components/EmbedCode.tsx` as a Client Component

12. **Write snippet page tests** - Create `__tests__/app/s/[language]/[base64]/page.test.tsx` for route handling, base64 decoding, error states, and embed mode
13. **Implement snippet page** - Create `app/s/[language]/[base64]/page.tsx` with all functionality

14. **Write home page tests** - Create `__tests__/app/page.test.tsx` for instructions and URL generation form
15. **Update home page** - Update `app/page.tsx` with instructions, example usage, and optional form

16. **Style components** - Apply Tailwind CSS styling with dark mode support, proper contrast, and compact embed layout
