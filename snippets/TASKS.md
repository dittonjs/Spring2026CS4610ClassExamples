# Code Snippet Viewer - Tasks

## Setup Phase

- [x] **Install dependencies** - Add shiki, Jest, and React Testing Library to `package.json`
- [x] **Configure Jest** - Create `jest.config.js` with Next.js and jsdom environment setup
- [x] **Configure iframe embedding** - Update `next.config.ts` to allow iframe embedding (set headers to permit X-Frame-Options)

## Test-Driven Development Phase

For each component/feature, follow TDD: Write tests first, then implement.

### Base64 Utilities

- [x] **Write base64 utility tests** - Create `__tests__/utils/base64.test.ts` for base64 decoding and error handling
- [x] **Implement base64 utilities** - Create utility functions to pass the tests

### CodeBlock Component

- [x] **Write CodeBlock component tests** - Create `__tests__/components/CodeBlock.test.tsx` for syntax highlighting rendering
- [x] **Implement CodeBlock component** - Create `app/components/CodeBlock.tsx` as a Server Component using shiki

### CopyButton Component

- [x] **Write CopyButton component tests** - Create `__tests__/components/CopyButton.test.tsx` for copy-to-clipboard functionality
- [x] **Implement CopyButton component** - Create `app/components/CopyButton.tsx` as a Client Component

### EmbedCode Component

- [x] **Write EmbedCode component tests** - Create `__tests__/components/EmbedCode.test.tsx` for embed code generation and display
- [x] **Implement EmbedCode component** - Create `app/components/EmbedCode.tsx` as a Client Component

### Snippet Page

- [x] **Write snippet page tests** - Create `__tests__/app/s/[language]/[base64]/page.test.tsx` for route handling, base64 decoding, error states, and embed mode
- [x] **Implement snippet page** - Create `app/s/[language]/[base64]/page.tsx` with all functionality

### Home Page

- [x] **Write home page tests** - Create `__tests__/app/page.test.tsx` for instructions and URL generation form
- [x] **Update home page** - Update `app/page.tsx` with instructions, example usage, and optional form

### Theming - Utah State University

- [x] **Create Tailwind theme configuration** - Define USU color palette in Tailwind config (primary dark blue, secondary light blue, text colors)
- [x] **Update globals.css with USU colors** - Add CSS variables for USU brand colors to `app/globals.css`
- [x] **Apply USU theme to home page** - Update `app/page.tsx` with USU colors (headers, buttons, backgrounds)
- [x] **Apply USU theme to snippet page** - Update `app/s/[language]/[base64]/page.tsx` with USU colors
- [x] **Apply USU theme to components** - Update all components (CodeBlock, CopyButton, EmbedCode) with USU colors
- [x] **Test theme consistency** - Verify USU theme is applied consistently across all pages and components
