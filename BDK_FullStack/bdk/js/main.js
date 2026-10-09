// ==========================================
// BDK FC Website - Main JavaScript
// Premium UI/UX Implementation (Home Jersey Theme)
// ==========================================

// Translation Data
const translations = {
    en: {
        clubName: "Bahir Dar Kenema FC",
        nav: { home: "Home", about: "About", team: "Team", shop: "Shop", gallery: "Gallery", contact: "Contact", fanZone: "Fan Zone" },
        hero: { 
            title: "Bahir Dar Kenema FC", 
            subtitle: "Passion, Pride, and Performance. Join the Blue Army and be part of our historic journey.", 
            established: "EST. 1973",
            league: "Ethiopian Premier League",
            exploreSquad: "Explore Squad",
            officialStore: "Official Store"
        },
        stats: { founded: "Founded", league: "League", players: "Pro Players", fans: "Man Army" },
        about: {
            heritage: "Our Heritage",
            title: "A Legacy Built on Passion",
            subtitle: "A rich history spanning over 50 years, built on dedication and the love of football in the beautiful city of Bahir Dar.",
            founded: "Founded 1973 EC",
            foundedDesc: "Established in the heart of Bahir Dar, carrying the hopes and dreams of the entire region on our shoulders.",
            promotion: "Historic Promotion",
            promotionDesc: "Secured our place in the Ethiopian Premier League after a legendary match against Ethiopian Insurance F.C.",
            stadium: "Bahir Dar International Stadium",
            stadiumDesc: "The fortress of Blue Army."
        },
        team: {
            firstTeam: "First Team",
            squad: "Squad 2024/25",
            players: "Players",
            avgAge: "Avg Age",
            coachingStaff: "Coaching Staff",
            headCoach: "Head Coach",
            headCoachDesc: "Former Bahir Dar & Saint George player",
            assistantAnalyst: "Assistant & Analyst",
            assistantCoach: "Assistant Coach"
        },
        shop: {
            merchandise: "Merchandise",
            title: "Official Store",
            subtitle: "Wear the colors with pride. Authentic gear delivered straight to you.",
            searchPlaceholder: "Search merchandise...",
            addToCart: "Add to Cart",
            kitsJerseys: "Kits & Jerseys",
            trainingWear: "Training Wear",
            accessories: "Accessories"
        },
        fanZone: {
            the12thMan: "The 12th Man",
            title: "Heartbeat of the Club",
            subtitle: "From the roaring stands of our stadium to the away days across Ethiopia, your unwavering support is our ultimate motivation. We are nothing without the Blue Army.",
            exclusiveEvents: "Exclusive Fan Events",
            exclusiveEventsDesc: "Match pre-parties & meetups",
            awayTravel: "Away Travel",
            awayTravelDesc: "Organized transportation for away games",
            officialChants: "Official Chants",
            weAreBahirDar: "We Are Bahir Dar",
            weAreBahirDarChant: "From the lake to the stands,\nWe hold our flags in our hands.\nBlue and Gold, brave and bold,\nBahir Dar Kenema, a story told!",
            victoryChant: "Victory Chant",
            victoryChantLyrics: "Allez allez, Kenema allez!\nWe fight today, we win today!\nFor the city, for the pride,\nWe stand together, side by side!"
        },
        gallery: {
            moments: "Moments",
            title: "Visual History"
        },
        contact: {
            getInTouch: "Get in Touch",
            subtitle: "We're here to answer your questions.",
            firstName: "First Name",
            lastName: "Last Name",
            email: "Email Address",
            subject: "Select Subject...",
            tickets: "Tickets",
            store: "Store / Merch",
            general: "General Inquiry",
            message: "Your Message",
            sendMessage: "Send Message",
            successMessage: "Message sent successfully! We'll reply soon.",
            faqs: "FAQs",
            faqSubtitle: "Common questions from our fans."
        },
        footer: {
            description: "Professional football club with a rich history, competing at the highest level of Ethiopian football.",
            quickLinks: "Quick Links",
            aboutUs: "About Us",
            firstTeam: "First Team",
            clubStore: "Club Store",
            contact: "Contact",
            contactInfo: "Contact",
            address: "Bahir Dar, Ethiopia",
            phone: "+251 587 1234",
            email: "contact@bdkenema.com",
            copyright: "© 2024 Bahir Dar Kenema FC. All rights reserved.",
            privacyPolicy: "Privacy Policy",
            termsOfService: "Terms of Service"
        }
    },
    am: {
        clubName: "ባህር ዳር ከነማ እግር ኳስ ክለብ",
        nav: { 
            home: "መነሻ", 
            about: "ስለ እኛ", 
            team: "ቡድን", 
            shop: "ሱቅ", 
            gallery: "ጋለሪ", 
            contact: "አግኝን", 
            fanZone: "የአስተዋፅዖ ክፍል" 
        },
        hero: { 
            title: "ባህር ዳር ከነማ እግር ኳስ ክለብ", 
            subtitle: "ፍቅር፣ የተዋህዶነት፣ አፈፃፃም። የሰማይ ጦርነኛን ይቀላቀሉእን የታሪካችን ጉዞን ይርምጡ።", 
            established: "ተመሰረተ 1973",
            league: "የኢትዮጵያ ፕሪሚየር ሊግ",
            exploreSquad: "ቡድንን ይመልከቱ",
            officialStore: "ይፋጊያዊ መደብርነት"
        },
        stats: { 
            founded: "ተመሰረተ", 
            league: "ሊግ", 
            players: "ሙያዎች", 
            fans: "የሰማይ ጦርነኛ" 
        },
        about: {
            heritage: "የእኛ ህዝባት",
            title: "በፍቅር የተሰረቀ ዘላቂነት",
            subtitle: "በባህር ዳር ውቅራ ከተማ ውስጥ በፍቅርና በእግር ኳስ ፍቅር የተሰረቀ ከ50 ዓመታት በላይ የሚሆን ታሪካ።",
            founded: "ተመሰረተ 1973 ዓም",
            foundedDesc: "በባህር ዳር ልብ ውስጥ ተመሰርቶ የአካባቢውን ተስፋፎችና ሕልሞች በትየን የሚሸከም።",
            promotion: "ታሪካዊ ማሻሻሻ",
            promotionDesc: "ከኢትዮጵያ ኢንሹራንስ ኤፍሲ ጋር አስደናቂ ውድድር በኋላ በኢትዮጵያ ፕሪሚየር ሊግ ውስጥ ቦታችንን አረጋግግገዘ።",
            stadium: "የባህር ዳር አለላማዊ ስታዲየም",
            stadiumDesc: "የሰማይ ጦርነኛ ፍርድ።"
        },
        team: {
            firstTeam: "ዋና ቡድን",
            squad: "ቡድን 2024/25",
            players: "ሰዎች",
            avgAge: "አማኛዊ ዕድሜ",
            coachingStaff: "የልማተኞች ቡድን",
            headCoach: "ዋና ልማተኛ",
            headCoachDesc: "ቀደሚያው የባህር ዳርና የቅዱስ ጊዮርጊስ ተጫዋች",
            assistantAnalyst: "ረዳታ እና አናላስት",
            assistantCoach: "ረዳታ ልማተኛ"
        },
        shop: {
            merchandise: "የክለቡ እቃዎች",
            title: "ይፋጊያዊ መደብርነት",
            subtitle: "በግልጽልጽ የክለቡን ቀለሞች ይለብሱ። እውነቱ የሆነ እቃዎች ቀጥታ ወደእርስዎ ይደርሳሉ።",
            searchPlaceholder: "የክለቡን እቃዎች ይፈልግ...",
            addToCart: "ወደ መሸጫው ይጨምሩ",
            kitsJerseys: "ኩልቶች እና ጀርሲዎች",
            trainingWear: "የልማታ ልበሳዎች",
            accessories: "አክሴሰሪዎች"
        },
        fanZone: {
            the12thMan: "12ኛው ሰው",
            title: "የክለቡ ልብ",
            subtitle: "ከስታዲየማችን የሚያፈሩበትን ቀላቅቶች እስከ በኢትዮጵያ ውስጥ ያሉ የውጭ ጨዋታዎች ድረስ፣ ያልተለወጠነው ድጋፍዎን የመጨረሻዎ ኃይል ነው። የሰማይ ጦርነኛ ሳለን ምንም አናለን።",
            exclusiveEvents: "የተወሰኑ የአስተዋፅዖ ዝግጅቶች",
            exclusiveEventsDesc: "የጨዋታ ቅድመ-ተከታታዎች እና ምግጣጭ ተሰባሪዎች",
            awayTravel: "ውጭ ጉዞች",
            awayTravelDesc: "ለውጭ ጨዋታዎች የተደበተ ትራንስፖርት",
            officialChants: "ይፋጊያዊ ዘፈኖች",
            weAreBahirDar: "ባህር ዳር ነን",
            weAreBahirDarChant: "ከሀይቅ ወደ ቀላቅቶች,\nባእጆችዎ ባንደባዎችን እናደብል።\nሰማይና ወርቅ የተራበትና የተዋጋጋገ,\nባህር ዳር ከነማ የተነገረ ታሪክ!",
            victoryChant: "የድልድይ ዘፈን",
            victoryChantLyrics: "አሌ አሌ ከነማ አሌ!\nዛሬ እየልፍ ዛሬ እናሸናለሁ!\nለከተማው ለክብርነት,\nአንድላይ እንቆማለን!"
        },
        gallery: {
            moments: "እቅፎች",
            title: "የስዕይ ታሪክ"
        },
        contact: {
            getInTouch: "አግኝን",
            subtitle: "ጥያቄዎትዎን ለመመለስ እዚህ ነን።",
            firstName: "የመጀመሪያ ስም",
            lastName: "የአያድነት ስም",
            email: "ኢሜል አድራስ",
            subject: "ርዕሰት ይምረጡ...",
            tickets: "ትኬቶች",
            store: "መደብርነት / እቃዎች",
            general: "አጠቃቃር ጥያቄ",
            message: "መ massageዎ",
            sendMessage: "Massage ይላኩ",
            successMessage: "Massage በተሳካ ተልኮ! በቅርብ እንመልሳለን።",
            faqs: "ተለላዋጭ ጥያቄዎች",
            faqSubtitle: "ከአስተዋፅዖዎች የሚጠየቁ የተለመዱ ጥያቄዎች።"
        },
        footer: {
            description: "በኢትዮጵያ እግር ኳስ ከፍተኛ ደረጃ ላይ የሚያውላ የረዥማ ታሪካ ያለው ፕሮፌሽናል እግር ኳስ ክለብ።",
            quickLinks: "ፈጣን አገናኞች",
            aboutUs: "ስለ እኛ",
            firstTeam: "ዋና ቡድን",
            clubStore: "የክለቡ መደብርነት",
            contact: "አግኝን",
            contactInfo: "አግኝን",
            address: "ባህር ዳር፣ ኢትዮጵያ",
            phone: "+251 587 1234",
            email: "contact@bdkenema.com",
            copyright: "© 2024 ባህር ዳር ከነማ እግር ኳስ ክለብ። መብቱ በህግየት የተጠበቀ ነው።",
            privacyPolicy: "የግላጭነት ፖሊሲ",
            termsOfService: "የአገልግሎት ውልዌናት"
        }
    }
};

