# Children's Book Library - Frontend Application

A responsive React + TypeScript single-page application built with Vite and Material UI. Designed for teachers to manage age-and-level aligned reading groups, assign curated titles, and for young students to track their reading journeys.

---

## 🌟 Key Features

### 1. Age & Reading Level Coincidence System
The platform systematically pairs student age cohorts with reading levels:
- **2–3 yrs** ➔ **Level A** (*Little Sprouts / Early Emergent*)
- **4–5 yrs** ➔ **Level B** (*Early Explorers / Emergent Reader*)
- **6–7 yrs** ➔ **Level C** (*Story Builders / Early Fluent*)
- **8–9 yrs** ➔ **Level D** (*Curious Investigators / Developing*)
- **10–11 yrs** ➔ **Level E** (*Book Voyagers / Intermediate*)
- **12–13 yrs** ➔ **Level F** through **16+ yrs** ➔ **Level J**

- **Auto-Coincidence in Group Creation**: Selecting an age cohort automatically locks the corresponding reading level with learning stage details.
- **Level-Matched Book Recommendations**: Books matching a reading group's level display a `Coinciding Level Match` badge when assigning.

### 2. Multi-Role Authentication & 1-Click Persona Quick Switcher
- Instantly switch between user personas to test all role-based experiences:
  - **Teachers**: *Ms. Clara Vance* (Lead Elementary), *Mr. David Sterling* (Middle School).
  - **Students**: *Maya Patel* (Age 3 • Level A), *Leo Brooks* (Age 5 • Level B), *Aria Wilson* (Age 7 • Level C), *Samir Gomez* (Age 9 • Level D), *Elena Rostova* (Age 11 • Level E).
- Supports standard email sign-in with persistent state in `localStorage`.

### 3. Teacher Dashboard & Navigation Drawer
- **Responsive Drawer Navigation**: Seamlessly toggle between:
  - **Reading Groups**: View all age-and-level cohorts, student rosters, assigned books with 1-click removal, student enrollment, and a primary **Create Reading Group** CTA.
  - **Books Catalog**: Full searchable catalog with reading level filter chips and **Assign to Reading Group** action dialog.

### 4. Personalized Student Dashboard
- Tailored landing experience displaying the student's age, assigned reading group, and reading level badge.
- **Reading Progress Tracker**: Students can mark books as:
  - 📖 *Want to Read*
  - 📘 *Reading Now*
  - ✅ *Finished!*
- Status-filtered tabs with dynamic milestone counters.

### 5. Search, Filters & Performance
- Autocomplete search bar grouping suggestions by reading stage.
- Quick filter chips for reading levels (`All`, `A` through `J`).
- Infinite scrolling pagination with debounce and smooth loading indicators.
- Floating back-to-top button on extended scroll.
- Resilient error boundaries and visual backend connection banners.

---

## 📁 Component Structure

```
frontend/src/
├── context/
│   ├── AuthContext.tsx        # Active user session, switchPersona, roles
│   └── demoPersonas.ts        # Seed teacher and student demo personas
├── utils/
│   └── ageLevelLadder.ts      # 2-3y -> Level A, 4-5y -> Level B ladder logic
├── components/
│   ├── Auth/
│   │   └── LoginModal.tsx     # 1-Click persona quick switcher + email login
│   ├── Navigation/
│   │   └── TeacherDrawer.tsx  # Responsive MUI Drawer (Groups / Books)
│   ├── Teacher/
│   │   ├── TeacherDashboard.tsx   # Teacher portal layout & view router
│   │   ├── ReadingGroupsView.tsx  # Age-and-level group cards & rosters
│   │   ├── CreateGroupModal.tsx   # Age/level synchronized creation dialog
│   │   └── AssignBookDialog.tsx   # Assign book with "Level Match" badge
│   ├── Student/
│   │   ├── StudentDashboard.tsx   # Personalized student reading portal
│   │   └── StudentBookCard.tsx    # Interactive reading progress card
│   └── Shared/
│       ├── BookCard.tsx       # Catalog card with assign to reading group action
│       ├── BooksGrid.tsx      # Infinite scroll catalog grid
│       ├── SearchBar.tsx      # Autocomplete search & level filter chips
│       └── Footer.tsx         # Brand footer
├── GraphQl/
│   ├── Queries.ts             # GraphQL queries (books, groups, users, progress)
│   └── Mutations.ts           # GraphQL mutations (assignments, status, auth)
├── types.ts                   # Domain TypeScript definitions
└── App.tsx                    # Main app container & theme provider
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended, tested on Node v20 / v22)
- npm (v9 or higher)

### Installation
```bash
# From the frontend directory
npm install
```

### Running Locally
```bash
# Start development server with hot module replacement (HMR)
npm run dev
```

The frontend will run on **http://localhost:5173/**.

> **Note**: Ensure the backend server is running on **http://localhost:5000/** (`npm run start` in `backend/`).

### Code Quality & Build
```bash
# Run ESLint check
npm run lint

# Compile TypeScript and create production bundle
npm run build
```
