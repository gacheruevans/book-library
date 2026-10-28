# Children's Book Library

A full-stack web application designed for teachers to search for children's books by title, author, or reading level, and assign them to a reading list.

---

## Capabilities & Features

1. **Title & Author Search**: Fast client-side search with auto-complete suggestions grouped by reading level.
2. **Reading Level Filter**: Quick-filter chips for grade reading levels (`All`, `A` through `J`), allowing teachers to tailor assignments to students' reading stages.
3. **Student Reading List**:
   - Slide-out/collapsible reading list widget showing all currently assigned books.
   - Book cover thumbnails and reading level tags in each list item.
   - Dynamic item counter badge.
   - One-click removal of assigned books.
4. **Interactive Book Cards**:
   - Displays cover artwork, book title, author, and reading level badge.
   - Instant visual feedback: cards display a checkmark when already assigned, preventing duplicate additions.
5. **Infinite Scroll Pagination**: Smooth, responsive loading of catalog books as the user scrolls.
6. **Back-to-Top Floating Action Button**: Seamless smooth-scroll back to top when scrolling down long lists.
7. **Resilient Error Handling**: Toast notifications and visual connection banners when network or backend errors occur.

---

## How to Run

### Prerequisites
- Node.js (v18 or higher recommended, tested on Node v22)
- npm (v9 or higher)

### 1. Backend Server

```bash
cd backend

# Install dependencies
npm install

# Run automated tests
npm test

# Run code linter
npm run lint

# Start development server (defaults to port 4000, or PORT env variable)
npm run start
# Or with hot-reloading:
npm run start:dev
```

The GraphQL server runs at `http://localhost:4000/` (or your chosen `PORT`).

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

> **Note on Ports**: If port 4000 is occupied by another process on your machine, you can run the backend with `PORT=5001 npm run start` and start the frontend with `VITE_GRAPHQL_URI=http://localhost:5001/ npm run dev`.
