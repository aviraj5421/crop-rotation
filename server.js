// backend/server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Crucial for your separate frontend to connect
app.use(express.json());

// --- DATA STRUCTURES ---
const CROPS = [
'rice',
'soybean',
'cotton',
'wheat',
'groundnut',
'maize',
'sorghum',
'millet',
'chickpea',

'coriander',
'cucumber',
'mustard',
'pulses',

'barley',
'oats',
'foxtail_millet',
'finger_millet',
'horse_gram',
'cowpea',
'cluster_beans',
'field_pea',
'lentil',
'safflower',
'castor',
'linseed',
'fenugreek',
'cabbage',
'cauliflower',
'capsicum',
'pumpkin',
'bottle_gourd',
'ridge_gourd',
'bitter_gourd',
'watermelon',
'muskmelon',
'sweet_potato'
];

const REGIONS = [
    { id: 'konkan', name: 'Konkan Region', districts: ['Mumbai', 'Thane', 'Palghar', 'Raigad', 'Ratnagiri', 'Sindhudurg'] },
    { id: 'western', name: 'Western Maharashtra', districts: ['Pune', 'Satara', 'Sangli', 'Kolhapur', 'Solapur', 'Ahmednagar'] },
    { id: 'marathwada', name: 'Marathwada (Water Stress Region)', districts: ['Aurangabad', 'Beed', 'Latur', 'Osmanabad', 'Nanded', 'Parbhani', 'Jalna', 'Hingoli'] },
    { id: 'vidarbha', name: 'Vidarbha (Water Stress Region)', districts: ['Nagpur', 'Amravati', 'Akola', 'Yavatmal', 'Buldhana', 'Washim', 'Wardha', 'Chandrapur', 'Gadchiroli', 'Bhandara', 'Gondia'] },
    { id: 'khandesh', name: 'Khandesh / North Mah.', districts: ['Nashik', 'Dhule', 'Nandurbar', 'Jalgaon'] }
];

