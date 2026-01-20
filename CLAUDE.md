# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 16 application using App Router, React 19, TypeScript, and Tailwind CSS v4. Uses shadcn/ui components (radix-lyra style) with Lucide icons.

## Development Commands

```bash
# Development server (uses pnpm)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint
pnpm lint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16.1.4 with App Router
- **React**: 19.2.3 with Server Components (RSC enabled)
- **TypeScript**: Strict mode enabled
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **Components**: shadcn/ui with radix-lyra style, lucide-react icons
- **Utilities**: clsx + tailwind-merge (via `cn()` utility)

### Directory Structure
- `app/` - Next.js App Router pages and layouts
- `components/` - React components
  - `components/ui/` - shadcn/ui components
  - `components/*.tsx` - Custom components and examples
- `lib/` - Utility functions (e.g., `cn()` for className merging)

### Path Aliases
Configured in tsconfig.json and components.json:
- `@/components` → `components/`
- `@/lib` → `lib/`
- `@/ui` → `components/ui/`
- `@/hooks` → `hooks/`
- `@/*` → `./*` (root)

### Styling System
- Uses Tailwind CSS v4 with `@theme inline` directive
- CSS variables defined in `app/globals.css` for light/dark themes
- Color system uses OKLCH color space
- Border radius controlled via `--radius` variable (currently 0)
- Custom dark mode variant: `@custom-variant dark (&:is(.dark *))`
- Animations from `tw-animate-css` package

### shadcn/ui Configuration
- Style: `radix-lyra`
- Base color: `stone`
- Menu: inverted style with subtle accent
- Icon library: lucide-react
- CSS variables enabled for theming

### Fonts
- Primary: Raleway (variable: `--font-sans`)
- Sans: Geist (variable: `--font-geist-sans`)
- Mono: Geist Mono (variable: `--font-geist-mono`)

## Adding shadcn/ui Components

Use the shadcn CLI with registry support:
```bash
pnpm dlx shadcn add [component-name]
```

Components are added to `components/ui/` directory.