let currentLang = 'en';

// ==========================================
// Data Collections
// ==========================================

const squadData = [
    { name: "Pape N'Diaye", country: "Senegal", age: 34, number: 1, position: "Goalkeeper", role: "GK" },
    { name: "Yigermal Mequanint", country: "Ethiopia", age: 21, number: 16, position: "Goalkeeper", role: "GK" },
    { name: "Saido Pepe", country: "Ethiopia", age: 25, number: 30, position: "Goalkeeper", role: "GK" },
    { name: "Boubacar Doumbia", country: "Mali", age: 33, number: 2, position: "Defender", role: "DF" },
    { name: "Wendimeneh Dereje", country: "Ethiopia", age: 26, number: 3, position: "Defender", role: "DF" },
    { name: "Yihenew Yemata", country: "Ethiopia", age: 28, number: 4, position: "Defender", role: "DF" },
    { name: "Amsalu Sale", country: "Ethiopia", age: 24, number: 5, position: "Defender", role: "DF" },
    { name: "Fitsum Fitalew", country: "Ethiopia", age: 27, number: 13, position: "Defender", role: "DF" },
    { name: "Kidus Yohanes", country: "Ethiopia", age: 22, number: 15, position: "Defender", role: "DF" },
    { name: "Kindu Bayelign", country: "Ethiopia", age: 29, number: 21, position: "Defender", role: "DF" },
    { name: "Getachew Anemut", country: "Ethiopia", age: 28, number: 22, position: "Defender", role: "DF" },
    { name: "Mesay Agegnehu", country: "Ethiopia", age: 25, number: 24, position: "Defender", role: "DF" },
    { name: "Girma Disasa", country: "Ethiopia", age: 26, number: 27, position: "Defender", role: "DF" },
    { name: "Frezer Kasa", country: "Ethiopia", age: 23, number: 33, position: "Defender", role: "DF" },
    { name: "Bereket Tigabu", country: "Ethiopia", age: 27, number: 6, position: "Midfielder", role: "MF" },
    { name: "Fikremichael Alemu", country: "Ethiopia", age: 29, number: 8, position: "Midfielder", role: "MF" },
    { name: "Henok Yebeltal", country: "Ethiopia", age: 26, number: 10, position: "Midfielder", role: "MF" },
    { name: "Fitsum Alemu", country: "Ethiopia", age: 25, number: 14, position: "Midfielder", role: "MF" },
    { name: "Daniel Hailu", country: "Ethiopia", age: 24, number: 18, position: "Midfielder", role: "MF" },
    { name: "Hailu Hassen", country: "Ethiopia", age: 22, number: 20, position: "Midfielder", role: "MF" },
    { name: "Metages Mulye", country: "Ethiopia", age: 21, number: 23, position: "Midfielder", role: "MF" },
    { name: "Kwabena Boateng", country: "Ghana", age: 28, number: 7, position: "Forward", role: "FW" },
    { name: "Seth Osei", country: "Ghana", age: 27, number: 9, position: "Forward", role: "FW" },
    { name: "Amanuel Gebremichael", country: "Ethiopia", age: 25, number: 11, position: "Forward", role: "FW" },
    { name: "Wondwessen Belete", country: "Ethiopia", age: 26, number: 12, position: "Forward", role: "FW" },
    { name: "Yohannes Dereje", country: "Ethiopia", age: 23, number: 17, position: "Forward", role: "FW" },
    { name: "Anteneh Tefera", country: "Ethiopia", age: 24, number: 19, position: "Forward", role: "FW" },
    { name: "Feysel Ahmed", country: "Ethiopia", age: 22, number: 25, position: "Forward", role: "FW" },
    { name: "Chernet Gugsa", country: "Ethiopia", age: 27, number: 26, position: "Forward", role: "FW" },
    { name: "Mujib Kassim", country: "Ethiopia", age: 25, number: 28, position: "Forward", role: "FW" },
    { name: "Firew Solomon", country: "Ethiopia", age: 23, number: 29, position: "Forward", role: "FW" },
    { name: "Jerome Philip", country: "Nigeria", age: 26, number: 31, position: "Forward", role: "FW" },
    { name: "Kidanemaryam Tasfaye", country: "Ethiopia", age: 21, number: 32, position: "Forward", role: "FW" }
];

