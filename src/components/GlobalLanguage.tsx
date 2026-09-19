import React, { useEffect } from 'react';
import { LanguageCode } from '../types';

type UiMap = Record<string, string>;

const UI_TRANSLATIONS: Partial<Record<LanguageCode, UiMap>> = {
  en: {},
  hinglish: {
    'Marketplace':'Marketplace','How it works':'Kaise kaam karta hai','Stories & Impact':'Stories & Impact','Guest':'Guest',
    'Saved Crops & Harvests':'Saved Crops & Harvests','Saved crops':'Saved crops','View Basket':'Basket Dekhein','Log out':'Logout',
    'Switch to Light Mode':'Light Mode','Switch to Dark Mode':'Dark Mode','Toggle theme':'Theme Badlein',
    '1. Welcome & Role':'1. Welcome & Role','2. Fresh Anaj Store':'2. Fresh Anaj Store','3. Existing Login':'3. Existing Login',
    'Farmer Portal':'Kisaan Portal','Dashboard':'Dashboard','2. Add Harvest / Anaj':'2. Fasal / Anaj Add Karein',
    '3. AI Demand Forecast':'3. AI Demand Forecast','4. Selling Rec':'4. Selling Recommendation','5. Buyer Matching':'5. Buyer Matching',
    '6. Quantity Pooling':'6. Quantity Pooling','7. EV Pickup Route':'7. EV Pickup Route','8. Price Transparency':'8. Price Transparency',
    '9. Dispatched Batches':'9. Dispatched Batches','Fresh Store':'Fresh Store','1. Fresh Farm Store':'1. Fresh Farm Store',
    '2. Live 15-Min Tracking':'2. Live 15-Min Tracking','3. Order History & Impact':'3. Order History & Impact',
    'Add Harvested Crop':'Harvested Fasal Add Karein','Active Crop':'Active Crop','Direct Fair Rate':'Seedha Fair Rate',
    'Transparent farmer-facing rate':'Farmer ko clear rate','Estimated Batch Value':'Estimated Batch Value',
    'Quantity × listed rate':'Quantity × listed rate','Route Compatibility':'Route Compatibility','Next best action':'Next best action',
    'Move your harvest through the AI workflow':'AI workflow se apni fasal aage badhayein',
    'AI Demand Forecast':'AI Demand Forecast','Selling Recommendation':'Selling Recommendation','EV Pickup Route':'EV Pickup Route',
    'Price Transparency':'Price Transparency','Trust layer':'Trust layer','Clear numbers. Clear next step.':'Clear numbers. Clear next step.',
    'Produce Registration':'Produce Registration','Back':'Back','Forecast Demand & Rate':'Demand & Rate Forecast',
    'Apna Anaj AI Demand Forecast':'Apna Anaj AI Demand Forecast','Market Insight:':'Market Insight:','Actionable next step':'Agla useful step',
    'Apna Anaj Smart Matching':'Apna Anaj Smart Matching','Fetching...':'Data aa raha hai...','Apna Anaj Cooperative Pooling':'Apna Anaj Cooperative Pooling',
    'Apna Anaj Pickup Planning':'Apna Anaj Pickup Planning','Fetching live price...':'Live price aa raha hai...',
    'Buyer Price':'Buyer Price','Quantity':'Quantity','Logistics Cost':'Logistics Cost','Platform / Service Fee':'Platform / Service Fee',
    'Net Farmer Income / KG':'Net Farmer Income / KG','Total Expected Income':'Total Expected Income','Market Comparison':'Market Comparison',
    'Transactions & Fulfillment':'Transactions & Fulfillment','Expected Rate':'Expected Rate','Logistics':'Logistics','Service Fee':'Service Fee','Estimated Net':'Estimated Net',
    '15-Minute Express Delivery from Local Farm Hub':'Local farm hub se 15-minute express delivery',
    'Your basket is currently empty.':'Aapka basket abhi khaali hai.','Add fresh grains, veggies or dairy from the store!':'Store se fresh anaj, sabzi ya dairy add karein!',
    'Farmer Direct Payout:':'Farmer Direct Payout:','Subtotal:':'Subtotal:','15% Harvest Discount:':'15% Harvest Discount:',
    'Express Delivery (15-Min):':'Express Delivery (15-Min):','FREE (₹0)':'FREE (₹0)','Grand Total:':'Grand Total:',
    'I want to buy':'Mujhe kharidna hai','15-min delivery':'15-min delivery','I want to sell':'Mujhe bechna hai','Direct fair rates':'Seedhe fair rates',
    'Create Apna Anaj Account':'Apna Anaj Account Banayein','ETA: ~11 Minutes':'ETA: ~11 Minutes','Doorstep':'Doorstep','Call Rider':'Rider Ko Call Karein',
    'Items:':'Items:','Total Paid:':'Total Paid:','(Inclusive of zero delivery fees)':'(Delivery fee zero)','Back to Fresh Anaj Marketplace':'Fresh Anaj Marketplace par wapas'
  },
  hi: {
    'Marketplace':'मार्केटप्लेस','How it works':'यह कैसे काम करता है','Stories & Impact':'कहानियाँ और प्रभाव','Guest':'अतिथि',
    'Saved Crops & Harvests':'सहेजी गई फसलें और उपज','Saved crops':'सहेजी गई फसलें','View Basket':'बास्केट देखें','Log out':'लॉग आउट',
    'Switch to Light Mode':'लाइट मोड पर जाएँ','Switch to Dark Mode':'डार्क मोड पर जाएँ','Toggle theme':'थीम बदलें',
    '1. Welcome & Role':'1. स्वागत और भूमिका','2. Fresh Anaj Store':'2. ताज़ा अनाज स्टोर','3. Existing Login':'3. मौजूदा लॉगिन',
    'Farmer Portal':'किसान पोर्टल','Dashboard':'डैशबोर्ड','2. Add Harvest / Anaj':'2. फसल / अनाज जोड़ें','3. AI Demand Forecast':'3. AI मांग पूर्वानुमान',
    '4. Selling Rec':'4. बिक्री सुझाव','5. Buyer Matching':'5. खरीदार मिलान','6. Quantity Pooling':'6. मात्रा पूलिंग',
    '7. EV Pickup Route':'7. EV पिकअप रूट','8. Price Transparency':'8. मूल्य पारदर्शिता','9. Dispatched Batches':'9. भेजी गई खेप',
    'Fresh Store':'ताज़ा स्टोर','1. Fresh Farm Store':'1. ताज़ा फार्म स्टोर','2. Live 15-Min Tracking':'2. लाइव 15-मिनट ट्रैकिंग',
    '3. Order History & Impact':'3. ऑर्डर इतिहास और प्रभाव','Add Harvested Crop':'कटी हुई फसल जोड़ें','Active Crop':'सक्रिय फसल',
    'Direct Fair Rate':'सीधा उचित भाव','Transparent farmer-facing rate':'किसान के लिए पारदर्शी भाव','Estimated Batch Value':'अनुमानित खेप मूल्य',
    'Quantity × listed rate':'मात्रा × सूचीबद्ध भाव','Route Compatibility':'रूट अनुकूलता','Next best action':'अगला बेहतर कदम',
    'Move your harvest through the AI workflow':'AI वर्कफ़्लो से अपनी फसल आगे बढ़ाएँ','AI Demand Forecast':'AI मांग पूर्वानुमान',
    'Selling Recommendation':'बिक्री सुझाव','EV Pickup Route':'EV पिकअप रूट','Price Transparency':'मूल्य पारदर्शिता','Trust layer':'विश्वास स्तर',
    'Clear numbers. Clear next step.':'साफ़ आंकड़े। साफ़ अगला कदम।','Produce Registration':'फसल पंजीकरण','Back':'वापस',
    'Forecast Demand & Rate':'मांग और भाव का पूर्वानुमान','Apna Anaj AI Demand Forecast':'अपना अनाज AI मांग पूर्वानुमान',
    'Market Insight:':'बाज़ार जानकारी:','Actionable next step':'कार्रवाई योग्य अगला कदम','Apna Anaj Smart Matching':'अपना अनाज स्मार्ट मिलान',
    'Fetching...':'डेटा प्राप्त हो रहा है...','Apna Anaj Cooperative Pooling':'अपना अनाज सहकारी पूलिंग','Apna Anaj Pickup Planning':'अपना अनाज पिकअप योजना',
    'Fetching live price...':'लाइव भाव प्राप्त हो रहा है...','Buyer Price':'खरीदार मूल्य','Quantity':'मात्रा','Logistics Cost':'लॉजिस्टिक्स लागत',
    'Platform / Service Fee':'प्लेटफ़ॉर्म / सेवा शुल्क','Net Farmer Income / KG':'किसान की शुद्ध आय / किलो','Total Expected Income':'कुल अनुमानित आय',
    'Market Comparison':'बाज़ार तुलना','Transactions & Fulfillment':'लेन-देन और पूर्ति','Expected Rate':'अपेक्षित भाव','Logistics':'लॉजिस्टिक्स',
    'Service Fee':'सेवा शुल्क','Estimated Net':'अनुमानित शुद्ध आय','15-Minute Express Delivery from Local Farm Hub':'स्थानीय फार्म हब से 15-मिनट एक्सप्रेस डिलीवरी',
    'Your basket is currently empty.':'आपकी बास्केट अभी खाली है।','Add fresh grains, veggies or dairy from the store!':'स्टोर से ताज़ा अनाज, सब्ज़ियाँ या डेयरी जोड़ें!',
    'Farmer Direct Payout:':'किसान को सीधा भुगतान:','Subtotal:':'उप-योग:','15% Harvest Discount:':'15% फसल छूट:','Express Delivery (15-Min):':'एक्सप्रेस डिलीवरी (15-मिनट):',
    'FREE (₹0)':'मुफ़्त (₹0)','Grand Total:':'कुल योग:','I want to buy':'मैं खरीदना चाहता हूँ','15-min delivery':'15-मिनट डिलीवरी',
    'I want to sell':'मैं बेचना चाहता हूँ','Direct fair rates':'सीधे उचित भाव','Create Apna Anaj Account':'अपना अनाज खाता बनाएँ',
    'ETA: ~11 Minutes':'ETA: ~11 मिनट','Doorstep':'घर तक','Call Rider':'राइडर को कॉल करें','Items:':'आइटम:','Total Paid:':'कुल भुगतान:',
    '(Inclusive of zero delivery fees)':'(शून्य डिलीवरी शुल्क सहित)','Back to Fresh Anaj Marketplace':'ताज़ा अनाज मार्केटप्लेस पर वापस'
  },
  mr: {
    'Marketplace':'मार्केटप्लेस','How it works':'हे कसे काम करते','Stories & Impact':'कथा आणि परिणाम','Guest':'अतिथी','Saved crops':'जतन केलेली पिके',
    'View Basket':'बास्केट पहा','Log out':'लॉग आउट','Farmer Portal':'शेतकरी पोर्टल','Dashboard':'डॅशबोर्ड','Add Harvested Crop':'कापणी केलेले पीक जोडा',
    'Active Crop':'सक्रिय पीक','Direct Fair Rate':'थेट योग्य दर','Estimated Batch Value':'अंदाजित मालमूल्य','Quantity':'प्रमाण',
    'Next best action':'पुढील सर्वोत्तम पाऊल','AI Demand Forecast':'AI मागणी अंदाज','Selling Recommendation':'विक्री शिफारस',
    'EV Pickup Route':'EV पिकअप मार्ग','Price Transparency':'किंमत पारदर्शकता','Produce Registration':'पीक नोंदणी','Back':'मागे',
    'Forecast Demand & Rate':'मागणी व दर अंदाज','Market Insight:':'बाजार माहिती:','Apna Anaj Smart Matching':'अपना अनाज स्मार्ट जुळणी',
    'Fetching...':'माहिती येत आहे...','Apna Anaj Cooperative Pooling':'अपना अनाज सहकारी पूलिंग','Apna Anaj Pickup Planning':'अपना अनाज पिकअप नियोजन',
    'Buyer Price':'खरेदीदार किंमत','Quantity':'प्रमाण','Logistics Cost':'लॉजिस्टिक्स खर्च','Platform / Service Fee':'प्लॅटफॉर्म / सेवा शुल्क',
    'Net Farmer Income / KG':'शेतकऱ्याचे निव्वळ उत्पन्न / किलो','Market Comparison':'बाजार तुलना','Transactions & Fulfillment':'व्यवहार आणि पूर्तता',
    'Expected Rate':'अपेक्षित दर','Logistics':'लॉजिस्टिक्स','Service Fee':'सेवा शुल्क','Estimated Net':'अंदाजित निव्वळ',
    'Your basket is currently empty.':'तुमची बास्केट सध्या रिकामी आहे.','Add fresh grains, veggies or dairy from the store!':'स्टोअरमधून ताजे धान्य, भाज्या किंवा डेअरी जोडा!',
    'Farmer Direct Payout:':'शेतकऱ्याला थेट देयक:','Subtotal:':'उपएकूण:','Grand Total:':'एकूण:','I want to buy':'मला खरेदी करायची आहे',
    'I want to sell':'मला विक्री करायची आहे','Create Apna Anaj Account':'अपना अनाज खाते तयार करा','Call Rider':'रायडरला कॉल करा','Doorstep':'घरपोच'
  },
  pa: {
    'Marketplace':'ਮਾਰਕੀਟਪਲੇਸ','How it works':'ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ','Stories & Impact':'ਕਹਾਣੀਆਂ ਅਤੇ ਪ੍ਰਭਾਵ','Guest':'ਮੇਹਮਾਨ','Saved crops':'ਸੇਵ ਕੀਤੀਆਂ ਫਸਲਾਂ',
    'View Basket':'ਬਾਸਕਟ ਵੇਖੋ','Log out':'ਲੌਗ ਆਉਟ','Farmer Portal':'ਕਿਸਾਨ ਪੋਰਟਲ','Dashboard':'ਡੈਸ਼ਬੋਰਡ','Add Harvested Crop':'ਕੱਟੀ ਫਸਲ ਸ਼ਾਮਲ ਕਰੋ',
    'Active Crop':'ਮੌਜੂਦਾ ਫਸਲ','Direct Fair Rate':'ਸਿੱਧਾ ਉਚਿਤ ਭਾਅ','Estimated Batch Value':'ਅੰਦਾਜ਼ੀ ਖੇਪ ਮੁੱਲ','Quantity':'ਮਾਤਰਾ',
    'Next best action':'ਅਗਲਾ ਕਦਮ','AI Demand Forecast':'AI ਮੰਗ ਅਨੁਮਾਨ','Selling Recommendation':'ਵਿਕਰੀ ਸਿਫ਼ਾਰਸ਼','EV Pickup Route':'EV ਪਿਕਅਪ ਰੂਟ',
    'Price Transparency':'ਕੀਮਤ ਪਾਰਦਰਸ਼ਤਾ','Produce Registration':'ਫਸਲ ਰਜਿਸਟ੍ਰੇਸ਼ਨ','Back':'ਵਾਪਸ','Forecast Demand & Rate':'ਮੰਗ ਅਤੇ ਭਾਅ ਅਨੁਮਾਨ',
    'Market Insight:':'ਮਾਰਕੀਟ ਜਾਣਕਾਰੀ:','Fetching...':'ਡਾਟਾ ਆ ਰਿਹਾ ਹੈ...','Apna Anaj Cooperative Pooling':'ਅਪਨਾ ਅਨਾਜ ਕੋਆਪਰੇਟਿਵ ਪੂਲਿੰਗ',
    'Apna Anaj Pickup Planning':'ਅਪਨਾ ਅਨਾਜ ਪਿਕਅਪ ਯੋਜਨਾ','Buyer Price':'ਖਰੀਦਦਾਰ ਕੀਮਤ','Logistics Cost':'ਲਾਜਿਸਟਿਕਸ ਖਰਚ',
    'Platform / Service Fee':'ਪਲੇਟਫਾਰਮ / ਸੇਵਾ ਫੀਸ','Net Farmer Income / KG':'ਕਿਸਾਨ ਦੀ ਨੈੱਟ ਆਮਦਨ / ਕਿਲੋ','Market Comparison':'ਮਾਰਕੀਟ ਤੁਲਨਾ',
    'Transactions & Fulfillment':'ਲੈਣ-ਦੇਣ ਅਤੇ ਪੂਰਤੀ','Expected Rate':'ਉਮੀਦਵਾਰ ਭਾਅ','Logistics':'ਲਾਜਿਸਟਿਕਸ','Service Fee':'ਸੇਵਾ ਫੀਸ',
    'Estimated Net':'ਅੰਦਾਜ਼ੀ ਨੈੱਟ','Your basket is currently empty.':'ਤੁਹਾਡੀ ਬਾਸਕਟ ਖਾਲੀ ਹੈ।','Add fresh grains, veggies or dairy from the store!':'ਸਟੋਰ ਤੋਂ ਤਾਜ਼ਾ ਅਨਾਜ, ਸਬਜ਼ੀਆਂ ਜਾਂ ਡੇਅਰੀ ਸ਼ਾਮਲ ਕਰੋ',
    'Farmer Direct Payout:':'ਕਿਸਾਨ ਨੂੰ ਸਿੱਧੀ ਅਦਾਇਗੀ:','Subtotal:':'ਉਪ-ਕੁੱਲ:','Grand Total:':'ਕੁੱਲ ਜੋੜ:','I want to buy':'ਮੈਂ ਖਰੀਦਣਾ ਚਾਹੁੰਦਾ ਹਾਂ',
    'I want to sell':'ਮੈਂ ਵੇਚਣਾ ਚਾਹੁੰਦਾ ਹਾਂ','Create Apna Anaj Account':'ਅਪਨਾ ਅਨਾਜ ਖਾਤਾ ਬਣਾਓ','Call Rider':'ਰਾਈਡਰ ਨੂੰ ਕਾਲ ਕਰੋ','Doorstep':'ਘਰ ਤੱਕ'
  },
  gu: {
    'Marketplace':'માર્કેટપ્લેસ','How it works':'આ કેવી રીતે કામ કરે છે','Stories & Impact':'કથાઓ અને અસર','Guest':'મહેમાન','Saved crops':'સાચવેલ પાક',
    'View Basket':'બાસ્કેટ જુઓ','Log out':'લૉગ આઉટ','Farmer Portal':'ખેડૂત પોર્ટલ','Dashboard':'ડેશબોર્ડ','Add Harvested Crop':'કાપેલું પાક ઉમેરો',
    'Active Crop':'સક્રિય પાક','Direct Fair Rate':'સીધો યોગ્ય ભાવ','Estimated Batch Value':'અંદાજિત જથ્થો કિંમત','Quantity':'જથ્થો',
    'Next best action':'આગળનું શ્રેષ્ઠ પગલું','AI Demand Forecast':'AI માંગ અનુમાન','Selling Recommendation':'વેચાણ ભલામણ','EV Pickup Route':'EV પિકઅપ માર્ગ',
    'Price Transparency':'ભાવ પારદર્શિતા','Produce Registration':'પાક નોંધણી','Back':'પાછા','Forecast Demand & Rate':'માંગ અને ભાવ અનુમાન',
    'Market Insight:':'બજાર માહિતી:','Fetching...':'ડેટા આવી રહ્યો છે...','Buyer Price':'ખરીદદાર ભાવ','Logistics Cost':'લોજિસ્ટિક્સ ખર્ચ',
    'Platform / Service Fee':'પ્લેટફોર્મ / સેવા ફી','Net Farmer Income / KG':'ખેડૂતની ચોખ્ખી આવક / કિલો','Market Comparison':'બજાર સરખામણી',
    'Transactions & Fulfillment':'વ્યવહાર અને પૂર્તિ','Expected Rate':'અપેક્ષિત ભાવ','Logistics':'લોજિસ્ટિક્સ','Service Fee':'સેવા ફી','Estimated Net':'અંદાજિત નેટ',
    'Your basket is currently empty.':'તમારી બાસ્કેટ હાલ ખાલી છે.','Add fresh grains, veggies or dairy from the store!':'સ્ટોરમાંથી તાજું અનાજ, શાકભાજી અથવા ડેરી ઉમેરો',
    'Farmer Direct Payout:':'ખેડૂતને સીધી ચુકવણી:','Subtotal:':'ઉપકુલ:','Grand Total:':'કુલ:','I want to buy':'મારે ખરીદવું છે','I want to sell':'મારે વેચવું છે',
    'Create Apna Anaj Account':'અપના અનાજ ખાતું બનાવો','Call Rider':'રાઇડરને કૉલ કરો','Doorstep':'ઘર સુધી'
  },
  bn: {
    'Marketplace':'মার্কেটপ্লেস','How it works':'এটি কীভাবে কাজ করে','Stories & Impact':'গল্প ও প্রভাব','Guest':'অতিথি','Saved crops':'সংরক্ষিত ফসল',
    'View Basket':'বাস্কেট দেখুন','Log out':'লগ আউট','Farmer Portal':'কৃষক পোর্টাল','Dashboard':'ড্যাশবোর্ড','Add Harvested Crop':'কাটা ফসল যোগ করুন',
    'Active Crop':'সক্রিয় ফসল','Direct Fair Rate':'সরাসরি ন্যায্য দাম','Estimated Batch Value':'আনুমানিক ব্যাচ মূল্য','Quantity':'পরিমাণ',
    'Next best action':'পরবর্তী সেরা পদক্ষেপ','AI Demand Forecast':'AI চাহিদা পূর্বাভাস','Selling Recommendation':'বিক্রয় সুপারিশ','EV Pickup Route':'EV পিকআপ রুট',
    'Price Transparency':'দাম স্বচ্ছতা','Produce Registration':'ফসল নিবন্ধন','Back':'ফিরে যান','Forecast Demand & Rate':'চাহিদা ও দাম পূর্বাভাস',
    'Market Insight:':'বাজার তথ্য:','Fetching...':'ডেটা আসছে...','Buyer Price':'ক্রেতার দাম','Logistics Cost':'লজিস্টিক খরচ','Platform / Service Fee':'প্ল্যাটফর্ম / সার্ভিস ফি',
    'Net Farmer Income / KG':'কৃষকের নেট আয় / কেজি','Market Comparison':'বাজার তুলনা','Transactions & Fulfillment':'লেনদেন ও সরবরাহ',
    'Expected Rate':'প্রত্যাশিত দাম','Logistics':'লজিস্টিক','Service Fee':'সার্ভিস ফি','Estimated Net':'আনুমানিক নেট','Your basket is currently empty.':'আপনার বাস্কেট খালি।',
    'Add fresh grains, veggies or dairy from the store!':'স্টোর থেকে তাজা শস্য, সবজি বা ডেইরি যোগ করুন','Farmer Direct Payout:':'কৃষককে সরাসরি অর্থপ্রদান:',
    'Subtotal:':'উপমোট:','Grand Total:':'মোট:','I want to buy':'আমি কিনতে চাই','I want to sell':'আমি বিক্রি করতে চাই','Create Apna Anaj Account':'আপনা অনাজ অ্যাকাউন্ট তৈরি করুন',
    'Call Rider':'রাইডারকে কল করুন','Doorstep':'বাড়ি পর্যন্ত'
  },
  te: {
    'Marketplace':'మార్కెట్‌ప్లేస్','How it works':'ఇది ఎలా పనిచేస్తుంది','Stories & Impact':'కథలు & ప్రభావం','Guest':'అతిథి','Saved crops':'సేవ్ చేసిన పంటలు',
    'View Basket':'బాస్కెట్ చూడండి','Log out':'లాగ్ అవుట్','Farmer Portal':'రైతు పోర్టల్','Dashboard':'డ్యాష్‌బోర్డ్','Add Harvested Crop':'కోత పంటను జోడించండి',
    'Active Crop':'ప్రస్తుత పంట','Direct Fair Rate':'నేరుగా న్యాయమైన ధర','Estimated Batch Value':'అంచనా బ్యాచ్ విలువ','Quantity':'పరిమాణం',
    'Next best action':'తదుపరి ఉత్తమ చర్య','AI Demand Forecast':'AI డిమాండ్ అంచనా','Selling Recommendation':'అమ్మకం సిఫార్సు','EV Pickup Route':'EV పికప్ మార్గం',
    'Price Transparency':'ధర పారదర్శకత','Produce Registration':'పంట నమోదు','Back':'వెనక్కి','Forecast Demand & Rate':'డిమాండ్ & ధర అంచనా',
    'Market Insight:':'మార్కెట్ సమాచారం:','Fetching...':'డేటా వస్తోంది...','Buyer Price':'కొనుగోలు ధర','Logistics Cost':'లాజిస్టిక్స్ ఖర్చు',
    'Platform / Service Fee':'ప్లాట్‌ఫారమ్ / సేవా రుసుము','Net Farmer Income / KG':'రైతు నికర ఆదాయం / కిలో','Market Comparison':'మార్కెట్ పోలిక',
    'Transactions & Fulfillment':'లావాదేవీలు & సరఫరా','Expected Rate':'అంచనా ధర','Logistics':'లాజిస్టిక్స్','Service Fee':'సేవా రుసుము','Estimated Net':'అంచనా నికర',
    'Your basket is currently empty.':'మీ బాస్కెట్ ఖాళీగా ఉంది.','Add fresh grains, veggies or dairy from the store!':'స్టోర్ నుంచి తాజా ధాన్యం, కూరగాయలు లేదా డైరీని జోడించండి',
    'Farmer Direct Payout:':'రైతుకు నేరుగా చెల్లింపు:','Subtotal:':'ఉపమొత్తం:','Grand Total:':'మొత్తం:','I want to buy':'నేను కొనాలనుకుంటున్నాను',
    'I want to sell':'నేను అమ్మాలనుకుంటున్నాను','Create Apna Anaj Account':'అప్నా అనాజ్ ఖాతా సృష్టించండి','Call Rider':'రైడర్‌కు కాల్ చేయండి','Doorstep':'ఇంటి వద్ద'
  },
  ta: {
    'Marketplace':'மார்க்கெட்ப்ளேஸ்','How it works':'இது எப்படி வேலை செய்கிறது','Stories & Impact':'கதைகள் & தாக்கம்','Guest':'விருந்தினர்','Saved crops':'சேமித்த பயிர்கள்',
    'View Basket':'கூடை பார்க்க','Log out':'வெளியேறு','Farmer Portal':'விவசாயி போர்டல்','Dashboard':'டாஷ்போர்டு','Add Harvested Crop':'அறுவடை பயிரை சேர்க்கவும்',
    'Active Crop':'செயலில் உள்ள பயிர்','Direct Fair Rate':'நேரடி நியாய விலை','Estimated Batch Value':'மதிப்பிடப்பட்ட தொகுதி மதிப்பு','Quantity':'அளவு',
    'Next best action':'அடுத்த சிறந்த செயல்','AI Demand Forecast':'AI தேவை முன்கணிப்பு','Selling Recommendation':'விற்பனை பரிந்துரை','EV Pickup Route':'EV எடுப்பு பாதை',
    'Price Transparency':'விலை வெளிப்படைத் தன்மை','Produce Registration':'பயிர் பதிவு','Back':'பின்னால்','Forecast Demand & Rate':'தேவை & விலை முன்கணிப்பு',
    'Market Insight:':'சந்தை தகவல்:','Fetching...':'தரவு வருகிறது...','Buyer Price':'வாங்குபவர் விலை','Logistics Cost':'லாஜிஸ்டிக்ஸ் செலவு',
    'Platform / Service Fee':'தளம் / சேவை கட்டணம்','Net Farmer Income / KG':'விவசாயி நிகர வருமானம் / கிலோ','Market Comparison':'சந்தை ஒப்பீடு',
    'Transactions & Fulfillment':'பரிவர்த்தனைகள் & நிறைவேற்றம்','Expected Rate':'எதிர்பார்க்கப்படும் விலை','Logistics':'லாஜிஸ்டிக்ஸ்','Service Fee':'சேவை கட்டணம்','Estimated Net':'மதிப்பிடப்பட்ட நிகரம்',
    'Your basket is currently empty.':'உங்கள் கூடை காலியாக உள்ளது.','Add fresh grains, veggies or dairy from the store!':'ஸ்டோரிலிருந்து புதிய தானியங்கள், காய்கறிகள் அல்லது பால் பொருட்களைச் சேர்க்கவும்',
    'Farmer Direct Payout:':'விவசாயிக்கு நேரடி பணம்:','Subtotal:':'கூட்டுத்தொகை:','Grand Total:':'மொத்தம்:','I want to buy':'நான் வாங்க விரும்புகிறேன்',
    'I want to sell':'நான் விற்க விரும்புகிறேன்','Create Apna Anaj Account':'அப்னா அனாஜ் கணக்கை உருவாக்கவும்','Call Rider':'ரைடரை அழைக்கவும்','Doorstep':'வீட்டு வாசல்'
  },
  kn: {
    'Marketplace':'ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್','How it works':'ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ','Stories & Impact':'ಕಥೆಗಳು ಮತ್ತು ಪರಿಣಾಮ','Guest':'ಅತಿಥಿ','Saved crops':'ಉಳಿಸಿದ ಬೆಳೆಗಳು',
    'View Basket':'ಬಾಸ್ಕೆಟ್ ನೋಡಿ','Log out':'ಲಾಗ್ ಔಟ್','Farmer Portal':'ರೈತ ಪೋರ್ಟಲ್','Dashboard':'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್','Add Harvested Crop':'ಕೊಯ್ಲು ಮಾಡಿದ ಬೆಳೆ ಸೇರಿಸಿ',
    'Active Crop':'ಪ್ರಸ್ತುತ ಬೆಳೆ','Direct Fair Rate':'ನೇರ ನ್ಯಾಯಯುತ ದರ','Estimated Batch Value':'ಅಂದಾಜು ಬ್ಯಾಚ್ ಮೌಲ್ಯ','Quantity':'ಪ್ರಮಾಣ',
    'Next best action':'ಮುಂದಿನ ಉತ್ತಮ ಹೆಜ್ಜೆ','AI Demand Forecast':'AI ಬೇಡಿಕೆ ಮುನ್ಸೂಚನೆ','Selling Recommendation':'ಮಾರಾಟ ಶಿಫಾರಸು','EV Pickup Route':'EV ಪಿಕಪ್ ಮಾರ್ಗ',
    'Price Transparency':'ಬೆಲೆ ಪಾರದರ್ಶಕತೆ','Produce Registration':'ಬೆಳೆ ನೋಂದಣಿ','Back':'ಹಿಂದೆ','Forecast Demand & Rate':'ಬೇಡಿಕೆ ಮತ್ತು ದರ ಮುನ್ಸೂಚನೆ',
    'Market Insight:':'ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ:','Fetching...':'ಡೇಟಾ ಬರುತ್ತಿದೆ...','Buyer Price':'ಖರೀದಿದಾರರ ಬೆಲೆ','Logistics Cost':'ಲಾಜಿಸ್ಟಿಕ್ಸ್ ವೆಚ್ಚ',
    'Platform / Service Fee':'ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ / ಸೇವಾ ಶುಲ್ಕ','Net Farmer Income / KG':'ರೈತರ ನಿವ್ವಳ ಆದಾಯ / ಕೆಜಿ','Market Comparison':'ಮಾರುಕಟ್ಟೆ ಹೋಲಿಕೆ',
    'Transactions & Fulfillment':'ವಹಿವಾಟು ಮತ್ತು ಪೂರೈಕೆ','Expected Rate':'ನಿರೀಕ್ಷಿತ ದರ','Logistics':'ಲಾಜಿಸ್ಟಿಕ್ಸ್','Service Fee':'ಸೇವಾ ಶುಲ್ಕ','Estimated Net':'ಅಂದಾಜು ನಿವ್ವಳ',
    'Your basket is currently empty.':'ನಿಮ್ಮ ಬಾಸ್ಕೆಟ್ ಖಾಲಿಯಾಗಿದೆ.','Add fresh grains, veggies or dairy from the store!':'ಸ್ಟೋರ್‌ನಿಂದ ತಾಜಾ ಧಾನ್ಯ, ತರಕಾರಿ ಅಥವಾ ಡೈರಿ ಸೇರಿಸಿ',
    'Farmer Direct Payout:':'ರೈತರಿಗೆ ನೇರ ಪಾವತಿ:','Subtotal:':'ಉಪಮೊತ್ತ:','Grand Total:':'ಒಟ್ಟು:','I want to buy':'ನಾನು ಖರೀದಿಸಲು ಬಯಸುತ್ತೇನೆ',
    'I want to sell':'ನಾನು ಮಾರಲು ಬಯಸುತ್ತೇನೆ','Create Apna Anaj Account':'ಅಪ್ನಾ ಅನಾಜ್ ಖಾತೆ ರಚಿಸಿ','Call Rider':'ರೈಡರ್‌ಗೆ ಕರೆ ಮಾಡಿ','Doorstep':'ಮನೆಬಾಗಿಲು'
  }
};

