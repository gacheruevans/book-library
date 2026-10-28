# Children's Book Library

A modern full-stack web application designed for teachers and students to organize reading instruction into age-and-reading-level coinciding reading groups, browse the book catalog, and track reading progress.

---

## Capabilities & Features

### 1. Age-and-Reading-Level Coinciding Reading Groups
- Systematically coincides student age cohorts with target reading stages:
  - **2–3 yrs** ➔ **Level A** (*Little Sprouts / Early Emergent*)
  - **4–5 yrs** ➔ **Level B** (*Early Explorers / Emergent Reader*)
  - **6–7 yrs** ➔ **Level C** (*Story Builders / Early Fluent*)
  - **8–9 yrs** ➔ **Level D** (*Curious Investigators / Developing*)
  - **10–11 yrs** ➔ **Level E** (*Book Voyagers / Intermediate*)
  - **12–13 yrs** ➔ **Level F** (*Literary Adventurers / Advanced Junior*)
  - **13–14 yrs** ➔ **Level G** (*Page Masters / Competent*)
  - **14–15 yrs** ➔ **Level H** (*Chapter Champions / Proficient*)
  - **15–16 yrs** ➔ **Level I** (*Scholars Guild / Advanced*)
  - **16+ yrs** ➔ **Level J** (*Omni Readers / Young Adult*)
- **Automated Coincidence in Group Creation**: Selecting an age cohort automatically sets and locks the target reading level with educational stage context.
- **Group Rosters & Enrollment**: Teachers can enroll eligible students and see member counts and avatars.
- **Level-Matched Book Assignments**: Assign books to groups with visual `Coinciding Level Match` indicators.

### 2. Multi-Role Authentication & 1-Click Persona Switcher
- Fast 1-click persona switcher to seamlessly test both Teacher and Student perspectives:
  - **Teachers**: Ms. Clara Vance, Mr. David Sterling.
  - **Students**: Leo Brooks (Age 5 • Level B), Maya Patel (Age 3 • Level A), Aria Wilson (Age 7 • Level C), Samir Gomez (Age 9 • Level D), Elena Rostova (Age 11 • Level E).
- Standard email sign-in also supported.

### 3. Teacher Dashboard & Navigation Drawer
- Responsive Material UI Drawer providing one-click switching between:
  - **Reading Groups**: View all age-and-level cohorts, assigned books, and enrolled students with a primary `Create Reading Group` CTA.
  - **Books Catalog**: Full searchable catalog with filters and direct `Assign to Reading Group` actions.

### 4. Personalized Student Dashboard
- Tailored landing page showing the student's age, assigned reading group, and reading level badge.
- Interactive status tracker on each assigned book (*Want to Read*, *Reading*, *Done!*).
- Filtering tabs by reading status with milestone progress counters.

### 5. Title & Author Search & Infinite Scrolling
- Fast client-side search with auto-complete suggestions.
- Reading level quick filter chips (`All`, `A` through `J`).
- Smooth infinite scroll pagination and back-to-top floating button.

---

## How to Run

### Prerequisites
- Node.js (v18 or higher recommended, tested on Node v20 / v22)
- npm (v9 or higher)

### 1. Backend Server

```bash
cd backend

# Install dependencies
npm install

# Run automated tests (includes 30 unit tests for age-level ladder, users, and reading groups)
npm test

# Run code linter
npm run lint

# Start development server (defaults to port 5000, or PORT env variable)
npm run start
# Or with hot-reloading:
npm run start:dev
```

The GraphQL server runs at `http://localhost:5000/`.

### 2. Frontend Application

```bash
cd frontend

# Install dependencies
npm install

# Run code linter & type-check
npm run lint
npm run build

# Start Vite development server
npm run dev
```

The application will be available at `http://localhost:5173/`.