const shopData = [
    { id: 1, name: "Home Jersey 2024/25", price: 850, oldPrice: 1200, category: "Kits & Jerseys", image: "BDK_asset/club jerssey/1ndkit (1).webp", badges: ["New", "Bestseller"], discount: "-29%" },
    { id: 2, name: "Away Jersey 2024/25", price: 850, category: "Kits & Jerseys", image: "BDK_asset/club jerssey/2ndkit.webp", badges: ["Popular"] },
    { id: 3, name: "Third Jersey Limited", price: 950, category: "Kits & Jerseys", image: "BDK_asset/club jerssey/3rdkit.webp", badges: ["Limited", "Exclusive"], stockWarning: "Only 15 left" },
    { id: 4, name: "Training Kit Pro", price: 650, category: "Training Wear", image: "BDK_asset/club jerssey/images (42).jpeg", badges: ["Pro Gear"] },
    { id: 5, name: "Team Scarf", price: 350, category: "Accessories", isGeneric: true },
    { id: 6, name: "Baseball Cap", price: 450, category: "Accessories", isGeneric: true },
    { id: 7, name: "Water Bottle", price: 280, category: "Accessories", isGeneric: true },
    { id: 8, name: "Phone Case", price: 320, category: "Accessories", isGeneric: true },
    { id: 9, name: "Backpack", price: 680, category: "Accessories", isGeneric: true },
    { id: 10, name: "Keychain", price: 150, category: "Accessories", isGeneric: true }
];

