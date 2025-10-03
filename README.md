# Example District Generator

[View the project on GitHub](https://github.com/legertom/example-district-generator)

A React-based application for generating realistic fake CSV data files compatible with district SFTP specifications. Perfect for testing district integrations and developing district-compatible systems.

## Features

- **6 CSV file types**: students, teachers, schools, sections, enrollments, and staff
- **Realistic Faker.js data** with grade-aware DOBs and school-aware enrollments
- **Configurable generation**: adjust counts per entity and school metadata from the UI
- **ZIP export**: download all CSVs at once or export any single file
- **Live preview**: inspect the first rows before exporting
- **Responsive React + Tailwind UI** with TypeScript safety throughout

## Project Overview

- UI and state management live in `src/App.tsx`, including validation and the bindings to export actions.
- Core schemas, CSV headers, and lookup constants are defined in `src/types.ts`.
- Faker-powered generation logic is implemented in `src/dataGenerator.ts`.
- CSV formatting and ZIP packaging sit in `src/csvExporter.ts`.
- Styling is handled by Tailwind v4 (see `src/index.css` for the entry import and global tweaks).

## Customizing the Data

- Add or modify fields in the interfaces and `CSV_FILE_HEADERS` map inside `src/types.ts`.
- Adjust how fake data is produced by editing the relevant generator method in `src/dataGenerator.ts` (for example, `generateStudents` for grade logic or `generateSchools` for principal fields).
- Update export behavior or preview formatting in `src/csvExporter.ts` if you introduce new columns or want different file naming.
- Tweak default form values or validation rules in `src/App.tsx` to reflect new requirements.

## Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the dev server:**
   ```bash
   npm run dev
   ```

3. **Open the app:**
   Visit `http://localhost:5173`.

4. **Iterate:**
   Modify the generator or UI files above; Vite hot-reloads changes automatically.

## Deployment

- Build the production bundle with `npm run build`; the optimised assets are written to `dist/`.
- Deploy the `dist/` folder to any static host (GitHub Pages, Cloudflare Pages, Netlify, etc.).
- Configure your custom domain through the chosen provider and point DNS records accordingly.

## Deployment

Combine the build step and host-specific instructions in your CI/CD pipeline to auto-publish on every push.