function normalize(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

export const GlobalLanguage: React.FC<{ currentLang: LanguageCode }> = ({ currentLang }) => {
  useEffect(() => {
    const map = UI_TRANSLATIONS[currentLang] || {};

    const states = new WeakMap<Text, { base: string; last: string }>();

    const translateNode = (node: Text) => {
      const raw = node.nodeValue ?? '';
      const state = states.get(node);
      const base = state && raw === state.last ? state.base : raw;
      const clean = normalize(base);
      if (!clean) return;
      const translated = map[clean];
      if (!translated || translated === clean) {
        states.set(node, { base, last: raw });
        return;
      }
      const leading = base.match(/^\s*/)?.[0] ?? '';
      const trailing = base.match(/\s*$/)?.[0] ?? '';
      const value = leading + translated + trailing;
      node.nodeValue = value;
      states.set(node, { base, last: value });
    };

    const translateAttributes = (el: Element) => {
      for (const attr of ['placeholder','title','aria-label']) {
        const value = el.getAttribute(attr);
        if (!value) continue;
        const translated = map[normalize(value)];
        if (translated && translated !== value) {
          el.setAttribute(attr, translated);
        }
      }
    };

    const walk = (root: Node) => {
      if (root.nodeType === Node.TEXT_NODE) {
        const parent = (root.parentElement?.tagName || '').toUpperCase();
        if (!['SCRIPT','STYLE','NOSCRIPT'].includes(parent)) translateNode(root as Text);
        return;
      }
      if (root.nodeType === Node.ELEMENT_NODE) {
        const el = root as Element;
        if (['SCRIPT','STYLE','NOSCRIPT'].includes(el.tagName)) return;
        translateAttributes(el);
      }
      root.childNodes.forEach(walk);
    };

    walk(document.body);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'characterData') translateNode(mutation.target as Text);
        mutation.addedNodes.forEach(walk);
        if (mutation.type === 'attributes' && mutation.target instanceof Element) {
          translateAttributes(mutation.target);
        }
      }
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['placeholder','title','aria-label']
    });

    return () => observer.disconnect();
  }, [currentLang]);

  return null;
};
