import React, { useState } from 'react';
import { LanguageCode } from '../types';
import { translations } from '../data/translations';
import { X, Plus, Minus, Trash2, Zap, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { ProductItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Record<string, { product: ProductItem; qty: number }>;
  onUpdateCart: (product: ProductItem, delta: number) => void;
  onCheckout: (appliedDiscount: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateCart,
  onCheckout
}) => {
  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const cartEntries = (Object.values(cart) as Array<{ product: ProductItem; qty: number }>).filter(item => item.qty > 0);
  const subtotal = cartEntries.reduce((sum: number, item) => sum + item.product.price * item.qty, 0);
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const grandTotal = Math.max(0, subtotal - discountAmount);
  const farmerCut = Math.round(grandTotal * 0.88);

  const handleApplyCoupon = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = coupon.trim().toUpperCase();
    if (code === 'APNAANAJ15' || code === 'KRISHIDIRECT15' || code === 'DESHIKISAN' || code === 'KISAN15') {
      setDiscountPercent(15);
      setCouponSuccess('✓ 15% Welcome Discount Applied!');
      setCouponError('');
    } else if (code) {
      setCouponError('Invalid coupon code. Try: APNAANAJ15');
      setCouponSuccess('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-fadeIn cursor-pointer"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#fbf8ef] dark:bg-[#0d1a13] h-full shadow-2xl z-10 flex flex-col justify-between p-6 overflow-y-auto border-l border-[#e5dec9] dark:border-[#223f30]">
        
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#e5dec9] dark:border-[#223f30]">
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-xl font-bold text-[#1f3427] dark:text-[#f4f8f5]">
                🛒 Your Fresh Basket
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#e4f1cd] dark:bg-[#163824] text-[#1e5634] dark:text-[#4ade80] text-xs font-bold">
                {cartEntries.length} Items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[#5e7164] dark:text-[#9ab0a2] cursor-pointer"
              aria-label="Close basket"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 15 Min Delivery Promise */}
          <div className="my-4 p-3 rounded-xl bg-[#e4f1cd] dark:bg-[#163824] border border-[#bed99f] dark:border-[#223f30] flex items-center gap-2 text-xs text-[#1e5634] dark:text-[#4ade80] font-bold">
            <Zap className="w-4 h-4 shrink-0 text-[#f28b47]" />
            <span>15-Minute Express Delivery from Local Farm Hub</span>
          </div>

          {/* Cart Item List */}
          <div className="space-y-3 max-h-[42vh] overflow-y-auto pr-1">
            {cartEntries.length === 0 ? (
              <div className="text-center py-12 text-[#5e7164] dark:text-[#9ab0a2] space-y-2">
                <p className="text-sm font-semibold">Your basket is currently empty.</p>
                <p className="text-xs">Add fresh grains, veggies or dairy from the store!</p>
              </div>
            ) : (
              cartEntries.map(({ product, qty }) => (
                <div
                  key={product.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-[#15271e] border border-[#e5dec9] dark:border-[#223f30] flex items-center justify-between gap-3 shadow-xs"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs text-[#1f3427] dark:text-[#f4f8f5] truncate">
                      {product.name}
                    </div>
                    <div className="text-[11px] text-[#5e7164] dark:text-[#9ab0a2]">
                      ₹{product.price} × {qty} = <span className="font-bold text-[#1e5634] dark:text-[#4ade80]">₹{product.price * qty}</span>
                    </div>
                    <div className="text-[9px] text-[#f28b47] font-bold">
                      {product.farm}
                    </div>
                  </div>

                  <div className="flex items-center bg-[#1e5634] text-white rounded-lg p-0.5 shrink-0">
                    <button
                      onClick={() => onUpdateCart(product, -1)}
                      className="w-5 h-5 flex items-center justify-center hover:bg-black/20 rounded cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-1.5 text-xs font-bold min-w-[16px] text-center">
                      {qty}
                    </span>
                    <button
                      onClick={() => onUpdateCart(product, 1)}
                      className="w-5 h-5 flex items-center justify-center hover:bg-black/20 rounded cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bottom Checkout Section */}
        <div className="pt-4 border-t border-[#e5dec9] dark:border-[#223f30] space-y-4">
          
          {/* Promo Code Input */}
          <form onSubmit={handleApplyCoupon} className="space-y-1.5">
            <div className="flex gap-2">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Code: APNAANAJ15"
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#15271e] border border-[#e5dec9] dark:border-[#223f30] text-[#1f3427] dark:text-[#f4f8f5] uppercase font-bold focus:outline-none focus:border-[#1e5634]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#1e5634] hover:bg-[#164327] text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                Apply
              </button>
            </div>
            {couponSuccess && <div className="text-[11px] font-bold text-[#1e5634] dark:text-[#4ade80]">{couponSuccess}</div>}
            {couponError && <div className="text-[11px] font-bold text-red-500">{couponError}</div>}
          </form>

          {/* Direct Farmer Contribution Note */}
          <div className="p-2.5 rounded-xl bg-[#e4f1cd]/70 dark:bg-[#163824]/70 border border-[#bed99f] dark:border-[#223f30] flex items-center justify-between text-xs">
            <span className="text-[#1f3427] dark:text-[#f4f8f5]">🌱 <strong>Farmer Direct Payout:</strong></span>
            <strong className="text-[#1e5634] dark:text-[#4ade80]">₹{farmerCut} (88%)</strong>
          </div>

          {/* Pricing Tally */}
          <div className="space-y-1.5 text-xs text-[#5e7164] dark:text-[#9ab0a2]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-bold text-[#1f3427] dark:text-[#f4f8f5]">₹{subtotal}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-[#1e5634] dark:text-[#4ade80] font-bold">
                <span>15% Harvest Discount:</span>
                <span>- ₹{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Express Delivery (15-Min):</span>
              <span className="font-bold text-[#1e5634] dark:text-[#4ade80]">FREE (₹0)</span>
            </div>
            <div className="pt-2 border-t border-[#e5dec9] dark:border-[#223f30] flex justify-between text-base font-bold text-[#1f3427] dark:text-[#f4f8f5]">
              <span>Grand Total:</span>
              <span className="font-heading text-xl text-[#1e5634] dark:text-[#4ade80]">₹{grandTotal}</span>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            disabled={cartEntries.length === 0}
            onClick={() => onCheckout(discountPercent)}
            className="w-full py-3.5 rounded-2xl bg-[#f7c244] hover:bg-[#e6b338] text-[#1f3427] font-bold text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <span>⚡ Confirm & Pay ₹{grandTotal}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>

    </div>
  );
};