const galleryData = [
    { src: "BDK_asset/club stadium/Stade-Bahir-Dar-et-annexe-Ethiopie-2.webp", title: "Bahir Dar Stadium", desc: "Our home ground", category: "stadium" },
    { src: "BDK_asset/club stadium/images (19).jpeg", title: "Stadium Interior", desc: "View from the stands", category: "stadium" },
    { src: "BDK_asset/club stadium/images (20).jpeg", title: "Night Match", desc: "Under the lights", category: "stadium" },
    { src: "BDK_asset/club jerssey/1ndkit (1).webp", title: "Home Kit", desc: "Official Colors", category: "jerseys" },
    { src: "BDK_asset/club jerssey/images (40).jpeg", title: "Kit Showcase", desc: "Premium quality", category: "jerseys" },
    { src: "BDK_asset/club fan/images (27).jpeg", title: "12th Man", desc: "Passionate Supporters", category: "fans" },
    { src: "BDK_asset/club fan/images (29).jpeg", title: "Fan Unity", desc: "Together we stand", category: "fans" },
    { src: "BDK_asset/club team squad/bahir-dar-kenema-continue-chasing-saint-george-in-the-v0-20zfjd3aspsa1.jpg", title: "Match Action", desc: "On the field", category: "squad" },
    { src: "BDK_asset/club team squad/images (43).jpeg", title: "Team Unity", desc: "Pre-match huddle", category: "squad" }
];

