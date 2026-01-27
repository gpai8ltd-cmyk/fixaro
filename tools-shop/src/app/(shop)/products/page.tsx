'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Filter,
  X,
  ChevronDown,
  Grid3X3,
  LayoutList,
  SlidersHorizontal,
  Loader2
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string;
  nameBg: string;
  nameEn: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  images: string;
  category: {
    id: string;
    nameBg: string;
    slug: string;
  };
}

interface Category {
  id: string;
  nameBg: string;
  slug: string;
  _count: {
    products: number;
  };
}

const sortOptions = [
  { label: 'Най-нови', value: 'newest' },
  { label: 'Цена: ниска към висока', value: 'price-asc' },
  { label: 'Цена: висока към ниска', value: 'price-desc' },
  { label: 'Име: А-Я', value: 'name-asc' },
];

const priceRanges = [
  { label: 'До 50 лв.', min: 0, max: 50 },
  { label: '50 - 100 лв.', min: 50, max: 100 },
  { label: '100 - 200 лв.', min: 100, max: 200 },
  { label: 'Над 200 лв.', min: 200, max: Infinity },
];

function ProductsContent() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [showOnlySale, setShowOnlySale] = useState(searchParams.get('sale') === 'true');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const query = searchParams.get('q');
        const productsUrl = query ? `/api/products?q=${encodeURIComponent(query)}` : '/api/products';

        const [productsRes, categoriesRes] = await Promise.all([
          fetch(productsUrl),
          fetch('/api/categories')
        ]);

        if (!productsRes.ok || !categoriesRes.ok) {
          throw new Error('Грешка при зареждане на данните');
        }

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(productsData);
        setCategories(categoriesData);
        setSearchQuery(query || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Грешка при зареждане');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory) {
      result = result.filter(p => p.category?.slug === selectedCategory);
    }

    // Filter by price range
    if (selectedPriceRange !== null) {
      const range = priceRanges[selectedPriceRange];
      result = result.filter(p => p.price >= range.min && p.price < range.max);
    }

    // Filter by sale
    if (showOnlySale) {
      result = result.filter(p => p.oldPrice !== null);
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.nameBg.localeCompare(b.nameBg, 'bg'));
        break;
      default:
        // newest - keep original order (already sorted by createdAt desc from API)
        break;
    }

    return result;
  }, [products, selectedCategory, selectedPriceRange, sortBy, showOnlySale]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedPriceRange(null);
    setShowOnlySale(false);
  };

  const hasActiveFilters = selectedCategory || selectedPriceRange !== null || showOnlySale;

  // Build categories list with "All" option
  const categoryOptions = useMemo(() => {
    return [
      { name: 'Всички', slug: '' },
      ...categories.map(c => ({ name: c.nameBg, slug: c.slug }))
    ];
  }, [categories]);

  const FilterSidebar = ({ mobile = false }) => (
    <div className={mobile ? '' : 'hidden lg:block w-64 flex-shrink-0'}>
      <div className="card p-4 sticky top-24">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Филтри</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-[var(--primary)] hover:underline"
            >
              Изчисти
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Категория</h4>
          <div className="space-y-1">
            {categoryOptions.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === cat.slug
                    ? 'bg-[var(--primary)] text-white'
                    : 'hover:bg-[var(--card-hover)]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Price range */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Цена</h4>
          <div className="space-y-1">
            {priceRanges.map((range, index) => (
              <button
                key={index}
                onClick={() => setSelectedPriceRange(selectedPriceRange === index ? null : index)}
                className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedPriceRange === index
                    ? 'bg-[var(--primary)] text-white'
                    : 'hover:bg-[var(--card-hover)]'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sale only */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlySale}
              onChange={(e) => setShowOnlySale(e.target.checked)}
              className="w-5 h-5 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
            />
            <span>Само намалени</span>
          </label>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container-custom py-6 md:py-8">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
          <span className="ml-2">Зареждане...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-6 md:py-8">
        <div className="text-center py-16">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary mt-4"
          >
            Опитай отново
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-6 md:py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 mb-4">
        <a href="/" className="hover:text-[var(--primary)]">Начало</a>
        <span className="mx-2">/</span>
        <span className="text-slate-800">Продукти</span>
      </nav>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <FilterSidebar />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                {searchQuery
                  ? `Резултати за "${searchQuery}"`
                  : selectedCategory
                  ? categoryOptions.find(c => c.slug === selectedCategory)?.name
                  : 'Всички продукти'}
              </h1>
              <p className="text-slate-500 mt-1">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'продукт' : 'продукта'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile filter button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden btn btn-outline btn-sm"
              >
                <SlidersHorizontal size={18} />
                Филтри
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-[var(--primary)] rounded-full" />
                )}
              </button>

              {/* Sort dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input py-2 pl-3 pr-10 text-sm appearance-none cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"
                />
              </div>

              {/* View mode toggle */}
              <div className="hidden sm:flex items-center border border-[var(--border)] rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-[var(--primary)] text-white' : 'hover:bg-[var(--card-hover)]'}`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-[var(--primary)] text-white' : 'hover:bg-[var(--card-hover)]'}`}
                >
                  <LayoutList size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Active filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-sm text-slate-500">Активни филтри:</span>

              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory('')}
                  className="badge badge-primary flex items-center gap-1"
                >
                  {categoryOptions.find(c => c.slug === selectedCategory)?.name}
                  <X size={14} />
                </button>
              )}

              {selectedPriceRange !== null && (
                <button
                  onClick={() => setSelectedPriceRange(null)}
                  className="badge badge-primary flex items-center gap-1"
                >
                  {priceRanges[selectedPriceRange].label}
                  <X size={14} />
                </button>
              )}

              {showOnlySale && (
                <button
                  onClick={() => setShowOnlySale(false)}
                  className="badge badge-primary flex items-center gap-1"
                >
                  Намалени
                  <X size={14} />
                </button>
              )}
            </div>
          )}

          {/* Products grid */}
          {filteredProducts.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6'
                : 'space-y-4'
            }>
              {filteredProducts.map((product) => {
                // Parse images
                let images: string[] = [];
                try {
                  images = JSON.parse(product.images || '[]');
                } catch {
                  images = [];
                }

                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.nameBg}
                    slug={product.slug}
                    price={product.price}
                    oldPrice={product.oldPrice}
                    stock={product.stock}
                    image={images[0] || '/images/placeholder.jpg'}
                    category={product.category?.nameBg || ''}
                    categorySlug={product.category?.slug || ''}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Filter size={64} className="mx-auto text-[var(--muted-light)] mb-4" />
              <h3 className="text-lg font-medium text-slate-800">
                Няма намерени продукти
              </h3>
              <p className="text-slate-500 mt-1">
                {products.length === 0
                  ? 'Все още няма добавени продукти'
                  : 'Опитайте да промените филтрите'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="btn btn-primary mt-4"
                >
                  Изчисти филтрите
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-[var(--background)] rounded-t-2xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="sticky top-0 bg-[var(--background)] border-b border-[var(--border)] p-4 flex items-center justify-between">
              <h3 className="font-bold text-lg">Филтри</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar mobile />
            </div>
            <div className="sticky bottom-0 bg-[var(--background)] border-t border-[var(--border)] p-4">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="btn btn-primary w-full"
              >
                Покажи {filteredProducts.length} продукта
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Loading skeleton for products
function ProductsLoading() {
  return (
    <div className="container-custom py-6 md:py-8">
      <div className="animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-32 mb-4" />
        <div className="flex gap-8">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="h-96 bg-slate-200 rounded-lg" />
          </div>
          <div className="flex-1">
            <div className="h-8 bg-slate-200 rounded w-48 mb-6" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square bg-slate-200 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  );
}
