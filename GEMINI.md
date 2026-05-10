# MyLink Project Guide

This file serves as a guide for the **MyLink** project, detailing its structure, tech stack, development conventions, and key features.

## 1. Project Overview
MyLink is a **simple link integration service** that allows users to collect, manage, and share their social links and website addresses on a single page.

### Core Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS 4, Lucide React (Icons)
- **UI Components**: shadcn/ui
- **Backend/Auth**: Firebase (Authentication, Firestore)
- **Language**: TypeScript

## 2. Project Structure
```text
C:\Users\ktm3m\OneDrive\Desktop\nyt\my_link\
├── app/                # Next.js App Router (pages and layouts)
├── components/         # Reusable UI components (including shadcn/ui)
├── docs/               # Design docs: PRD, scenarios, wireframes
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and library configurations
├── public/             # Static assets (images, favicons, etc.)
└── types/              # TypeScript type definitions
```

## 3. Key Features (Based on PRD)
- **Firebase Auth**: Google Social Login support.
- **Profile Management**: Google profile integration (photo, name), Bio editing.
- **Inline Editing**: Dashboard UI allowing instant text editing on click.
- **Link Management**: Add/delete titles and URLs, auto-loading icons via Google Favicon API.
- **Responsive Design**: Mobile-optimized layout.

## 4. Scripts and Commands
| Command | Description |
| :--- | :--- |
| `npm run dev` | Start development server (using `--turbopack`) |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint analysis |
| `npm run format` | Format code with Prettier (`ts`, `tsx`) |
| `npm run typecheck` | Run TypeScript type check |

## 5. Development Conventions
- **UI Components**: Add new UI components via `npx shadcn@latest add [component]` into `@components/ui`.
- **Styling**: Use Tailwind CSS 4 as the base, utilizing CSS variables (`--font-sans`, `--font-mono`).
- **Dark Mode**: Configured via `next-themes`, toggleable with keyboard shortcut `d`.
- **File Referencing**: Use the `@` prefix when referring to files in the project (e.g., `@app/page.tsx`).
- **Editing UI**: Prefer an inline editing approach where changes are saved on blur without a separate save button.
- **Data Structure**: Use Firestore's `users` collection and `links` sub-collection for data management.

## 6. Related Documents
- [PRD (Product Requirements Document)](@docs/prd.md)
- [Scenario](@docs/scenario.md)
- [Wireframe](@docs/Wireframe.md)