const faqData = [
    { q: "How can I buy match tickets?", a: "Purchase through our official website, stadium ticket office, or authorized vendors. We offer single tickets, season passes, and VIP." },
    { q: "What are the stadium opening hours?", a: "Ticket office: Mon-Fri 9AM-6PM, match days 8AM until kickoff. Admin offices: Mon-Fri 8:30AM-5:30PM." },
    { q: "How can I join the youth academy?", a: "Annual tryouts for players 8-18. Register online or visit the academy office for details." },
    { q: "Do you offer stadium tours?", a: "Yes! Guided tours every Saturday at 10AM and 2PM. Book in advance." }
];

// ==========================================
// Initialization
// ==========================================

// Loading screen functionality
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    if (loadingScreen) {
        // Fade out loading screen
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1500); // Show loading for 1.5 seconds
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set initial language
    updateLanguage('en');
    
    // Render dynamic content
    renderSquad();
    renderShop();
    renderGallery();
    renderFAQs();
    
    // Add event listeners
    // Language switcher is handled in initInteractions()
    
    initInteractions();
    initScrollAnimations();
    initParallax();
});

// ==========================================
// Rendering Functions
// ==========================================

function renderSquad() {
    const roles = { "GK": "Goalkeepers", "DF": "Defenders", "MF": "Midfielders", "FW": "Forwards" };
    const colors = { "GK": "teal", "DF": "green", "MF": "purple", "FW": "red" };
    const container = document.getElementById('squad-container');
    if (!container) return;

    let html = '';
    
    Object.keys(roles).forEach(role => {
        const players = squadData.filter(p => p.role === role);
        if (players.length === 0) return;
        
        const color = colors[role];
        
        html += `
            <div class="mb-16">
                <h3 class="text-2xl font-bold text-white mb-8 flex items-center gap-4">
                    <span class="w-10 h-10 bg-` + color + `-500/20 border border-` + color + `-400/50 text-` + color + `-300 rounded-lg flex items-center justify-center text-sm font-bold shadow-[0_0_15px_rgba(var(--` + color + `-500),0.3)]">` + role + `</span>
                    <span class="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">` + roles[role] + `</span>
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        `;
        
        players.forEach(p => {
            html += `
                <div class="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md transition-all duration-500 hover:scale-[1.02] hover:bg-white/10 hover:border-white/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-2">
                    <div class="absolute inset-0 bg-gradient-to-br from-` + color + `-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div class="p-6 relative z-10">
                        <div class="flex justify-between items-start mb-6">
                            <span class="text-4xl font-black text-white/10 group-hover:text-` + color + `-300/30 transition-colors duration-500">#` + p.number + `</span>
                            <span class="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-bold text-white">` + p.age + ` YRS</span>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="w-14 h-14 rounded-full bg-bdk-dark border border-white/20 flex items-center justify-center flex-shrink-0 group-hover:border-` + color + `-400 transition-colors duration-500 shadow-md">
                                <svg class="w-6 h-6 text-blue-200 group-hover:text-` + color + `-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                </svg>
                            </div>
                            <div>
                                <h4 class="text-lg font-bold text-white mb-1 leading-tight group-hover:text-` + color + `-400 transition-colors">` + p.name + `</h4>
                                <div class="flex items-center gap-2">
                                    <div class="w-1.5 h-1.5 rounded-full bg-` + color + `-400"></div>
                                    <span class="text-sm text-blue-200 font-medium">` + p.country + `</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Animated bottom border -->
                    <div class="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-` + color + `-400 to-` + color + `-600 group-hover:w-full transition-all duration-500"></div>
                </div>
            `;
        });
        
        html += `</div></div>`;
    });
    
    container.innerHTML = html;
}

