import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { UserRole, LanguageCode, ProductItem, FarmerProduce, OrderRecord } from './types';
import { initialProducts } from './data/mockData';
import { MandiTicker } from './components/MandiTicker';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { WelcomeView } from './components/WelcomeView';
import { FarmerRegistration } from './components/FarmerRegistration';
import { BuyerRegistration } from './components/BuyerRegistration';
import { AuthLogin } from './components/AuthLogin';
import { BuyerStore } from './components/BuyerStore';
import { BuyerTracking } from './components/BuyerTracking';
import { FarmerDashboard } from './components/FarmerDashboard';
import { AddProduce } from './components/AddProduce';
import { DemandForecast } from './components/DemandForecast';
import { SellingRecommendation } from './components/SellingRecommendation';
import { BuyerMatching } from './components/BuyerMatching';
import { QuantityPooling } from './components/QuantityPooling';
import { PickupRoute } from './components/PickupRoute';
import { PriceTransparency } from './components/PriceTransparency';
import { OrdersView } from './components/OrdersView';
import { CartDrawer } from './components/CartDrawer';
import { JoinModal } from './components/JoinModal';
import { Toast } from './components/Toast';

export default function App() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [currentUser, setCurrentUser] = useState<{
    role: UserRole;
    name: string;
    farm: string;
    location: string;
    address: string;
  }>({
    role: 'guest',
    name: 'Guest',
    farm: 'Green Valley Organic Farm',
    location: 'Pune, Maharashtra',
    address: 'Ghaziabad, Uttar Pradesh'
  });

  const [currentTab, setCurrentTab] = useState<string>('view-welcome');
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [cart, setCart] = useState<Record<string, { product: ProductItem; qty: number }>>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [farmerProduce, setFarmerProduce] = useState<FarmerProduce>({
    crop: 'MP Sharbati Gehu',
    hindiName: 'शरबती गेहूं',
    qty: 500,
    price: 48,
    loc: 'Sehore, Madhya Pradesh',
    harvestDate: '2026-09-02',
    expiryDate: '2026-09-15'
  });

  const [orders, setOrders] = useState<OrderRecord[]>([
    {
      id: 'KD-4091',
      role: 'buyer',
      items: '1x MP Sharbati Gehu (1kg), 1x Desi Red Tomatoes (1kg)',
      total: 80,
      farmerPayout: 70,
      time: '10:14 AM',
      status: '🛵 Arriving in 11 mins',
      deliveryMinutes: 11,
      deliveryRider: {
        name: 'Vikas Shinde',
        vehicle: 'Electric EV Delivery Bike',
        rating: 4.9,
        phone: '+91 9876543210'
      }
    }
  ]);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinModalRole, setJoinModalRole] = useState<'buyer' | 'farmer'>('buyer');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Sync Dark Theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Cart total calculations
  const cartEntries = (Object.values(cart) as Array<{ product: ProductItem; qty: number }>).filter(item => item.qty > 0);
  const cartItemCount = cartEntries.reduce((acc: number, curr) => acc + curr.qty, 0);
  const cartTotal = cartEntries.reduce((acc: number, curr) => acc + curr.product.price * curr.qty, 0);

  const handleUpdateCart = (product: ProductItem, delta: number) => {
    setCart((prev) => {
      const currentQty = prev[product.id]?.qty || 0;
      const newQty = Math.max(0, currentQty + delta);
      if (newQty === 0) {
        const copy = { ...prev };
        delete copy[product.id];
        return copy;
      }
      return {
        ...prev,
        [product.id]: { product, qty: newQty }
      };
    });

    if (delta > 0) {
      showToast(`Added ${product.name} to basket`);
    }
  };

  const handleToggleFavorite = (product: ProductItem) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
        showToast(`Removed "${product.name}" from favorites`);
      } else {
        next.add(product.id);
        showToast(`Saved "${product.name}" to favorites! ❤️`);
      }
      return next;
    });
  };

  const handleOpenFavorites = () => {
    if (favorites.size === 0) {
      showToast("You haven't saved any crops yet. Click the ❤️ on any card!");
    } else {
      showToast(`You have ${favorites.size} saved harvest item(s)!`);
      setCurrentTab('view-buyer-store');
    }
  };

  const handleSelectRole = (role: 'buyer' | 'farmer') => {
    if (role === 'buyer') {
      setCurrentTab('view-buyer-reg');
    } else {
      setCurrentTab('view-farmer-reg');
    }
  };

  const handleSubmitFarmerReg = (data: { name: string; farm: string; location: string; phone: string }) => {
    setCurrentUser({
      role: 'farmer',
      name: data.name,
      farm: data.farm,
      location: data.location,
      address: data.location
    });
    setFarmerProduce(prev => ({ ...prev, loc: data.location }));
    showToast(`Welcome ${data.name}! Farmer dashboard is ready.`);
    setCurrentTab('view-farmer-dash');
  };

  const handleSubmitBuyerReg = (data: { name: string; address: string; phone: string }) => {
    setCurrentUser({
      role: 'buyer',
      name: data.name,
      farm: '',
      location: data.address,
      address: data.address
    });
    showToast(`Welcome ${data.name}! Fresh store is ready for 15-min delivery.`);
    setCurrentTab('view-buyer-store');
  };

  const handleLogin = (role: 'buyer' | 'farmer', name: string) => {
    if (role === 'farmer') {
      setCurrentUser({
        role: 'farmer',
        name,
        farm: 'Green Valley Organic Farm',
        location: 'Pune, Maharashtra',
        address: 'Pune, Maharashtra'
      });
      showToast(`Logged in as Farmer ${name}`);
      setCurrentTab('view-farmer-dash');
    } else {
      setCurrentUser({
        role: 'buyer',
        name,
        farm: '',
        location: 'Ghaziabad, Uttar Pradesh',
        address: 'Ghaziabad, Uttar Pradesh'
      });
      showToast(`Logged in as Buyer ${name}`);
      setCurrentTab('view-buyer-store');
    }
  };

  const handleLogout = () => {
    setCurrentUser({
      role: 'guest',
      name: 'Guest',
      farm: '',
      location: '',
      address: ''
    });
    showToast('Logged out successfully');
    setCurrentTab('view-welcome');
  };

  const handleOpenJoinModal = (role?: 'buyer' | 'farmer') => {
    setJoinModalRole(role || 'buyer');
    setIsJoinModalOpen(true);
  };

  const handleConfirmJoin = (role: 'buyer' | 'farmer', name: string) => {
    setIsJoinModalOpen(false);
    handleLogin(role, name);
  };

  const handleCheckout = (appliedDiscount: number) => {
    const orderId = `KD-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsSummary = cartEntries.map(e => `${e.qty}x ${e.product.name}`).join(', ');
    const discountFactor = appliedDiscount > 0 ? (100 - appliedDiscount) / 100 : 1;
    const finalTotal = Math.round(cartTotal * discountFactor);
    const farmerCut = Math.round(finalTotal * 0.88);

    const newOrder: OrderRecord = {
      id: orderId,
      role: 'buyer',
      items: itemsSummary,
      total: finalTotal,
      farmerPayout: farmerCut,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: '🛵 Arriving in 15 mins',
      deliveryMinutes: 15,
      deliveryRider: {
        name: 'Vikas Shinde',
        vehicle: 'Electric EV Delivery Bike',
        rating: 4.9,
        phone: '+91 9876543210'
      }
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart({});
    setIsCartOpen(false);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch(e) {}

    showToast(`🎉 Order #${orderId} placed! 15-min delivery dispatched.`);
    setCurrentTab('view-buyer-tracking');
  };

  const handleAddProduceSubmit = (newProduce: FarmerProduce) => {
    setFarmerProduce(newProduce);

    // Publish the farmer's produce as a buyer-store listing.
    // This keeps the existing initial products and adds the new farmer listing.
    const cropName = newProduce.crop.trim() || 'Fresh Farm Produce';

    const normalizedCrop = cropName.toLowerCase();

    const category: ProductItem['category'] =
      normalizedCrop.includes('wheat') ||
      normalizedCrop.includes('gehu') ||
      normalizedCrop.includes('rice') ||
      normalizedCrop.includes('chawal') ||
      normalizedCrop.includes('bajra') ||
      normalizedCrop.includes('millet') ||
      normalizedCrop.includes('gram') ||
      normalizedCrop.includes('chana') ||
      normalizedCrop.includes('dal')
        ? 'grains'
        : normalizedCrop.includes('spinach') ||
          normalizedCrop.includes('methi') ||
          normalizedCrop.includes('coriander') ||
          normalizedCrop.includes('palak')
        ? 'leafy'
        : normalizedCrop.includes('mango') ||
          normalizedCrop.includes('apple') ||
          normalizedCrop.includes('banana') ||
          normalizedCrop.includes('fruit')
        ? 'fruits'
        : normalizedCrop.includes('milk') ||
          normalizedCrop.includes('dairy')
        ? 'dairy'
        : 'veggies';

    const farmerListing: ProductItem = {
      id: `farmer-${Date.now()}`,
      name: cropName,
      hindiName: newProduce.hindiName || cropName,
      category,
      price: Number(newProduce.price) || 0,
      originalPrice: Math.round((Number(newProduce.price) || 0) * 1.15),
      unit: '1 kg Pack',
      image:
        category === 'grains'
          ? 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80'
          : category === 'fruits'
          ? 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop&q=80'
          : category === 'dairy'
          ? 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
      farm: currentUser.farm || 'Local Farmer',
      location: newProduce.loc || currentUser.location || 'India',
      tags: ['Direct Farmer', 'Fresh Harvest'],
      searchKeywords:
        `${cropName} ${newProduce.hindiName || ''} fresh farmer direct harvest`.toLowerCase(),
      inStock: Number(newProduce.qty) > 0,
      harvestTime: 'Recently Listed',
      farmerName: currentUser.name || 'Local Farmer',
      farmerRating: 5
    };

    setProducts(prev => [farmerListing, ...prev]);

    showToast(`✓ ${newProduce.qty} KG ${newProduce.crop} listed for buyers!`);
    setCurrentTab('view-demand-forecast');
  };

  const handleNavigateHome = () => {
    if (currentUser.role === 'farmer') {
      setCurrentTab('view-farmer-dash');
    } else if (currentUser.role === 'buyer') {
      setCurrentTab('view-buyer-store');
    } else {
      setCurrentTab('view-welcome');
    }
  };

  const handleCopyCoupon = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    showToast(`✓ Code "${code}" copied! Use at checkout for 15% off.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf8ef] dark:bg-[#0d1a13] text-[#1f3427] dark:text-[#f4f8f5] transition-colors duration-200">
      
      {/* Top Mandi Rates Marquee */}
      <MandiTicker />

      {/* Main Top Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        currentUser={currentUser}
        cartItemCount={cartItemCount}
        cartTotal={cartTotal}
        favoriteCount={favorites.size}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(prev => !prev)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenJoinModal={handleOpenJoinModal}
        onOpenFavorites={handleOpenFavorites}
        onLogout={handleLogout}
        onNavigateHome={handleNavigateHome}
        onNavigateTab={setCurrentTab}
      />

      {/* App Shell Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          currentUser={currentUser}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl overflow-hidden">
          
          {/* Welcome View */}
          {currentTab === 'view-welcome' && (
            <WelcomeView
              currentLang={currentLang}
              onLanguageChange={setCurrentLang}
              onSelectRole={handleSelectRole}
              onNavigateTab={setCurrentTab}
              onCopyCoupon={handleCopyCoupon}
            />
          )}

          {/* Farmer Registration */}
          {currentTab === 'view-farmer-reg' && (
            <FarmerRegistration
              currentLang={currentLang}
              onLanguageChange={setCurrentLang}
              onSubmitFarmer={handleSubmitFarmerReg}
              onBack={() => setCurrentTab('view-welcome')}
            />
          )}

          {/* Buyer Registration */}
          {currentTab === 'view-buyer-reg' && (
            <BuyerRegistration
              currentLang={currentLang}
              onLanguageChange={setCurrentLang}
              onSubmitBuyer={handleSubmitBuyerReg}
              onBack={() => setCurrentTab('view-welcome')}
            />
          )}

          {/* Auth Login */}
          {currentTab === 'view-auth' && (
            <AuthLogin
              onLogin={handleLogin}
              onBack={() => setCurrentTab('view-welcome')}
            />
          )}

          {/* Buyer Fresh Store */}
          {currentTab === 'view-buyer-store' && (
            <BuyerStore
              products={products}
              cart={cart}
              favorites={favorites}
              buyerAddress={currentUser.address}
              onUpdateCart={handleUpdateCart}
              onToggleFavorite={handleToggleFavorite}
              onNavigateTab={setCurrentTab}
            />
          )}

          {/* Buyer Live Tracking */}
          {currentTab === 'view-buyer-tracking' && (
            <BuyerTracking
              latestOrder={orders[0] || null}
              onNavigateStore={() => setCurrentTab('view-buyer-store')}
            />
          )}

          {/* Farmer Portal: Dashboard */}
          {currentTab === 'view-farmer-dash' && (
            <FarmerDashboard
              farmerName={currentUser.name}
              farmName={currentUser.farm}
              farmerLoc={currentUser.location}
              produce={farmerProduce}
              onNavigateTab={setCurrentTab}
            />
          )}

          {/* Farmer Portal: Add Produce */}
          {currentTab === 'view-add-produce' && (
            <AddProduce
              initialProduce={farmerProduce}
              onSubmitProduce={handleAddProduceSubmit}
              onBack={() => setCurrentTab('view-farmer-dash')}
            />
          )}

          {/* Farmer Portal: AI Demand Forecast */}
          {currentTab === 'view-demand-forecast' && (
            <DemandForecast
              produce={farmerProduce}
              onNext={() => setCurrentTab('view-selling-rec')}
              onBack={() => setCurrentTab('view-add-produce')}
            />
          )}

          {/* Farmer Portal: Selling Recommendation */}
          {currentTab === 'view-selling-rec' && (
            <SellingRecommendation
              produce={farmerProduce}
              onNext={() => setCurrentTab('view-matching')}
              onBack={() => setCurrentTab('view-demand-forecast')}
            />
          )}

          {/* Farmer Portal: Buyer Matching */}
          {currentTab === 'view-matching' && (
            <BuyerMatching
              farmerName={currentUser.name}
              produce={farmerProduce}
              onNext={() => setCurrentTab('view-pooling')}
              onBack={() => setCurrentTab('view-selling-rec')}
            />
          )}

          {/* Farmer Portal: Quantity Pooling */}
          {currentTab === 'view-pooling' && (
            <QuantityPooling
              farmerName={currentUser.name}
              produce={farmerProduce}
              onNext={() => setCurrentTab('view-route')}
              onBack={() => setCurrentTab('view-matching')}
            />
          )}

          {/* Farmer Portal: EV Pickup Route */}
          {currentTab === 'view-route' && (
            <PickupRoute
              farmerName={currentUser.name}
              produce={farmerProduce}
              onNext={() => setCurrentTab('view-transparency')}
              onBack={() => setCurrentTab('view-pooling')}
            />
          )}

          {/* Farmer Portal: Price Transparency */}
          {currentTab === 'view-transparency' && (
            <PriceTransparency
              produce={farmerProduce}
              onNext={() => setCurrentTab('view-orders')}
              onBack={() => setCurrentTab('view-route')}
            />
          )}

          {/* Orders & Batches View */}
          {currentTab === 'view-orders' && (
            <OrdersView
              userRole={currentUser.role}
              orders={orders}
              farmerProduce={farmerProduce}
              onNavigateStore={() => setCurrentTab('view-buyer-store')}
            />
          )}

        </main>
      </div>

      {/* Floating Bottom Cart Bar for mobile & fast checkout */}
      {currentUser.role === 'buyer' && cartItemCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-lg bg-[#1e5634] text-white p-3 sm:p-4 rounded-2xl shadow-2xl z-40 flex items-center justify-between gap-3 animate-slideUp border border-[#3b7e54]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f7c244] text-[#1f3427] flex items-center justify-center font-bold text-base">
              🛒
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold">
                {cartItemCount} Item{cartItemCount > 1 ? 's' : ''} • ₹{cartTotal}
              </div>
              <div className="text-[10px] text-white/80">
                ⚡ 15-Min Express Doorstep Delivery
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#f7c244] hover:bg-[#e6b338] text-[#1f3427] text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            View Basket →
          </button>
        </div>
      )}

      {/* Cart Flyout Drawer — Buyer only */}
      {currentUser.role === 'buyer' && (
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onUpdateCart={handleUpdateCart}
          onCheckout={handleCheckout}
        />
      )}

      {/* Quick Join / Signup Modal */}
      <JoinModal
        isOpen={isJoinModalOpen}
        initialRole={joinModalRole}
        onClose={() => setIsJoinModalOpen(false)}
        onConfirmJoin={handleConfirmJoin}
      />

      {/* Toast Feedback */}
      <Toast message={toastMsg} />

    </div>
  );
}
