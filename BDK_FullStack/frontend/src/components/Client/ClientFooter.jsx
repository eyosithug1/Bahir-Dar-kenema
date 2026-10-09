import React from 'react';

function ClientFooter() {
  return (
    <footer className="bg-bdk-dark border-t border-white/10 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-bdk-accent mb-4">BDK</h3>
            <p className="text-gray-400 text-sm">
              Bahir Dar Kenema FC - The Pride of Ethiopia
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Ethiopian Premier League Champions
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-bdk-accent transition">Home</a></li>
              <li><a href="/matches" className="hover:text-bdk-accent transition">Matches & Tickets</a></li>
              <li><a href="/squad" className="hover:text-bdk-accent transition">First Team Squad</a></li>
              <li><a href="/news" className="hover:text-bdk-accent transition">News & Articles</a></li>
              <li><a href="/shop" className="hover:text-bdk-accent transition">Official Store</a></li>
              <li><a href="/fan-wall" className="hover:text-bdk-accent transition">Fan Wall</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: info@bdkenema.com</li>
              <li>Phone: +251 900 000 000</li>
              <li>Location: Bahir Dar, Ethiopia</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-white mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-bdk-accent hover:text-bdk-light transition text-2xl">f</a>
              <a href="#" className="text-bdk-accent hover:text-bdk-light transition text-2xl">T</a>
              <a href="#" className="text-bdk-accent hover:text-bdk-light transition text-2xl">I</a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 text-sm">
            © 2026 Bahir Dar Kenema FC. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500 mt-4 md:mt-0">
            <a href="#" className="hover:text-bdk-accent transition">Privacy Policy</a>
            <a href="#" className="hover:text-bdk-accent transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default ClientFooter;