const i18n = {
    en: {
        pageTitle: "Farmer Crop Rotation & Water Smart Advisor",
        pageSubtitle: "Get crop recommendations based on rotation, region, and water availability.",
        lblDate: "Today's Advisory Date",
        lblCrop: "Step 1: Previous Crop Grown",
        cropPlaceholder: "Search crops (e.g., Soybean, Rice)...",
        lblState: "State",
        lblDistrict: "Step 2: Select District",
        districtPlaceholder: "Search district...",
        lblPhase: "Current Farming Phase",
        phasePreMonsoon: "Pre-Monsoon (Dry Season)",
        phaseMonsoon: "Monsoon Season",
        phasePostMonsoon: "Post-Monsoon Season",
        lblWater: "Step 3: Water Availability",
        optWaterPlaceholder: "Select water level...",
        optWaterLow: "Low Water (< 2 months irrigation)",
        optWaterMed: "Medium Water (2–4 months irrigation)",
        optWaterHigh: "High Water (> 4 months irrigation)",
        lblSeason: "Step 4: Season",
        optSeasonKharif: "Kharif",
        optSeasonRabi: "Rabi",
        optSeasonSummer: "Summer",
        lblSoil: "Step 5: Soil Type (Optional)",
        optSoilAll: "Any Soil Type",
        optSoilBlack: "Black Soil",
        optSoilRed: "Red Soil",
        optSoilSandy: "Sandy Soil",
        optSoilClay: "Clay Soil",
        btnSubmit: "Get Smart Crop Recommendation",
        alertDescWarning: "This region often experiences water shortages during March–May. Low water crops are highly recommended.",
        alertDescNormal: "Dry season approaching. Ensure adequate irrigation planning.",
        alertDescMonsoon: "Monsoon phase. Adequate rainfall expected. Good time for Kharif sowing.",
        alertDescPostMonsoon: "Soil moisture is generally good. Plan Rabi crops carefully based on residual moisture.",
        resPrefixPart1: "After ",
        resPrefixPart2: ", recommended next crop:",
        lblExplanation: "Explanation",
        lblTimeline: "Rotation Timeline",
        lblCardDuration: "Duration",
        lblCardWater: "Water Need",
        lblCardSoil: "Soil Benefit",
        lblCardProfit: "Profit Potential",
        lblAltTitle: "Alternative Crops",
        lblTipsTitle: "Smart Farmer Tips",
        tip1: "Use drip irrigation to reduce water usage",
        tip2: "Rotate legumes to improve soil fertility",
        tip3: "Avoid planting the same crop repeatedly",
        tip4: "Mulching helps retain soil moisture",
        errCrop: "Please select your previous crop.",
        errDistrict: "Please select your district.",
        errWater: "Please select water availability.",
        noMatch: "No matches found",
        cropNames: {
    'rice': 'Rice (Paddy)',
    'soybean': 'Soybean',
    'cotton': 'Cotton',
    'wheat': 'Wheat',
    'groundnut': 'Groundnut',
    'maize': 'Maize',
    'sorghum': 'Sorghum',
    'millet': 'Millet',
    'chickpea': 'Chickpea',
    'coriander': 'Coriander',
    'cucumber': 'Cucumber',
    'mustard': 'Mustard',
    'pulses': 'Pulses',

    'barley': 'Barley',
    'oats': 'Oats',
    'foxtail_millet': 'Foxtail Millet',
    'finger_millet': 'Finger Millet (Ragi)',
    'horse_gram': 'Horse Gram',
    'cowpea': 'Cowpea',
    'cluster_beans': 'Cluster Beans',
    'field_pea': 'Field Pea',
    'lentil': 'Lentil',
    'safflower': 'Safflower',
    'castor': 'Castor',
    'linseed': 'Linseed',
    'fenugreek': 'Fenugreek',
    'cabbage': 'Cabbage',
    'cauliflower': 'Cauliflower',
    'capsicum': 'Capsicum',
    'pumpkin': 'Pumpkin',
    'bottle_gourd': 'Bottle Gourd',
    'ridge_gourd': 'Ridge Gourd',
    'bitter_gourd': 'Bitter Gourd',
    'watermelon': 'Watermelon',
    'muskmelon': 'Muskmelon',
    'sweet_potato': 'Sweet Potato'
},
        baseRules: {
            'soybean': { next: 'wheat', desc: "Soybean fixes nitrogen in soil which heavily benefits wheat growth.", timeline: "Harvest Soybean → Oct | Prepare soil → Nov | Sow Wheat → Late Nov", duration: "110-130 days", water: "Medium", benefit: "Nitrogen utilization", profit: "Moderate", alts: ['chickpea', 'mustard', 'millet'] },
            'rice': { next: 'pulses', desc: "Pulses break the pest cycle of rice and restore depleted nitrogen.", timeline: "Harvest Rice → Nov | Rest soil → Dec | Sow Pulses → Jan", duration: "70-90 days", water: "Low", benefit: "Restores fertility", profit: "Moderate", alts: ['wheat', 'mustard'] },
            'cotton': { next: 'chickpea', desc: "Chickpea is a deep-rooted legume that thrives on residual moisture after cotton.", timeline: "Harvest Cotton → Dec | Plough → Jan | Sow Chickpea → Jan/Feb", duration: "100-120 days", water: "Low", benefit: "Pest cycle break", profit: "High", alts: ['sorghum', 'groundnut'] },
            'maize': { next: 'mustard', desc: "Mustard roots break hardpan soil created by maize harvesting.", timeline: "Harvest Maize → Oct | Quick prep → Oct | Sow Mustard → Nov", duration: "100-120 days", water: "Medium", benefit: "Soil conditioning", profit: "Moderate", alts: ['wheat', 'chickpea'] },
            'groundnut': { next: 'sorghum', desc: "Sorghum produces high biomass, utilizing the nitrogen left by groundnut.", timeline: "Harvest Groundnut → Oct | Rest → Nov | Sow Sorghum → Dec", duration: "100-115 days", water: "Medium", benefit: "Biomass addition", profit: "Moderate", alts: ['cotton', 'millet'] },
            'sorghum': { next: 'groundnut', desc: "Groundnut restores the nitrogen that sorghum heavily extracts.", timeline: "Harvest Sorghum → Dec | Rest field | Sow Groundnut → Summer", duration: "110-120 days", water: "Medium", benefit: "Nitrogen fixing", profit: "High", alts: ['chickpea', 'millet'] },
            'millet': { next: 'chickpea', desc: "Both crops manage well in low-moisture environments, perfect for dryland.", timeline: "Harvest Millet → Oct | Conserve moisture | Sow Chickpea → Nov", duration: "100-110 days", water: "Low", benefit: "Moisture conservation", profit: "Moderate", alts: ['coriander', 'mustard'] },
            'chickpea': { next: 'maize', desc: "Maize is a heavy feeder that exploits the excellent soil health left by chickpea.", timeline: "Harvest Chickpea → Mar | Deep plough | Sow Maize → Jun (Kharif)", duration: "90-110 days", water: "High", benefit: "Nutrient exploitation", profit: "High", alts: ['cotton', 'soybean'] },
            'wheat': { next: 'soybean', desc: "Soybean in the next Kharif restores the heavy nutrient drain of wheat.", timeline: "Harvest Wheat → Apr | Summer fallow | Sow Soybean → Jun", duration: "90-110 days", water: "Medium", benefit: "Nutrient cycling", profit: "High", alts: ['maize', 'sorghum'] }
        },
        stressCrops: ['millet', 'coriander', 'cucumber', 'chickpea'],
        stressDesc: "Due to predicted water stress, short-duration and drought-tolerant crops are strictly recommended.",
        stressTimeline: "Prepare land immediately with minimal tillage to conserve moisture. Sow at the earliest.",
        stressDuration: "45-90 days",
        stressProfit: "Moderate (Low Risk)",
        optWaterLowText: "Low Water"
    },
    hi: {
        pageTitle: "किसान फसल चक्र व जल सलाहकार",
        pageSubtitle: "रोटेशन, क्षेत्र और जल उपलब्धता के आधार पर फसल की सलाह प्राप्त करें।",
        lblDate: "आज की सलाह तिथि",
        lblCrop: "चरण 1: पिछली उगाई गई फसल",
        cropPlaceholder: "फसल खोजें (जैसे: सोयाबीन, धान)...",
        lblState: "राज्य",
        lblDistrict: "चरण 2: जिला चुनें",
        districtPlaceholder: "जिला खोजें...",
        lblPhase: "वर्तमान कृषि चरण",
        phasePreMonsoon: "मानसून पूर्व (शुष्क मौसम)",
        phaseMonsoon: "मानसून का मौसम",
        phasePostMonsoon: "मानसून के बाद का मौसम",
        lblWater: "चरण 3: जल उपलब्धता",
        optWaterPlaceholder: "पानी का स्तर चुनें...",
        optWaterLow: "कम पानी (2 महीने से कम सिंचाई)",
        optWaterMed: "मध्यम पानी (2–4 महीने सिंचाई)",
        optWaterHigh: "अधिक पानी (4 महीने से अधिक सिंचाई)",
        lblSeason: "चरण 4: मौसम",
        optSeasonKharif: "खरीफ",
        optSeasonRabi: "रबी",
        optSeasonSummer: "ग्रीष्म (Summer)",
        lblSoil: "चरण 5: मिट्टी का प्रकार (वैकल्पिक)",
        optSoilAll: "कोई भी मिट्टी",
        optSoilBlack: "काली मिट्टी",
        optSoilRed: "लाल मिट्टी",
        optSoilSandy: "रेतीली मिट्टी",
        optSoilClay: "चिकनी मिट्टी",
        btnSubmit: "फसल अनुशंसा प्राप्त करें",
        alertDescWarning: "इस क्षेत्र में अक्सर मार्च-मई के दौरान पानी की कमी होती है। कम पानी वाली फसलों की अत्यधिक अनुशंसा की जाती है।",
        alertDescNormal: "शुष्क मौसम आ रहा है। पर्याप्त सिंचाई योजना सुनिश्चित करें।",
        alertDescMonsoon: "मानसून चरण। पर्याप्त बारिश की उम्मीद। खरीफ बुवाई का अच्छा समय।",
        alertDescPostMonsoon: "मिट्टी की नमी आम तौर पर अच्छी है। अवशिष्ट नमी के आधार पर रबी फसलों की सावधानीपूर्वक योजना बनाएं।",
        resPrefixPart1: "",
        resPrefixPart2: " के बाद, अनुशंसित फसल:",
        lblExplanation: "व्याख्या",
        lblTimeline: "फसल चक्र समयरेखा",
        lblCardDuration: "अवधि",
        lblCardWater: "पानी की आवश्यकता",
        lblCardSoil: "मिट्टी को लाभ",
        lblCardProfit: "लाभ की संभावना",
        lblAltTitle: "वैकल्पिक फसलें",
        lblTipsTitle: "स्मार्ट किसान सुझाव",
        tip1: "पानी का उपयोग कम करने के लिए ड्रिप सिंचाई का उपयोग करें",
        tip2: "मिट्टी की उर्वरता में सुधार के लिए फलियों का चक्र अपनाएं",
        tip3: "बार-बार एक ही फसल लगाने से बचें",
        tip4: "मल्चिंग से मिट्टी की नमी बनाए रखने में मदद मिलती है",
        errCrop: "कृपया अपनी पिछली फसल चुनें।",
        errDistrict: "कृपया अपना जिला चुनें।",
        errWater: "कृपया जल उपलब्धता चुनें।",
        noMatch: "कोई मिलान नहीं मिला",
        cropNames: {
            'rice': 'धान (चावल)', 'soybean': 'सोयाबीन', 'cotton': 'कपास', 
            'wheat': 'गेहूँ', 'groundnut': 'मूंगफली', 'maize': 'मक्का', 
            'sorghum': 'ज्वार', 'millet': 'बाजरा', 'chickpea': 'चना',
            'coriander': 'धनिया', 'cucumber': 'ककड़ी', 'mustard': 'सरसों', 'pulses': 'दलहन'
        },
        baseRules: {
            'soybean': { next: 'wheat', desc: "सोयाबीन मिट्टी में नाइट्रोजन को ठीक करता है जो गेहूं के विकास को लाभ पहुंचाता है।", timeline: "अक्टूबर: सोयाबीन कटाई → नवंबर: मिट्टी की तैयारी → नवंबर अंत: गेहूं बुवाई", duration: "110-130 दिन", water: "मध्यम", benefit: "नाइट्रोजन उपयोग", profit: "मध्यम", alts: ['chickpea', 'mustard', 'millet'] },
            'rice': { next: 'pulses', desc: "दलहन धान के कीट चक्र को तोड़ते हैं और नाइट्रोजन बहाल करते हैं।", timeline: "नवंबर: धान कटाई → दिसंबर: खेत आराम → जनवरी: दलहन बुवाई", duration: "70-90 दिन", water: "कम", benefit: "उर्वरता बहाल", profit: "मध्यम", alts: ['wheat', 'mustard'] },
            'cotton': { next: 'chickpea', desc: "चना एक गहरी जड़ वाली फली है जो कपास के बाद अवशिष्ट नमी पर पनपती है।", timeline: "दिसंबर: कपास कटाई → जनवरी: जुताई → जनवरी/फरवरी: चना बुवाई", duration: "100-120 दिन", water: "कम", benefit: "कीट चक्र तोड़ता है", profit: "उच्च", alts: ['sorghum', 'groundnut'] },
            'maize': { next: 'mustard', desc: "मक्के की कटाई से बनी सख्त मिट्टी को सरसों की जड़ें तोड़ती हैं।", timeline: "अक्टूबर: मक्का कटाई → त्वरित तैयारी → नवंबर: सरसों बुवाई", duration: "100-120 दिन", water: "मध्यम", benefit: "मृदा अनुकूलन", profit: "मध्यम", alts: ['wheat', 'chickpea'] },
            'groundnut': { next: 'sorghum', desc: "ज्वार उच्च बायोमास पैदा करता है, मूंगफली द्वारा छोड़े गए नाइट्रोजन का उपयोग करता है।", timeline: "अक्टूबर: मूंगफली कटाई → आराम → दिसंबर: ज्वार बुवाई", duration: "100-115 दिन", water: "मध्यम", benefit: "बायोमास वृद्धि", profit: "मध्यम", alts: ['cotton', 'millet'] },
            'sorghum': { next: 'groundnut', desc: "मूंगफली उस नाइट्रोजन को पुनर्स्थापित करती है जिसे ज्वार निकालता है।", timeline: "दिसंबर: ज्वार कटाई → आराम → गर्मी: मूंगफली बुवाई", duration: "110-120 दिन", water: "मध्यम", benefit: "नाइट्रोजन फिक्सिंग", profit: "उच्च", alts: ['chickpea', 'millet'] },
            'millet': { next: 'chickpea', desc: "दोनों फसलें कम नमी वाले वातावरण में अच्छा प्रबंधन करती हैं।", timeline: "अक्टूबर: बाजरा कटाई → नमी संरक्षण → नवंबर: चना बुवाई", duration: "100-110 दिन", water: "कम", benefit: "नमी संरक्षण", profit: "मध्यम", alts: ['coriander', 'mustard'] },
            'chickpea': { next: 'maize', desc: "मक्का चने द्वारा छोड़े गए उत्कृष्ट मिट्टी के स्वास्थ्य का उपयोग करता है।", timeline: "मार्च: चना कटाई → गहरी जुताई → जून: मक्का बुवाई", duration: "90-110 दिन", water: "अधिक", benefit: "पोषक तत्वों का दोहन", profit: "उच्च", alts: ['cotton', 'soybean'] },
            'wheat': { next: 'soybean', desc: "सोयाबीन गेहूं के भारी पोषक तत्वों की निकासी को पुनर्स्थापित करता है।", timeline: "अप्रैल: गेहूं कटाई → ग्रीष्मकालीन परती → जून: सोयाबीन बुवाई", duration: "90-110 दिन", water: "मध्यम", benefit: "पोषक तत्व चक्र", profit: "उच्च", alts: ['maize', 'sorghum'] }
        },
        stressCrops: ['millet', 'coriander', 'cucumber', 'chickpea'],
        stressDesc: "अनुमानित पानी की कमी के कारण, कम अवधि और सूखा-सहिष्णु फसलों की सख्ती से अनुशंसा की जाती है।",
        stressTimeline: "नमी बचाने के लिए कम से कम जुताई के साथ तुरंत खेत तैयार करें। जल्द से जल्द बुवाई करें।",
        stressDuration: "45-90 दिन",
        stressProfit: "मध्यम (कम जोखिम)",
        optWaterLowText: "कम पानी"
    },
    mr: {
        pageTitle: "शेतकरी पीक फेरपालट व जल सल्लागार",
        pageSubtitle: "पीक फेरपालट, विभाग आणि पाण्याच्या उपलब्धतेनुसार पिकांची शिफारस मिळवा.",
        lblDate: "आजची सल्ला तारीख",
        lblCrop: "पायरी १: मागील घेतलेले पीक",
        cropPlaceholder: "पीक शोधा (उदा. सोयाबीन, भात)...",
        lblState: "राज्य",
        lblDistrict: "पायरी २: जिल्हा निवडा",
        districtPlaceholder: "जिल्हा शोधा...",
        lblPhase: "सध्याचा शेतीचा टप्पा",
        phasePreMonsoon: "मान्सूनपूर्व (कोरडा हंगाम)",
        phaseMonsoon: "पावसाळा (मान्सून)",
        phasePostMonsoon: "मान्सूनोत्तर हंगाम",
        lblWater: "पायरी ३: पाण्याची उपलब्धता",
        optWaterPlaceholder: "पाण्याची पातळी निवडा...",
        optWaterLow: "कमी पाणी (२ महिन्यांपेक्षा कमी सिंचन)",
        optWaterMed: "मध्यम पाणी (२-४ महिने सिंचन)",
        optWaterHigh: "जास्त पाणी (४ महिन्यांपेक्षा जास्त सिंचन)",
        lblSeason: "पायरी ४: हंगाम",
        optSeasonKharif: "खरीप",
        optSeasonRabi: "रब्बी",
        optSeasonSummer: "उन्हाळी",
        lblSoil: "पायरी ५: मातीचा प्रकार (पर्यायी)",
        optSoilAll: "कोणतीही माती",
        optSoilBlack: "काळी माती",
        optSoilRed: "लाल माती",
        optSoilSandy: "वाळू मिश्रित माती",
        optSoilClay: "चिकणमाती",
        btnSubmit: "पीक शिफारस मिळवा",
        alertDescWarning: "या भागात मार्च-मे दरम्यान अनेकदा पाणीटंचाई असते. कमी पाण्याच्या पिकांची अत्यंत शिफारस केली जाते.",
        alertDescNormal: "कोरडा हंगाम जवळ येत आहे. सिंचनाचे योग्य नियोजन करा.",
        alertDescMonsoon: "पावसाळ्याचा काळ. पुरेशा पावसाची शक्यता. खरीप पेरणीसाठी उत्तम काळ.",
        alertDescPostMonsoon: "मातीतील ओलावा चांगला असतो. उरलेल्या ओलाव्यानुसार रब्बी पिकांचे नियोजन करा.",
        resPrefixPart1: "",
        resPrefixPart2: " नंतर, शिफारस केलेले पीक:",
        lblExplanation: "स्पष्टीकरण",
        lblTimeline: "फेरपालट वेळापत्रक",
        lblCardDuration: "कालावधी",
        lblCardWater: "पाण्याची गरज",
        lblCardSoil: "मातीला फायदा",
        lblCardProfit: "नफ्याची शक्यता",
        lblAltTitle: "पर्यायी पिके",
        lblTipsTitle: "स्मार्ट शेतकरी टिप्स",
        tip1: "पाण्याचा वापर कमी करण्यासाठी ठिबक सिंचनाचा वापर करा",
        tip2: "मातीची सुपीकता वाढवण्यासाठी शेंगावर्गीय पिके घ्या",
        tip3: "तेच पीक वारंवार लावणे टाळा",
        tip4: "आच्छादनामुळे (मल्चिंग) मातीतील ओलावा टिकून राहण्यास मदत होते",
        errCrop: "कृपया तुमचे मागील पीक निवडा.",
        errDistrict: "कृपया तुमचा जिल्हा निवडा.",
        errWater: "कृपया पाण्याची उपलब्धता निवडा.",
        noMatch: "काहीही सापडले नाही",
        cropNames: {
            'rice': 'भात (तांदूळ)', 'soybean': 'सोयाबीन', 'cotton': 'कापूस', 
            'wheat': 'गहू', 'groundnut': 'भुईमूग', 'maize': 'मका', 
            'sorghum': 'ज्वारी', 'millet': 'बाजरी', 'chickpea': 'हरभरा',
            'coriander': 'कोथिंबीर', 'cucumber': 'काकडी', 'मोहरी': 'मोहरी', 'pulses': 'कडधान्ये'
        },
        baseRules: {
            'soybean': { next: 'wheat', desc: "सोयाबीन जमिनीत नत्र स्थिर करते ज्याचा गव्हाच्या वाढीला खूप फायदा होतो.", timeline: "ऑक्टोबर: सोयाबीन काढणी → नोव्हेंबर: पूर्वमशागत → नोव्हेंबर अखेर: गहू पेरणी", duration: "११०-१३० दिवस", water: "मध्यम", benefit: "नत्राचा उपयोग", profit: "मध्यम", alts: ['chickpea', 'mustard', 'millet'] },
            'rice': { next: 'pulses', desc: "कडधान्ये भाताचे कीड चक्र तोडतात आणि कमी झालेले नत्र पूर्ववत करतात.", timeline: "नोव्हेंबर: भात काढणी → डिसेंबर: जमीन विश्रांती → जानेवारी: कडधान्ये पेरणी", duration: "७०-९० दिवस", water: "कमी", benefit: "सुपीकता पूर्ववत", profit: "मध्यम", alts: ['wheat', 'mustard'] },
            'cotton': { next: 'chickpea', desc: "हरभरा हे खोल मुळे असलेले पीक आहे जे कापसानंतर उरलेल्या ओलाव्यावर चांगले येते.", timeline: "डिसेंबर: कापूस काढणी → जानेवारी: नांगरणी → जाने/फेब्रु: हरभरा पेरणी", duration: "१००-१२० दिवस", water: "कमी", benefit: "कीड चक्र तोडते", profit: "जास्त", alts: ['sorghum', 'groundnut'] },
            'maize': { next: 'mustard', desc: "मक्याच्या काढणीनंतर तयार झालेला कडक थर मोहरीची मुळे फोडतात.", timeline: "ऑक्टोबर: मका काढणी → त्वरित तयारी → नोव्हेंबर: मोहरी पेरणी", duration: "१००-१२० दिवस", water: "मध्यम", benefit: "माती सुधारणा", profit: "मध्यम", alts: ['wheat', 'chickpea'] },
            'groundnut': { next: 'sorghum', desc: "ज्वारी भरपूर बायोमास तयार करते आणि भुईमुगाने सोडलेल्या नत्राचा वापर करते.", timeline: "ऑक्टोबर: भुईमूग काढणी → नोव्हेंबर: विश्रांती → डिसेंबर: ज्वारी पेरणी", duration: "१००-११५ दिवस", water: "मध्यम", benefit: "बायोमास भर", profit: "मध्यम", alts: ['cotton', 'millet'] },
            'sorghum': { next: 'groundnut', desc: "ज्वारीने शोषून घेतलेले नत्र भुईमूग पुन्हा जमिनीत स्थिर करतो.", timeline: "डिसेंबर: ज्वारी काढणी → जमीन विश्रांती → उन्हाळी: भुईमूग पेरणी", duration: "११०-१२० दिवस", water: "मध्यम", benefit: "नत्र स्थिरीकरण", profit: "जास्त", alts: ['chickpea', 'millet'] },
            'millet': { next: 'chickpea', desc: "दोन्ही पिके कमी ओलाव्यात चांगली येतात, कोरडवाहूसाठी उत्तम.", timeline: "ऑक्टोबर: बाजरी काढणी → ओलावा टिकवा → नोव्हेंबर: हरभरा पेरणी", duration: "१००-११० दिवस", water: "कमी", benefit: "ओलावा संरक्षण", profit: "मध्यम", alts: ['coriander', 'mustard'] },
            'chickpea': { next: 'maize', desc: "हरभऱ्याने उत्तम केलेल्या जमिनीवर मका हे पीक जोमाने वाढते.", timeline: "मार्च: हरभरा काढणी → खोल नांगरणी → जून (खरीप): मका पेरणी", duration: "९०-११० दिवस", water: "जास्त", benefit: "पोषक घटकांचा वापर", profit: "जास्त", alts: ['cotton', 'soybean'] },
            'wheat': { next: 'soybean', desc: "गव्हामुळे कमी झालेले पोषक घटक पुढील खरिपातील सोयाबीन भरून काढते.", timeline: "एप्रिल: गहू काढणी → उन्हाळी परती → जून: सोयाबीन पेरणी", duration: "९०-११० दिवस", water: "मध्यम", benefit: "पोषक चक्र", profit: "जास्त", alts: ['maize', 'sorghum'] }
        },
        stressCrops: ['millet', 'coriander', 'cucumber', 'chickpea'],
        stressDesc: "पाणीटंचाईच्या शक्यतेमुळे, कमी कालावधीची आणि दुष्काळ-सहिष्णू पिके घेण्याची अत्यंत शिफारस केली जाते.",
        stressTimeline: "ओलावा टिकवण्यासाठी कमीत कमी मशागतीसह जमीन त्वरित तयार करा. लवकरात लवकर पेरणी करा.",
        stressDuration: "४५-९० दिवस",
        stressProfit: "मध्यम (कमी धोका)",
        optWaterLowText: "कमी पाणी"
    }
};

