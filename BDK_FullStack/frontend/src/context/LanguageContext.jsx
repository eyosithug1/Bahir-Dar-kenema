import React, { createContext, useContext, useState, useEffect } from 'react';

export const translations = {
  en: {
    // Navigation
    clubName: 'Bahir Dar Kenema FC',
    clubSubtitle: 'The Waves of Lake Tana',
    home: 'Home',
    matches: 'Matches & Tickets',
    squad: 'Squad',
    news: 'News',
    shop: 'Store',
    fanWall: 'Fan Zone',
    login: 'Login',
    register: 'Sign Up',
    myAccount: 'My Account',
    adminPanel: 'Admin Panel',
    signOut: 'Sign Out',

    // Hero & Home
    heroTag: 'EST. 1973 • Ethiopian Premier League',
    heroTitlePrefix: 'Bahir Dar',
    heroTitleSuffix: 'Kenema FC',
    heroSubtitle: 'Passion, Pride, and Performance. Join the Blue Army and be part of our historic journey.',
    exploreSquad: 'Explore Squad',
    officialStore: 'Official Store',
    legacyTitle: 'Our Heritage',
    legacySubtitle: 'A Legacy Built on Passion',
    legacyDesc: 'A rich history spanning over 50 years, built on dedication and the love of football in the beautiful city of Bahir Dar.',

    // Stats
    founded: 'Founded',
    league: 'League',
    proPlayers: 'Pro Players',
    twelfthMan: '12th Man Army',

    // Matches & Tickets
    matchesTitle: 'Fixtures & Match Results',
    allMatches: 'All Matches',
    upcomingFixtures: 'Upcoming Fixtures',
    pastResults: 'Past Results',
    bookTickets: 'Book Tickets',
    ticketReference: 'Booking Reference',
    ticketsConfirmed: 'Tickets Confirmed!',

    // News
    newsTitle: 'Club News & Updates',
    newsSubtitle: 'Match reports, player interviews and official announcements',
    allNews: 'All News',
    readArticle: 'Read Article',
    comments: 'Comments',
    leaveComment: 'Leave a comment...',
    postComment: 'Post Comment',
    likeArticle: 'Like Article',

    // Shop
    shopTitle: 'Wear The Waves Of Tana',
    shopSubtitle: 'Official Bahir Dar Kenema kits and accessories',
    allCategories: 'All Categories',
    addToCart: 'Order Item',
    quickOrder: 'Quick Order',
    confirmOrder: 'Confirm Order',
    price: 'Price',

    // Community / Fan
    fanWallTitle: 'Official Fan Wall',
    fanWallSubtitle: 'Waves of Lake Tana Supporter Community',
    shareThoughts: 'Share your thoughts, chants and match predictions with fellow fans...',
    postMessage: 'Post on Fan Wall',
    chants: 'Official Club Chants',

    // General & Footer
    rightsReserved: 'All rights reserved.',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    bahirDarStadium: 'Bahir Dar International Stadium'
  },
  am: {
    // Navigation
    clubName: 'ባህር ዳር ከነማ እግር ኳስ ክለብ',
    clubSubtitle: 'የጣና ሞገዶች',
    home: 'ዋና ገጽ',
    matches: 'ጨዋታዎችና ቲኬት',
    squad: 'ተጫዋቾች',
    news: 'ዜናዎች',
    shop: 'መደብር',
    fanWall: 'ደጋፊዎች',
    login: 'ግባ',
    register: 'ተመዝገብ',
    myAccount: 'የግል መለያ',
    adminPanel: 'አድሚን ዳሽቦርድ',
    signOut: 'ውጣ',

    // Hero & Home
    heroTag: 'የተመሰረተው 1973 ዓ.ም • የኢትዮጵያ ፕሪሚየር ሊግ',
    heroTitlePrefix: 'ባህር ዳር',
    heroTitleSuffix: 'ከነማ እግር ኳስ ክለብ',
    heroSubtitle: 'ፍቅር፣ ኩራት እና ድል! የታላቁ የጣና ሞገዶች ሰማያዊ ሰራዊት አካል ይሁኑ።',
    exploreSquad: 'ተጫዋቾችን ይመልከቱ',
    officialStore: 'ኦፊሴላዊ መደብር',
    legacyTitle: 'የክለባችን ታሪክ',
    legacySubtitle: 'በስሜትና በቁርጠኝነት የተገነባ ታሪክ',
    legacyDesc: 'ከ50 ዓመታት በላይ በውቧ ባህር ዳር ከተማ ለእግር ኳስ ፍቅር የተገነባ የላቀ ታሪክ።',

    // Stats
    founded: 'የተመሰረተበት',
    league: 'ሊግ',
    proPlayers: 'ተጫዋቾች',
    twelfthMan: '12ኛው ተጫዋች',

    // Matches & Tickets
    matchesTitle: 'የጨዋታ መርሃ-ግብር እና ውጤቶች',
    allMatches: 'ሁሉም ጨዋታዎች',
    upcomingFixtures: 'ቀጣይ ጨዋታዎች',
    pastResults: 'ያለፉ ውጤቶች',
    bookTickets: 'ቲኬት ይቁረጡ',
    ticketReference: 'የቲኬት መለያ ኮድ',
    ticketsConfirmed: 'ቲኬቱ በተሳካ ሁኔታ ተቆርጧል!',

    // News
    newsTitle: 'የክለቡ የቅርብ ጊዜ ዜናዎች',
    newsSubtitle: 'የጨዋታ ዘገባዎች፣ የተጫዋቾች ቃለ-መጠይቆች እና ኦፊሴላዊ መግለጫዎች',
    allNews: 'ሁሉም ዜናዎች',
    readArticle: 'ሙሉውን አንብብ',
    comments: 'አስተያየቶች',
    leaveComment: 'አስተያየትዎን እዚህ ያስቀምጡ...',
    postComment: 'አስተያየት ላክ',
    likeArticle: 'ወድጄዋለሁ',

    // Shop
    shopTitle: 'የጣና ሞገዶችን ማልያ ይልበሱ',
    shopSubtitle: 'ኦፊሴላዊ የባህር ዳር ከነማ ማልያዎች እና መለያዎች',
    allCategories: 'ሁሉም ምድቦች',
    addToCart: 'ይዘዙ',
    quickOrder: 'ቀጥታ ይዘዙ',
    confirmOrder: 'ትዕዛዙን አረጋግጥ',
    price: 'ዋጋ',

    // Community / Fan
    fanWallTitle: 'የደጋፊዎች መድረክ',
    fanWallSubtitle: 'የጣና ሞገዶች ደጋፊዎች ማህበረሰብ',
    shareThoughts: 'ለክለቡ ያለዎትን ስሜት፣ መፈክሮችና የውጤት ግምቶችን ያጋሩ...',
    postMessage: 'መልዕክት ይለጥፉ',
    chants: 'የክለቡ ዝማሬዎች',

    // General & Footer
    rightsReserved: 'መብቱ በህግ የተጠበቀ ነው።',
    privacyPolicy: 'የግላዊነት ፖሊሲ',
    termsOfService: 'የአገልግሎት ውሎች',
    bahirDarStadium: 'ባህር ዳር ዓለም አቀፍ ስታዲየም'
  }
};

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key
});

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('bdk_language') || 'en';
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('bdk_language', lang);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations.en?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
