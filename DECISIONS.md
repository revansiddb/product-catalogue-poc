### 1. `FakeStoreCatalogAdapter` with In-Memory TTL Cache

- **Decision:** Wrap all Fake Store API calls inside a `FakeStoreCatalogAdapter` (behind a `CatalogProvider` interface) with a simple 5-minute in-memory TTL cache.
- **Why:**
  - **Missing API features:** Fake Store doesn't have a search endpoint or rating sort. Since the catalog is tiny (~20 items), caching it in memory lets us filter and sort instantly on the backend.
  - **Speed & stability:** Hitting a public demo API on every keystroke or page load adds lag and risks rate limits. The cache keeps responses fast and lets us serve stale data if Fake Store hiccups.
  - **Easy to swap later:** Mapping Fake Store's JSON to our own `Product` type inside the adapter means we can replace it with Postgres or Shopify later by swapping one file—without touching routes or the frontend.
- **Next step:** Move from in-memory caching to Redis (AWS ElastiCache) once we run multiple backend containers in production.


### 2. Rating-Based Featured & Category Top-2 Ranking

- **Decision:** Determine featured products (top-5) and category top-2 by sorting on `rating.rate` descending, rather than using a static `FEATURED_PRODUCT_IDS` env var or arbitrary API order.
- **Why:** Removes manual ID configuration and surfaces the highest-rated products automatically.

### 3. Unified `GET /api/products` Endpoint

- **Decision:** Consolidate featured, category-filtered, and search product fetching into a single `GET /api/products` endpoint with optional `?category=` and `?q=` query parameters.
- **Why:** Reduces frontend API surface, avoids Express path-segment collisions (`/featured` or `/search` vs `/:id`), and increases reusability.

### 4. Scoped Caching (`all_products` and `categories` only)

- **Decision:** Cache only `all_products` and `categories` in `FakeStoreCatalogAdapter`; fetch per-category (`?category=`) and single-product (`/:id`) live from FakeStoreAPI.
- **Why:** Keeps caching simple and focused on the two endpoints that require server-side sorting/filtering or are static.

### 5. Submit-Only Search & No Pagination

- **Decision:** Trigger search only on form submit (Enter key or Search button click) and return full result sets without pagination.
- **Why:** Matches Acceptance Criteria and keeps the PoC strictly within scope.

### 6. Frontend Routing & Enquiry Modal

- **Decision:** Use `/`, `/categories` (links to `/products?category=...`), `/products` (handles `?category=` and `?q=`), and `/products/[id]` with an `EnquiryModal` triggered by a button.
- **Why:** Cleaner URL structure aligned with the unified `/api/products` endpoint and keeps the product detail page uncluttered.

### 7. `NEXT_PUBLIC_API_BASE_URL` Env Var & Client-Side API Base

- **Decision:** Rename `VITE_API_BASE_URL` to `NEXT_PUBLIC_API_BASE_URL` in `.env.example` and `docker-compose.yml` (pointing to `http://localhost:4000/api` for browser requests).
- **Why:** The frontend uses Next.js (not Vite), and browser-side TanStack Query requests run in the user's browser, which resolves `localhost:4000` rather than the internal Docker service name.

### 8. Separate `validators/` and `controllers/` Layers in Backend

- **Decision:** Extract Zod request validation into `back-end/src/validators/` middleware (`productsValidator.ts`, `enquiryValidator.ts`) and route business logic into `back-end/src/controllers/` (`productsController.ts`, `categoriesController.ts`, `enquiryController.ts`), leaving `routes/` strictly for route registration and middleware wiring.
- **Why:** Improves readability, isolates request/response manipulation from validation, and creates a clean middleware pipeline for future cross-cutting concerns (e.g., auth, rate limiting).
