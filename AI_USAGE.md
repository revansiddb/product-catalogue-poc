# AI Usage & Mistakes Caught

## Mistakes & Gaps Caught During Review (against `PLAN.md` & `AGENTS.md`)

1. **Inconsistent Product Card Sizes & Alignment Across Pages (`ProductCard.tsx`, `ProductGrid.tsx`, `page.tsx`)**
   - **What happened:** `ProductGrid` rendered `featured` cards in a 2-column layout with `variant="featured"` (256px tall image) and `rest` cards in a 4-column layout with `variant="default"` (192px tall image). Because `HomePage` passed `featured` while Search passed `rest`, cards had completely different widths and heights across Home, Category, and Search pages. Inside `ProductCard`, images used `object-cover` without a fixed-height container and titles lacked a fixed min-height, causing uneven card heights and misaligned content.
   - **Fix:** Standardized `ProductGrid` to a uniform 4-column responsive grid (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`), gave `ProductCard` a fixed-height centered image container (`h-48`, `object-contain`), aligned inner content with `flex flex-col h-full` + `min-h-[2.5rem]` title, added a consistent **View Product** button (`mt-auto`), and used a `Top Pick` badge/ring for featured category items without altering card dimensions.

2. **Missing Star Rating Indicator on Cards (`ProductCard.tsx`)**
   - **What happened:** The product detail page (`products/[id]/page.tsx`) rendered `⭐ {rate} stars ({count} reviews)`, whereas `ProductCard.tsx` omitted the `⭐` icon on the homepage, category, and search grids.
   - **Fix:** Added `⭐` to `ProductCard.tsx` so rating presentation is consistent across list and detail views.

3. **Next.js 14 Config & Jest TypeScript Config Compatibility (`next.config.ts`, `jest.config.ts`)**
   - **What happened:** Initial scaffolding generated `next.config.ts` (unsupported in Next.js 14.0.4) and `jest.config.ts` (which failed without `ts-node` in `front-end`), and omitted `@types/jest` from `devDependencies`.
   - **Fix:** Replaced `next.config.ts` with `next.config.js`, converted `jest.config.ts` to `jest.config.js`, and installed `@types/jest` in both `back-end` and `front-end`.

4. **TanStack Query v5 `mutationFn` Context Argument in Tests (`EnquiryForm.test.tsx`)**
   - **What happened:** `expect(sendEnquiry).toHaveBeenCalledWith(payload)` failed because TanStack Query v5 passes a second context object (`{ client, meta, mutationKey }`) to `mutationFn`.
   - **Fix:** Asserted directly against `mock.calls[0][0]` for the submitted enquiry payload.

5. **FakeStoreAPI Null Payload Handling & Duplicate Fetch Logic (`FakeStoreCatalogAdapter.ts`)**
   - **What happened:** `getFeaturedProducts` and `searchProducts` duplicated the `all_products` fetch block, and `getProductById` only checked HTTP `404` even though FakeStoreAPI returns HTTP `200` with `null` for non-existent product IDs.
   - **Fix:** Extracted a shared `getAllProducts()` private helper and added a guard (`if (!raw || typeof raw.id !== 'number') throw new Error('NOT_FOUND')`) so missing products consistently return HTTP `404`.

6. **Mixed Validation & Business Logic in Route Handlers (`back-end/src/routes/*.ts`)**
   - **What happened:** Zod validation and controller logic were initially inline in `routes/products.ts` and `routes/enquiry.ts`.
   - **Fix:** Separated request validation into `back-end/src/validators/` middleware and business logic into `back-end/src/controllers/`.
