import React, { useState } from 'react';
import { Sprout, ArrowLeft, ArrowRight, Wheat, Calendar, MapPin, IndianRupee } from 'lucide-react';
import { FarmerProduce } from '../types';

interface AddProduceProps {
  initialProduce: FarmerProduce;
  onSubmitProduce: (produce: FarmerProduce) => void;
  onBack: () => void;
}

export const AddProduce: React.FC<AddProduceProps> = ({
  initialProduce,
  onSubmitProduce,
  onBack
}) => {
  const [crop, setCrop] = useState(initialProduce.crop || 'Sharbati Wheat (गेहूं)');
  const [qty, setQty] = useState(initialProduce.qty || 500);
  const [price, setPrice] = useState(initialProduce.price || 48);
  const [loc, setLoc] = useState(initialProduce.loc || 'Sehore, Madhya Pradesh');
  const [harvestDate, setHarvestDate] = useState('2026-09-02');
  const [expiryDate, setExpiryDate] = useState('2026-09-12');

  const cropOptions = [
    { label: '🌾 MP Sharbati Gehu / Wheat (गेहूं)', value: 'Sharbati Wheat', defaultPrice: 48 },
    { label: '🍚 Aromatic Basmati Rice (चावल)', value: 'Basmati Rice', defaultPrice: 95 },
    { label: '🌱 Desi Chana Dal / Gram (चना दाल)', value: 'Desi Chana Dal', defaultPrice: 88 },
    { label: '🌾 Desi Bajra / Pearl Millet (बाजरा)', value: 'Desi Bajra', defaultPrice: 36 },
    { label: '🍅 Desi Red Tomatoes (देसी टमाटर)', value: 'Tomato', defaultPrice: 32 },
    { label: '🧅 Nashik Pink Onions (प्याज)', value: 'Onion', defaultPrice: 28 },
    { label: '🥔 Mountain Golden Potatoes (आलू)', value: 'Potato', defaultPrice: 24 },
    { label: '🥬 Desi Tender Bhindi / Ladyfinger (भिंडी)', value: 'Bhindi', defaultPrice: 36 },
    { label: '🥕 Crisp Red Carrots (गाजर)', value: 'Red Carrots', defaultPrice: 38 },
    { label: '🫛 Sweet Green Peas (हरी मटर)', value: 'Green Peas', defaultPrice: 45 },
    { label: '🫑 Green Capsicum (शिमला मिर्च)', value: 'Shimla Mirch', defaultPrice: 40 },
    { label: '🥒 Tender Lauki / Bottle Gourd (लौकी)', value: 'Lauki', defaultPrice: 26 },
    { label: '🍆 Desi Bharta Baingan (बैंगन)', value: 'Baingan', defaultPrice: 32 },
    { label: '🥒 Desi Crisp Kheera (खीरा)', value: 'Kheera', defaultPrice: 28 },
    { label: '🥦 Snow White Cauliflower (फूलगोभी)', value: 'Cauliflower', defaultPrice: 35 },
    { label: '🥬 Tender Desi Palak (पालक)', value: 'Palak', defaultPrice: 18 },
    { label: '🌿 Desi Methi / Fenugreek (मेथी)', value: 'Methi', defaultPrice: 20 },
    { label: '🌿 Fresh Dhaniya / Coriander (धनिया)', value: 'Dhaniya', defaultPrice: 15 },
    { label: '🥭 Ratnagiri Alphonso Mango (हापुस आम)', value: 'Mango', defaultPrice: 240 },
    { label: '🥛 Pure Gir Cow A2 Milk (दूध)', value: 'A2 Milk', defaultPrice: 44 }
  ];

  const handleCropChange = (selectedVal: string) => {
    setCrop(selectedVal);
    const match = cropOptions.find(c => c.value === selectedVal);
    if (match) setPrice(match.defaultPrice);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitProduce({
      crop,
      hindiName: crop,
      qty: Number(qty),
      price: Number(price),
      loc,
      harvestDate,
      expiryDate
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30] shadow-sm">
        
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#276b45] dark:text-[#4ade80] tracking-widest mb-1">
          <Sprout className="w-4 h-4" />
          <span>Produce Registration</span>
        </div>

        <h2 className="font-heading text-2xl font-bold text-[#20352b] dark:text-[#f4f8f5] mb-2">
          List Harvested Grain or Crop (फसल विवरण)
        </h2>

        <p className="text-xs sm:text-sm text-[#6d7e73] dark:text-[#9ab0a2] mb-6">
          Enter your crop details to run instant AI demand forecasting and match with neighboring pooled EV logistics:
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-[#20352b] dark:text-[#f4f8f5] mb-1">
              Select Crop / Anaj (फसल चुनें)
            </label>
            <select
              value={crop}
              onChange={(e) => handleCropChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfe7df] dark:border-[#223f30] bg-[#faf5e8] dark:bg-[#0e1a14] text-[#20352b] dark:text-[#f4f8f5] text-sm focus:outline-none focus:border-[#276b45]"
            >
              {cropOptions.map((co) => (
                <option key={co.value} value={co.value}>
                  {co.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#20352b] dark:text-[#f4f8f5] mb-1">
                Harvest Quantity (in KG)
              </label>
              <input
                type="number"
                min="10"
                required
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                placeholder="e.g. 500"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfe7df] dark:border-[#223f30] bg-[#faf5e8] dark:bg-[#0e1a14] text-[#20352b] dark:text-[#f4f8f5] text-sm focus:outline-none focus:border-[#276b45]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#20352b] dark:text-[#f4f8f5] mb-1">
                Expected Direct Price (₹ / KG)
              </label>
              <input
                type="number"
                min="1"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="e.g. 48"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfe7df] dark:border-[#223f30] bg-[#faf5e8] dark:bg-[#0e1a14] text-[#20352b] dark:text-[#f4f8f5] text-sm focus:outline-none focus:border-[#276b45]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#20352b] dark:text-[#f4f8f5] mb-1">
              Farm Pickup Location
            </label>
            <input
              type="text"
              required
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
              placeholder="e.g. Sehore, MP or Pune, Maharashtra"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfe7df] dark:border-[#223f30] bg-[#faf5e8] dark:bg-[#0e1a14] text-[#20352b] dark:text-[#f4f8f5] text-sm focus:outline-none focus:border-[#276b45]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#20352b] dark:text-[#f4f8f5] mb-1">
                Harvest Date
              </label>
              <input
                type="date"
                required
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfe7df] dark:border-[#223f30] bg-[#faf5e8] dark:bg-[#0e1a14] text-[#20352b] dark:text-[#f4f8f5] text-sm focus:outline-none focus:border-[#276b45]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#20352b] dark:text-[#f4f8f5] mb-1">
                Available Until Date
              </label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfe7df] dark:border-[#223f30] bg-[#faf5e8] dark:bg-[#0e1a14] text-[#20352b] dark:text-[#f4f8f5] text-sm focus:outline-none focus:border-[#276b45]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#dfe7df] dark:border-[#223f30] text-[#20352b] dark:text-[#f4f8f5] font-bold text-xs hover:bg-[#eaf5ce]/50 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#276b45] hover:bg-[#1e5636] text-white font-bold text-xs shadow-md shadow-[#276b45]/20 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <span>Forecast Demand & Rate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
