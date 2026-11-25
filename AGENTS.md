Project Architechture & Coding Rules

Tech stack :-

1. Frontend :- React 18+, with Typescript, Next.js, react-hook-form, tanstack query, and tailwindcss
2. Backend :- Node.js 20+ with Express.js and Typescript, Zod for validation, Nodemailer
3. Testing :- Jest + Supertest (server), Jest + React Testing Library (client)
4. Infra :- Docker Compose (Client, Server)

Non-Negotiable Architectural Boundaries

1. No Direct External Calls from Client, The React client MUST ONLY call our Node backend "/api/\*". Never call "fakestoreapi.com" from the browser.

2. On the server side - Define CatalogProvider interface
   1. getFeaturedProducts
   2. getCategories
   3. getProductsByCategory
   4. searchProducts
   5. getProductById

3. Implement CatalogProvider interface with FakeStoreCatalogAdapter using internal domain `Product` types (do not leak raw Fake Store API shapes directly to controllers)

4. Define EmailProvider interface sendEnquiry. Implement `EmailAdapter` (configured via env vars to talk to Mailpit locally, swappable for AWS SES later).

5. Clean UI Separation Keep API fetching in dedicated hooks/services (client/src/api/). Keep components clean and minimal so branding/styling can be swapped later without touching business logic.

6. Error Handling & Validation Validate all incoming POST payloads and query params with Zod. Return consistent JSON error shapes "{ error: string, details?: unknown }".

7. No Secrets - Never hardcode credentials or URLs. Use environment variables documented in ".env.example".
