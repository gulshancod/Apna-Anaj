import React, { useState, useEffect } from 'react';
import { translations } from './data/translations';
import { GlobalLanguage } from './components/GlobalLanguage';
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
import { WorkflowStepper } from './components/WorkflowStepper';
import { MobileNav } from './components/MobileNav';
import { getCurrentUser, loginUser, logoutUser, registerUser } from './lib/auth';
import { AIAssistant } from './components/AIAssistant';

export default function App() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('apnaAnajLanguage') as LanguageCode | null;
    return saved && saved in translations ? saved : 'en';
  });
  const [currentUser, setCurrentUser] = useState<{
    role: UserRole;
    name: string;
    farm: string;
    location: string;
    address: string;
  }>({
    role: 'guest',
    name: '',
    farm: '',
    location: '',
    address: ''
  });

  const [currentTab, setCurrentTab] = useState<string>('view-welcome');
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [cart, setCart] = useState<Record<string, { product: ProductItem; qty: number }>>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [farmerProduce, setFarmerProduce] = useState<FarmerProduce>({
    crop: '',
    hindiName: '',
    qty: 0,
    price: 0,
    loc: '',
    harvestDate: '',
    expiryDate: ''
  });

  const [orders, setOrders] = useState<OrderRecord[]>([]);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinModalRole, setJoinModalRole] = useState<'buyer' | 'farmer'>('buyer');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Sync Dark Theme
  useEffect(() => {
    localStorage.setItem('apnaAnajLanguage', currentLang);
  }, [currentLang]);

  useEffect(() => {
    document.documentElement.lang = currentLang === 'hi' ? 'hi' : currentLang === 'pa' ? 'pa' : currentLang === 'bn' ? 'bn' : currentLang === 'gu' ? 'gu' : currentLang === 'mr' ? 'mr' : currentLang === 'te' ? 'te' : currentLang === 'ta' ? 'ta' : currentLang === 'kn' ? 'kn' : 'en';
  }, [currentLang]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    let cancelled = false;

    getCurrentUser().then((user) => {
      if (cancelled || !user) return;

      setCurrentUser({
        role: user.role,
        name: user.name,
        farm: user.farm,
        location: user.location,
        address: user.address
      });
      setCurrentTab(user.role === 'farmer' ? 'view-farmer-dash' : 'view-buyer-store');
    });

    return () => {
      cancelled = true;
    };
  }, []);

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
      const previous = prev[product.id];
      const currentQty = previous?.qty || 0;
      const newQty = Math.max(0, currentQty + delta);

      if (newQty === 0) {
        const copy = { ...prev };
        delete copy[product.id];
        return copy;
      }

      return {
        ...prev,
        [product.id]: {
          product: previous?.product || product,
          qty: newQty
        }
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

  const handleSubmitFarmerReg = (data: {
    name: string;
    farm: string;
    location: string;
    phone: string;
    password: string;
  }) => {
    void registerUser({
      role: 'farmer',
      name: data.name,
      phone: data.phone,
      password: data.password,
      farm: data.farm,
      location: data.location,
      address: data.location
    })
      .then((user) => {
        setCurrentUser({
          role: user.role,
          name: user.name,
          farm: user.farm,
          location: user.location,
          address: user.address
        });
        setFarmerProduce(prev => ({ ...prev, loc: data.location }));
        showToast(`Welcome ${user.name}! Your farmer account is ready.`);
        setCurrentTab('view-farmer-dash');
      })
      .catch((error) => {
        showToast(error instanceof Error ? error.message : 'Registration failed.');
      });
  };

  const handleSubmitBuyerReg = (data: {
    name: string;
    address: string;
    phone: string;
    password: string;
  }) => {
    void registerUser({
      role: 'buyer',
      name: data.name,
      phone: data.phone,
      password: data.password,
      address: data.address,
      location: data.address
    })
      .then((user) => {
        setCurrentUser({
          role: user.role,
          name: user.name,
          farm: user.farm,
          location: user.location,
          address: user.address
        });
        showToast(`Welcome ${user.name}! Your fresh store is ready.`);
        setCurrentTab('view-buyer-store');
      })
      .catch((error) => {
        showToast(error instanceof Error ? error.message : 'Registration failed.');
      });
  };

  const handleLogin = async (
    role: 'buyer' | 'farmer',
    identifier: string,
    password: string
  ) => {
    const user = await loginUser(role, identifier, password);

    setCurrentUser({
      role: user.role,
      name: user.name,
      farm: user.farm,
      location: user.location,
      address: user.address
    });

    showToast(`Welcome back, ${user.name}!`);
    setCurrentTab(user.role === 'farmer' ? 'view-farmer-dash' : 'view-buyer-store');
  };

  const handleLogout = () => {
    void logoutUser();
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

  const handleConfirmJoin = (
    role: 'buyer' | 'farmer',
    name: string,
    phone: string,
    password: string
  ) => {
    void registerUser({
      role,
      name,
      phone,
      password,
      farm: role === 'farmer' ? '' : undefined,
      location: '',
      address: ''
    })
      .then((user) => {
        setIsJoinModalOpen(false);
        setCurrentUser({
          role: user.role,
          name: user.name,
          farm: user.farm,
          location: user.location,
          address: user.address
        });
        showToast(`Welcome ${user.name}! Your account is ready.`);
        setCurrentTab(user.role === 'farmer' ? 'view-farmer-dash' : 'view-buyer-store');
      })
      .catch((error) => {
        showToast(error instanceof Error ? error.message : 'Unable to create account.');
      });
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

  const getFarmerWorkflowStep = () => {
    switch (currentTab) {
      case 'view-add-produce': return 1;
      case 'view-demand-forecast': return 2;
      case 'view-selling-rec': return 3;
      case 'view-matching': return 4;
      case 'view-pooling': return 5;
      case 'view-route': return 6;
      case 'view-transparency':
      case 'view-orders': return 7;
      case 'view-farmer-dash':
      default: return 0;
    }
  };

  const handleCopyCoupon = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    showToast(`✓ Code "${code}" copied! Use at checkout for 15% off.`);
  };

  return (
    <>
      <GlobalLanguage currentLang={currentLang} />
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
      <div className="flex-1 flex w-full min-w-0">
        
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          currentUser={currentUser}
        />

        {/* Main Content Area */}
        <main className="min-w-0 flex-1 w-full px-4 py-5 pb-24 sm:px-6 sm:py-6 md:pb-8 lg:px-8 xl:px-10 lg:py-9 overflow-hidden">
          
          {currentUser.role === 'farmer' && (
            <WorkflowStepper currentStep={getFarmerWorkflowStep()} />
          )}

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

      {/* Compact floating cart bar — visual size only */}
      {currentUser.role === 'buyer' && cartItemCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[82%] max-w-md bg-[#1e5634] text-white px-3 py-2 rounded-2xl shadow-2xl z-40 flex items-center justify-between gap-2.5 border border-[#3b7e54]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#f7c244] text-[#1f3427] flex items-center justify-center font-bold text-sm shrink-0">
              🛒
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-bold truncate">
                {cartItemCount} Item{cartItemCount > 1 ? 's' : ''} • ₹{cartTotal}
              </div>
              <div className="text-[9px] sm:text-[10px] text-white/80 truncate">
                ⚡ 15-Min Express Delivery
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-[#f7c244] hover:bg-[#e6b338] text-[#1f3427] text-[11px] sm:text-xs font-bold shadow-sm transition-all cursor-pointer"
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

      {/* Mobile navigation */}
      <MobileNav
        role={currentUser.role}
        currentTab={currentTab}
        onNavigate={setCurrentTab}
      />

      {/* Toast Feedback */}
      <Toast message={toastMsg} />
      <AIAssistant currentLang={currentLang} currentPage={currentTab} />

    </div>
    </>
  );
}