function renderShop() {
    const container = document.getElementById('shop-container');
    if (!container) return;

    const t = translations[currentLang].shop;
    let html = '';
    shopData.forEach(item => {
        let badgeHtml = '';
        if (item.badges) {
            item.badges.forEach(b => {
                badgeHtml += `<span class="bg-bdk-accent-500/20 text-bdk-accent-500 border border-bdk-accent-500/30 px-2 py-1 rounded text-xs font-bold tracking-wider uppercase backdrop-blur-sm">${b}</span> `;
            });
        }
        
        const imageContent = item.isGeneric 
            ? `<div class="w-full h-full flex items-center justify-center bg-white/5"><span class="text-blue-200 font-medium">${item.name}</span></div>`
            : `<img src="${item.image}" alt="${item.name}" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700">`;

        html += `
            <div class="shop-card group relative overflow-hidden rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md transition-all duration-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-2">
                <div class="relative h-64 overflow-hidden bg-gradient-to-b from-white/10 to-transparent p-6 flex items-center justify-center">
                    ${imageContent}
                    <div class="absolute top-4 left-4 flex flex-col gap-2 z-10">${badgeHtml}</div>
                    ${item.discount ? `<div class="absolute top-4 right-4 bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded text-xs font-bold backdrop-blur-sm">${item.discount}</div>` : ''}
                    ${item.stockWarning ? `<div class="absolute bottom-4 left-4 bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-1 rounded text-xs font-bold backdrop-blur-sm">${item.stockWarning}</div>` : ''}
                </div>
                
                <div class="p-6 border-t border-white/10">
                    <p class="text-xs text-bdk-light font-bold tracking-widest uppercase mb-2">${item.category}</p>
                    <h4 class="text-lg font-bold text-white mb-4 line-clamp-1">${item.name}</h4>
                    
                    <div class="flex items-center justify-between mb-6">
                        <div class="flex items-end gap-2">
                            <span class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-bdk-accent-500 to-yellow-200">ETB ${item.price}</span>
                            ${item.oldPrice ? `<span class="text-sm text-blue-300 line-through mb-1 font-medium">ETB ${item.oldPrice}</span>` : ''}
                        </div>
                    </div>
                    
                    <button class="w-full py-3 rounded-xl bg-white/10 hover:bg-bdk-accent-500 text-white hover:text-bdk-dark font-black border border-white/20 hover:border-transparent transition-all duration-300 flex items-center justify-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                        ${t.addToCart}
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function renderGallery() {
    const container = document.getElementById('gallery-container');
    if (!container) return;

    let html = '';
    galleryData.forEach(item => {
        html += `
            <div class="gallery-item group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-500 border border-white/10" data-category="${item.category}">
                <img src="${item.src}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                <div class="absolute inset-0 bg-gradient-to-t from-bdk-dark/90 via-bdk-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div class="absolute bottom-0 left-0 p-6 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                        <h4 class="text-xl font-bold text-white mb-1">${item.title}</h4>
                        <p class="text-sm text-blue-200">${item.desc}</p>
                    </div>
                    <div class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function renderFAQs() {
    const container = document.getElementById('faq-container');
    if (!container) return;

    let html = '';
    faqData.forEach((faq, i) => {
        html += `
            <div class="border border-white/20 rounded-xl bg-white/5 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-bdk-light/50 shadow-sm">
                <button class="w-full text-left px-6 py-4 flex justify-between items-center text-white font-bold hover:text-bdk-accent-500 faq-toggle focus:outline-none">
                    <span>${faq.q}</span>
                    <div class="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center transition-transform duration-300">
                        <svg class="w-4 h-4 text-bdk-accent-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </button>
                <div class="faq-content hidden px-6 pb-5 pt-0 text-blue-200 text-sm leading-relaxed border-t border-white/10 mt-2 font-medium">
                    <p class="pt-3">${faq.a}</p>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ==========================================
// Interactions & Logic
// ==========================================

function initInteractions() {
    // Mobile Menu
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileBtn.classList.toggle('bg-white/20');
        });
    }

    // Language Switcher
    const langSwitcher = document.getElementById('langSwitcher');
    if (langSwitcher) {
        langSwitcher.addEventListener('click', () => {
            updateLanguage(currentLang === 'en' ? 'am' : 'en');
        });
    }

    // Shop Search
    const searchInput = document.getElementById('shopSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('.shop-card').forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(term) ? 'block' : 'none';
            });
        });
    }

    // FAQ Toggles (Dynamic)
    document.addEventListener('click', (e) => {
        const toggle = e.target.closest('.faq-toggle');
        if (toggle) {
            const content = toggle.nextElementSibling;
            const icon = toggle.querySelector('svg');
            
            // Close others
            document.querySelectorAll('.faq-content').forEach(c => {
                if(c !== content && !c.classList.contains('hidden')) {
                    c.classList.add('hidden');
                    c.previousElementSibling.querySelector('svg').parentElement.classList.remove('rotate-180');
                }
            });

            content.classList.toggle('hidden');
            icon.parentElement.classList.toggle('rotate-180');
        }
    });

    // Contact Form
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-bdk-dark inline" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Sending...`;
            
            setTimeout(() => {
                form.reset();
                btn.innerHTML = originalText;
                const msg = document.getElementById('successMessage');
                msg.classList.remove('hidden', 'opacity-0');
                msg.classList.add('opacity-100');
                setTimeout(() => {
                    msg.classList.remove('opacity-100');
                    setTimeout(() => msg.classList.add('hidden'), 300);
                }, 4000);
            }, 1500);
        });
    }
}

function updateLanguage(lang) {
    currentLang = lang;
    const span = document.getElementById('currentLang');
    if (span) span.textContent = lang === 'en' ? 'EN' : 'አማ';
    
    // Set RTL for Amharic and handle navigation order
    const desktopNav = document.getElementById('desktopNav');
    if (lang === 'am') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.body.classList.add('rtl');
        // Reverse navigation order for RTL
        if (desktopNav) {
            const navItems = Array.from(desktopNav.children);
            navItems.reverse();
            desktopNav.innerHTML = '';
            navItems.forEach(item => desktopNav.appendChild(item));
        }
    } else {
        document.documentElement.removeAttribute('dir');
        document.body.classList.remove('rtl');
        // Restore original navigation order for LTR
        if (desktopNav) {
            const navItems = Array.from(desktopNav.children);
            navItems.reverse();
            desktopNav.innerHTML = '';
            navItems.forEach(item => desktopNav.appendChild(item));
        }
    }
    
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        const keys = key.split('.');
        let val = translations[lang];
        keys.forEach(k => { if(val) val = val[k]; });
        if (val) {
            // Handle newlines in text
            if (typeof val === 'string' && val.includes('\n')) {
                el.innerHTML = val.replace(/\n/g, '<br>');
            } else {
                el.textContent = val;
            }
        }
    });
    
    // Handle placeholder translations
    document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
        const key = el.getAttribute('data-translate-placeholder');
        const keys = key.split('.');
        let val = translations[lang];
        keys.forEach(k => { if(val) val = val[k]; });
        if (val) {
            el.placeholder = val;
        }
    });
    
    // Update dynamic content
    updateDynamicContent(lang);
}