// --- ROUTES ---

// Health Check
app.get('/', (req, res) => {
    res.json({ status: "API is running" });
});

// Route to supply initial dropdown and language data to the frontend
app.get('/api/init', (req, res) => {
    res.json({ CROPS, REGIONS, i18n });
});

// Route for Recommendations
app.post('/api/recommend', (req, res) => {
    const { cropId, regionId, waterId, lang, month } = req.body;
    const languageData = i18n[lang] || i18n['en'];
    const rule = languageData.baseRules[cropId];

    if (!rule) {
        return res.status(400).json({ error: "Invalid crop selection." });
    }

    const currentMonth = month !== undefined ? month : new Date().getMonth();
    const isScarcityMonth = currentMonth >= 2 && currentMonth <= 4;
    const isStressRegion = regionId === 'marathwada' || regionId === 'vidarbha';
    const isWaterLow = waterId === 'low';
    
    const applyStressOverride = (isScarcityMonth && isStressRegion) || isWaterLow;
    let result = {};

    if (applyStressOverride) {
        let filteredStress = languageData.stressCrops.filter(c => c !== cropId);
        let primaryTarget = filteredStress[0]; 
        
        result = {
            recName: languageData.cropNames[primaryTarget],
            recDesc: languageData.stressDesc,
            recTimeline: languageData.stressTimeline,
            recDur: languageData.stressDuration,
            recWat: languageData.optWaterLowText,
            recSoil: rule.benefit,
            recProf: languageData.stressProfit,
            alts: filteredStress.slice(1).map(alt => ({ id: alt, name: languageData.cropNames[alt] }))
        };
    } else {
        result = {
            recName: languageData.cropNames[rule.next],
            recDesc: rule.desc,
            recTimeline: rule.timeline,
            recDur: rule.duration,
            recWat: rule.water,
            recSoil: rule.benefit,
            recProf: rule.profit,
            alts: rule.alts.map(alt => ({ id: alt, name: languageData.cropNames[alt] }))
        };
    }
    res.json(result);
});

app.listen(PORT, () => {
    console.log(`Backend API running on http://localhost:${PORT}`);
});