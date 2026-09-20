import React, { useState, useMemo, useEffect } from 'react';
import { apiFetch } from '../lib/api';
import {
  Search,
  Zap,
  MapPin,
  Heart,
  Plus,
  Minus,
  Wheat,
  Clock
} from 'lucide-react';
import { ProductItem, ProductCategory } from '../types';

interface BuyerStoreProps {
  products: ProductItem[];
  cart: Record<string, { qty: number }>;
  favorites: Set<string>;
  buyerAddress: string;
  onUpdateCart: (product: ProductItem, delta: number) => void;
  onToggleFavorite: (product: ProductItem) => void;
  onNavigateTab: (tabId: string) => void;
}

export const BuyerStore: React.FC<BuyerStoreProps> = ({
  products,
  cart,
  favorites,
  buyerAddress,
  onUpdateCart,
  onToggleFavorite
}) => {
  const [selectedCat, setSelectedCat] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mandiPrices, setMandiPrices] = useState<Record<string, number | null>>({});
  const [mandiLoading, setMandiLoading] = useState(true);

  const [pricePopup, setPricePopup] = useState<{
    productName: string;
    loading: boolean;
    data: any | null;
    error: string;
  } | null>(null);

  const getMandiCropName = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('tomato')) return 'tomato';
    if (n.includes('onion')) return 'onion';
    if (n.includes('potato')) return 'potato';
    if (n.includes('wheat') || n.includes('gehu')) return 'wheat';
    if (n.includes('rice') || n.includes('basmati') || n.includes('paddy')) return 'rice';
    if (n.includes('gram') || n.includes('chana')) return 'gram';
    if (n.includes('bajra')) return 'bajra';
    if (n.includes('bhindi') || n.includes('ladies finger')) return 'bhindi';
    if (n.includes('carrot')) return 'carrot';
    if (n.includes('pea')) return 'peas';
    if (n.includes('capsicum')) return 'capsicum';
    if (n.includes('bottle gourd') || n.includes('lauki')) return 'bottle gourd';
    if (n.includes('brinjal') || n.includes('baingan')) return 'brinjal';
    if (n.includes('cucumber') || n.includes('kheera')) return 'cucumber';
    if (n.includes('cauliflower') || n.includes('phoolgobhi')) return 'cauliflower';
    if (n.includes('spinach') || n.includes('palak')) return 'spinach';
    if (n.includes('methi')) return 'methi';
    if (n.includes('coriander') || n.includes('dhaniya')) return 'coriander';
    if (n.includes('mango') || n.includes('aam')) return 'mango';
    if (n.includes('milk') || n.includes('doodh')) return 'milk';
    if (n.includes('garlic') || n.includes('lahsun') || n.includes('lehsan')) return 'garlic';
    return name;
  };

  useEffect(() => {
    let cancelled = false;

    const loadMandiPrices = async () => {
      setMandiLoading(true);
      const nextPrices: Record<string, number | null> = {};

      try {
        await Promise.all(
          products.map(async (product) => {
            const crop = getMandiCropName(product.name);

            if (crop === 'milk') {
              nextPrices[product.id] = null;
              return;
            }

            try {
              const response = await apiFetch(
                `/api/market-summary?crop=${encodeURIComponent(crop)}`,
                {},
                20000
              );

              const result = await response.json();

              if (
                response.ok &&
                result?.success === true &&
                result?.isDemoData === false
              ) {
                const value = Number(result?.averageModalPricePerKg);

                if (Number.isFinite(value) && value > 0) {
                  nextPrices[product.id] = value;
                  return;
                }
              }

              nextPrices[product.id] = null;
            } catch {
              nextPrices[product.id] = null;
            }
          })
        );
      } catch {
        products.forEach((product) => {
          if (!(product.id in nextPrices)) {
            nextPrices[product.id] = null;
          }
        });
      }

      if (!cancelled) {
        setMandiPrices(nextPrices);
        setMandiLoading(false);
      }
    };

    if (products.length > 0) {
      loadMandiPrices();
    } else {
      setMandiLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [products]);

  const openPricePopup = async (productName: string) => {
    setPricePopup({ productName, loading: true, data: null, error: '' });

    try {
      const crop = getMandiCropName(productName);
      const response = await apiFetch(
        `/api/price-comparison?crop=${encodeURIComponent(crop)}`
      );
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || 'Historical mandi price data is not available.'
        );
      }

      setPricePopup({
        productName,
        loading: false,
        data: result,
        error: ''
      });
    } catch (error: any) {
      setPricePopup({
        productName,
        loading: false,
        data: null,
        error:
          error?.message ||
          'Unable to load mandi price data.'
      });
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCat =
        selectedCat === 'all' || item.category === selectedCat;

      const q = searchQuery.toLowerCase().trim();

      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.hindiName.toLowerCase().includes(q) ||
        item.farm.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.searchKeywords.toLowerCase().includes(q);

      return matchesCat && matchesQuery;
    });
  }, [products, selectedCat, searchQuery]);

  const categories: {
    id: ProductCategory;
    label: string;
    icon: string;
  }[] = [
    { id: 'all', label: 'All Harvests', icon: '🌾' },
    { id: 'grains', label: 'Grains & Anaj (अनाज)', icon: '🥖' },
    { id: 'veggies', label: 'Fresh Vegetables', icon: '🥦' },
    { id: 'leafy', label: 'Leafy Greens', icon: '🥬' },
    { id: 'fruits', label: 'Farm Fruits', icon: '🍎' },
    { id: 'dairy', label: 'Pure A2 Dairy', icon: '🥛' },
    { id: 'spices', label: 'Fresh Spices', icon: '🧄' }
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-[#1e5634] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-[#1e5634]/15 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f7c244] text-[#1f3427] text-xs font-black tracking-wider uppercase">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>15 MIN EXPRESS FARM DELIVERY</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Apna Anaj • Pure Farm Harvests
          </h1>

          <p className="text-xs sm:text-sm text-white/90 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#f7c244]" />
            <span>
              Delivering to:{' '}
              <strong className="text-[#f7c244]">
                {buyerAddress || 'Ghaziabad, Uttar Pradesh'}
              </strong>
            </span>
          </p>
        </div>

        <div className="z-10 p-3 sm:p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-right shrink-0">
          <div className="text-xs font-bold text-[#f7c244] uppercase tracking-wider">
            88% DIRECT FARMER PAYOUT
          </div>
          <div className="text-[11px] text-white/90">
            0% middleman cuts • Fair rural livelihood
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#5e7164] dark:text-[#9ab0a2]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search grains, crops, farmers (गेहूं, चावल, दाल, टमाटर, प्याज, आलू, पालक, बाजरा, चना...)"
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-[#15271e] border border-[#e5dec9] dark:border-[#223f30] text-sm text-[#1f3427] dark:text-[#f4f8f5] shadow-sm focus:outline-none focus:border-[#1e5634] transition-colors"
        />

        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#5e7164] hover:text-[#1e5634] cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedCat === cat.id
                ? 'bg-[#1e5634] text-white shadow-sm scale-105'
                : 'bg-white dark:bg-[#15271e] text-[#5e7164] dark:text-[#9ab0a2] border border-[#e5dec9] dark:border-[#223f30] hover:border-[#1e5634] hover:text-[#1e5634]'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-white dark:bg-[#15271e] border border-[#e5dec9] dark:border-[#223f30]">
          <Wheat className="w-12 h-12 text-[#5e7164] mx-auto mb-3 opacity-50" />
          <h3 className="font-heading text-lg font-bold text-[#1f3427] dark:text-[#f4f8f5]">
            No crops match "{searchQuery}"
          </h3>
          <p className="text-xs text-[#5e7164] dark:text-[#9ab0a2] mt-1">
            Try searching for Gehu, Rice, Chana, Bajra, Tomato or Palak
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCat('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#1e5634] text-white text-xs font-bold cursor-pointer"
          >
            View All Farm Harvests
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((prod) => {
            const currentQty = cart[prod.id]?.qty || 0;
            const isFav = favorites.has(prod.id);
            const mandiPrice = mandiPrices[prod.id];
            const isMandiAvailable =
              typeof mandiPrice === 'number' &&
              Number.isFinite(mandiPrice);

            const displayedPrice = isMandiAvailable
              ? mandiPrice
              : prod.price;

            const pricedProduct = isMandiAvailable
              ? { ...prod, price: mandiPrice }
              : prod;

            return (
              <div
                key={prod.id}
                className="group flex flex-col justify-between rounded-2xl bg-white dark:bg-[#15271e] border border-[#e5dec9] dark:border-[#223f30] hover:border-[#1e5634] hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden"
              >
                <div className="relative h-44 w-full bg-[#e4f1cd] dark:bg-[#163824] overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {mandiLoading && (
                    <div
                      className="pointer-events-none absolute inset-0 skeleton"
                      aria-hidden="true"
                    />
                  )}

                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-md text-white text-[10px] font-extrabold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#f7c244]" />
                    <span>{prod.farm}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleFavorite(prod)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-[#15271e]/90 text-[#5e7164] hover:text-[#f28b47] hover:scale-110 transition-all flex items-center justify-center shadow-sm cursor-pointer"
                    title="Save to favorites"
                    aria-label="Save crop"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFav ? 'fill-[#f28b47] text-[#f28b47]' : ''
                      }`}
                    />
                  </button>

                  <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded bg-white/90 dark:bg-[#15271e]/90 text-[10px] font-bold text-[#1e5634] dark:text-[#4ade80] flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{prod.harvestTime}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-sm text-[#1f3427] dark:text-[#f4f8f5] leading-snug">
                      {prod.name}
                    </h3>

                    <div className="text-[11px] font-semibold text-[#1e5634] dark:text-[#4ade80] mt-0.5">
                      {prod.hindiName}
                    </div>

                    <div className="text-[11px] text-[#5e7164] dark:text-[#9ab0a2] mt-1">
                      {prod.location} • {prod.unit}
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {prod.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#e4f1cd] dark:bg-[#163824] text-[#1e5634] dark:text-[#4ade80]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#e5dec9]/60 dark:border-[#223f30] flex items-center justify-between">
                    <div>
                      <div className="font-heading font-bold text-lg text-[#1e5634] dark:text-[#4ade80] leading-none">
                        {mandiLoading ? (
                          <span
                            className="inline-block h-5 w-20 rounded-md skeleton align-middle"
                            aria-label="Loading price"
                          />
                        ) : (
                          <>
                            ₹{displayedPrice.toFixed(2)}
                            <span className="text-[10px] font-normal ml-1">
                              /kg
                            </span>
                          </>
                        )}
                      </div>

                      <div className="text-[9px] font-extrabold uppercase text-[#f28b47] tracking-wider mt-0.5">
                        {isMandiAvailable
                          ? `Government Mandi Rate • Farmer Gets (88%): ₹${(
                              mandiPrice * 0.88
                            ).toFixed(2)}/kg`
                          : `Demo Rate • Government rate unavailable • Farmer Gets (88%): ₹${(
                              prod.price * 0.88
                            ).toFixed(2)}/kg`}
                      </div>
                    </div>

                    {currentQty === 0 ? (
                      <button
                        onClick={() => onUpdateCart(pricedProduct, 1)}
                        className={`flex items-center gap-1 px-3.5 py-1.5 rounded-lg border-1.5 border-[#1e5634] bg-white dark:bg-[#15271e] text-[#1e5634] dark:text-[#4ade80] hover:bg-[#1e5634] hover:text-white text-xs font-bold shadow-sm transition-all ${
                          isMandiAvailable
                            ? 'cursor-pointer'
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                        disabled={!isMandiAvailable}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>ADD</span>
                      </button>
                    ) : (
                      <div className="flex items-center bg-[#1e5634] text-white rounded-lg p-0.5 shadow-sm">
                        <button
                          onClick={() => onUpdateCart(pricedProduct, -1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-black/20 rounded cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openPricePopup(prod.name)}
                          className="px-2 text-xs font-bold min-w-[20px] text-center hover:text-[#f7c244] transition-colors cursor-pointer"
                          title="View mandi price comparison"
                          aria-label={`View mandi price comparison for ${prod.name}`}
                        >
                          {currentQty}
                        </button>

                        <button
                          onClick={() => onUpdateCart(pricedProduct, 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-black/20 rounded cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pricePopup && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setPricePopup(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#15271e] border border-[#e5dec9] dark:border-[#223f30] shadow-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#5e7164] dark:text-[#9ab0a2]">
                  Government Mandi Price
                </p>
                <h3 className="font-heading text-lg font-bold text-[#1f3427] dark:text-white mt-0.5">
                  {pricePopup.productName}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setPricePopup(null)}
                className="w-7 h-7 rounded-full bg-[#eef3ec] dark:bg-[#223f30] text-[#5e7164] dark:text-[#9ab0a2] font-bold cursor-pointer"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {pricePopup.loading ? (
              <div className="py-8 text-center text-sm text-[#5e7164] dark:text-[#9ab0a2]">
                Loading government mandi data...
              </div>
            ) : pricePopup.data ? (
              <div className="mt-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#eef6e8] dark:bg-[#163824] p-3">
                    <div className="text-[10px] font-bold text-[#5e7164] dark:text-[#9ab0a2]">
                      CURRENT
                    </div>
                    <div className="text-xl font-black text-[#1e5634] dark:text-[#4ade80] mt-1">
                      ₹{pricePopup.data.currentPricePerKg}/kg
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#f7f1e4] dark:bg-[#2a3026] p-3">
                    <div className="text-[10px] font-bold text-[#5e7164] dark:text-[#9ab0a2]">
                      LAST MONTH
                    </div>
                    <div className="text-xl font-black text-[#1f3427] dark:text-white mt-1">
                      ₹{pricePopup.data.lastMonthPricePerKg}/kg
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-[#e5dec9] dark:border-[#223f30] p-3 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-[#5e7164] dark:text-[#9ab0a2]">
                      PRICE CHANGE
                    </div>
                    <div className="text-sm font-bold text-[#1f3427] dark:text-white mt-1">
                      {pricePopup.data.changePercent > 0 ? '+' : ''}
                      {pricePopup.data.changePercent}%
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black ${
                      pricePopup.data.priceLevel === 'HIGH'
                        ? 'bg-[#fee2e2] text-[#b91c1c]'
                        : pricePopup.data.priceLevel === 'LOW'
                        ? 'bg-[#dcfce7] text-[#166534]'
                        : 'bg-[#fef3c7] text-[#92400e]'
                    }`}
                  >
                    {pricePopup.data.priceLevel}
                  </span>
                </div>

                <div className="text-[10px] leading-relaxed text-[#6b7b70] dark:text-[#9ab0a2]">
                  Source: Government of India – AGMARKNET
                  <br />
                  Current date: {pricePopup.data.currentDate}
                  <br />
                  Comparison date: {pricePopup.data.lastMonthDate}
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-xl bg-[#fff7ed] dark:bg-[#2b241b] border border-[#fed7aa] p-4">
                <p className="text-sm font-semibold text-[#9a3412] dark:text-[#fdba74]">
                  Mandi comparison unavailable
                </p>
                <p className="text-xs text-[#9a3412]/80 dark:text-[#fdba74]/80 mt-1">
                  {pricePopup.error}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
