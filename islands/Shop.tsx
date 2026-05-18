import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { ProductCard } from "../components/ProductCard.tsx";
import { PromoBanner } from "../components/PromoBanner.tsx";
import { CustomBox } from "./CustomBox.tsx";
import {
  AlertTriangle,
  Loader2,
  Search,
  SlidersHorizontal,
} from "lucide-preact";
import { HttpTypes } from "@medusajs/types";

export default function Shop({ category }: { category?: string }) {
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("-created_at");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isError, setIsError] = useState(false);
  const [currencyCode, setCurrencyCode] = useState("USD");

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when search or sort changes
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [debouncedSearch, sort]);

  // Fetch products
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const categoryParam = category
          ? `&category=${encodeURIComponent(category)}`
          : "";
        const res = await fetch(
          `/api/products?page=${page}&limit=12&sort=${sort}&q=${encodeURIComponent(
            debouncedSearch,
          )}${categoryParam}`,
        );
        const data = await res.json();

        if (isMounted) {
          if (data.isError) {
            setIsError(true);
            setProducts([]);
            setHasMore(false);
          } else {
            setProducts((prev) =>
              page === 1 ? data.products : [...prev, ...data.products],
            );
            setHasMore(data.products.length === 12); // Assuming limit is 12
            setIsError(false);
          }
          if (data.currencyCode) setCurrencyCode(data.currencyCode);
        }
      } catch (e) {
        console.error(e);
        if (isMounted) {
          setIsError(true);
          setHasMore(false);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (hasMore || page === 1) {
      fetchProducts();
    }

    return () => {
      isMounted = false;
    };
  }, [page, debouncedSearch, sort]);

  return (
    <div
      class={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
        category ? "pb-16 pt-4" : "py-16"
      }`}
    >
      {isError && (
        <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-md shadow-sm">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <AlertTriangle class="h-5 w-5 text-red-500" />
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">
                <strong>Store Unavailable:</strong> We are currently
                experiencing technical difficulties connecting to the store
                backend. Please try again later.
              </p>
            </div>
          </div>
        </div>
      )}

      <div class="flex flex-col md:flex-row justify-end items-start md:items-center mb-8 gap-4">
        <div class="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div class="relative w-full sm:w-56 flex items-center group">
            <Search class="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none transition-colors group-focus-within:text-blue-500" />
            <input
              type="text"
              placeholder="Search..."
              class="w-full pl-9 pr-3 py-1.5 text-sm bg-white placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-gray-700"
              value={search}
              onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
            />
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto relative group">
            <SlidersHorizontal class="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none transition-colors group-focus-within:text-blue-500 shrink-0 z-10" />
            <select
              class="w-full sm:w-36 py-1.5 pl-9 pr-8 text-sm bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-gray-700 cursor-pointer appearance-none bg-no-repeat bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:right_0.5rem_center] bg-[length:1em_1em]"
              value={sort}
              onChange={(e) => setSort((e.target as HTMLSelectElement).value)}
            >
              <option value="-created_at">Newest</option>
              <option value="created_at">Oldest</option>
              <option value="title">A to Z</option>
              <option value="-title">Z to A</option>
            </select>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <CustomBox />
        {products.map((product, index) => {
          const isLast = products.length === index + 1;
          const card = (
            <div ref={isLast ? lastElementRef : null} key={product.id}>
              <ProductCard product={product} currencyCode={currencyCode} />
            </div>
          );

          // Insert PromoBanner after every 15 products (since CustomBox takes 1 slot, this makes it after 4 rows)
          if ((index + 1) % 15 === 0) {
            return [
              card,
              <div
                key={`promo-${index}`}
                class="col-span-1 sm:col-span-2 lg:col-span-4 my-4"
              >
                <PromoBanner />
              </div>,
            ];
          }

          return card;
        })}
      </div>

      {loading && (
        <div class="flex justify-center items-center py-12">
          <Loader2 class="w-8 h-8 animate-spin text-gray-400" />
        </div>
      )}

      {!loading && products.length === 0 && !isError && (
        <div class="text-center py-24 text-gray-500">
          <p class="text-xl mb-2">No products found</p>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}

      {!loading && !hasMore && products.length > 0 && (
        <div class="text-center py-12 text-gray-500">
          <p>You've reached the end of the list.</p>
        </div>
      )}
    </div>
  );
}