function updateDynamicContent(lang) {
    // Update squad section headers
    const squadContainer = document.getElementById('squad-container');
    if (squadContainer && squadContainer.innerHTML) {
        renderSquad();
    }
    
    // Update shop section
    const shopContainer = document.getElementById('shop-container');
    if (shopContainer && shopContainer.innerHTML) {
        renderShop();
    }
    
    // Update gallery section
    const galleryContainer = document.getElementById('gallery-container');
    if (galleryContainer && galleryContainer.innerHTML) {
        renderGallery();
    }
    
    // Update contact form
    updateContactForm(lang);
    // Update FAQs
    updateFAQs(lang);
    // Update footer
    updateFooter(lang);
}

function updateContactForm(lang) {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const t = translations[lang].contact;
    const inputs = form.querySelectorAll('input[placeholder], textarea[placeholder]');
    inputs.forEach(input => {
        const placeholder = input.getAttribute('placeholder');
        if (placeholder && t[placeholder]) {
            input.placeholder = t[placeholder];
        }
    });
    
    const selects = form.querySelectorAll('select');
    selects.forEach(select => {
        const options = select.querySelectorAll('option');
        options.forEach(option => {
            const value = option.value;
            if (value && t[value]) {
                option.textContent = t[value];
            }
        });
    });
    
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn && t.sendMessage) {
        submitBtn.textContent = t.sendMessage;
    }
}

function updateFAQs(lang) {
    const faqContainer = document.getElementById('faq-container');
    if (!faqContainer) return;
    
    renderFAQs();
}

function updateFooter(lang) {
    const t = translations[lang].footer;
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (key.startsWith('footer.') && t[key.replace('footer.', '')]) {
            el.textContent = t[key.replace('footer.', '')];
        }
    });
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    
    // Navbar scroll effect
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if(window.scrollY > 50) {
            header.classList.add('py-2', 'bg-bdk-bg/95', 'shadow-lg', 'backdrop-blur-xl', 'border-white/10');
            header.classList.remove('py-4', 'bg-bdk-bg/80', 'border-white/5');
        } else {
            header.classList.add('py-4', 'bg-bdk-bg/80', 'border-white/5');
            header.classList.remove('py-2', 'bg-bdk-bg/95', 'shadow-lg', 'border-white/10');
        }
    });
}

function initParallax() {
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * -0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * -0.01;
        document.querySelectorAll('.parallax-bg').forEach(bg => {
            bg.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
        });
    });
}
