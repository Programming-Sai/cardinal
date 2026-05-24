<p align="center">
  <a href="https://cardinal-flame.vercel.app/" target="_blank" rel="noopener noreferrer">
    <img
      src="https://raw.githubusercontent.com/Programming-Sai/cardinal/snapmock/output_laptop.png"
      srcset="
        https://raw.githubusercontent.com/Programming-Sai/cardinal/snapmock/output_mobile.png  767w,
        https://raw.githubusercontent.com/Programming-Sai/cardinal/snapmock/output_tablet.png 1023w,
        https://raw.githubusercontent.com/Programming-Sai/cardinal/snapmock/output_laptop.png 1280w
      "
      sizes="(max-width: 767px) 100vw,
             (max-width: 1023px) 80vw,
             60vw"
      alt=" Cardinal Immersions Preview"
      style="width:100%; height:auto;"
    />
  </a>
</p>

# Cardinal Immersions

Cardinal Immersions is a branded learning mobility platform for students, early-career professionals, and institutional partners. The current codebase focuses on the public-facing website, application journeys, and an internal admin workspace, all wrapped in a visual system built around slanted section geometry, a frosted sticky header, and a Cardinal Red / Deep Navy palette.

## What This Repository Is

This repo contains the full front-end experience for the Cardinal Immersions website:

- A public marketing site with Home, About, Programs, Partners, Contact, and Apply pages
- Program detail views for individual offerings
- A reusable brand system for logo, mark, icons, images, and layout chrome
- A local-storage-backed admin area for applications, inquiries, programs, and admin management
- A shared design language that keeps the site consistent across desktop, tablet, and mobile

The product is frontend-first right now. The admin area uses local mock data and browser storage, which makes it easy to explore the workflows without needing a backend.

## Live Product Goals

The site is designed to communicate a clear position:

- Structured international learning, not tourism
- African-founded, globally focused
- Premium, editorial presentation with strong trust signals
- Clear pathways for students and institutions to take action

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS v4
- Radix UI components
- Lucide React icons
- Recharts for analytics visuals
- Sonner for toast notifications

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

## Project Structure

```text
src/
  app/
    components/
      admin/        Admin shell and layout
      brand/        Logo, mark, and icon system
      media/        Reusable image helpers
      ui/           Shared UI primitives
    data/           Structured program data
    pages/          Public and admin pages
    utils/          Mock data and admin auth helpers
    App.tsx         Route composition for public + admin areas
  assets/           Logo, favicon, and other brand assets
  styles/           Global styles, theme tokens, and Tailwind entry points
```

## Public Pages

- `Home` - brand narrative, program preview, trust signals, and conversion paths
- `About` - mission, vision, values, approach, and leadership placeholders
- `Programs` - program categories, program openings, FAQs, and comparison guidance
- `ProgramDetail` - a deeper look at each program, including fit, outcomes, and next steps
- `Partners` - partnership models, credibility content, proof points, and FAQs
- `Contact` - contact form, contact details, embedded map, and support information
- `Apply` - individual and institutional application flows with validation and confirmation states

## Admin Area

The admin workspace lives under `/admin` and includes:

- Login
- Dashboard
- Applications
- Inquiries
- Programs
- Admin Management

Current admin behavior is browser-based for now:

- Authentication is local/session backed
- Content is stored in localStorage
- Data management is built around mock records so the UI can be explored end-to-end
- Mutation actions use confirmation flows to reduce accidental changes

## Design System

The interface is intentionally consistent across the site:

- Cardinal Red for actions and emphasis
- Deep Navy for structure, navigation, and contrast
- Slanted section edges and clipped panels
- Frosted sticky header on the public site
- Custom scrollbars that match the brand
- Reusable logo and icon components instead of emoji-based placeholders

## Asset Notes

- Brand assets live in `src/assets`
- The favicon is configured from the local asset bundle
- Images use the shared fallback media helper so loading states and errors feel intentional
