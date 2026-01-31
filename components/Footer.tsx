"use client";

import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Adriaticbay <span className="bg-gradient-to-r from-red-600 to-amber-500 bg-clip-text text-transparent">Exotics</span>
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Experience the ultimate in luxury car rentals. Drive your dreams.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-gradient-to-r hover:from-red-600 hover:to-amber-500 flex items-center justify-center transition-all">
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-gradient-to-r hover:from-red-600 hover:to-amber-500 flex items-center justify-center transition-all">
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-gradient-to-r hover:from-red-600 hover:to-amber-500 flex items-center justify-center transition-all">
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-gradient-to-r hover:from-red-600 hover:to-amber-500 flex items-center justify-center transition-all">
                <Linkedin className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Our Fleet</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Testimonials</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Blog</a></li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Services</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Luxury Rentals</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Wedding Cars</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Corporate Events</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Chauffeur Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Long-term Lease</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Contact Us</h4>
            <ul className="space-y-4">
              <li className="text-gray-400">
                <div className="flex items-center gap-3 mb-1">
                  <Phone className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span className="font-semibold text-white">CEO Emanuel</span>
                </div>
                <a href="tel:+17272245544" className="text-gray-400 hover:text-amber-400 transition-colors ml-8">
                  +1 (727) 224-5544
                </a>
                <p className="text-xs text-gray-500 ml-8">Italian, Spanish, English</p>
              </li>
              <li className="text-gray-400">
                <div className="flex items-center gap-3 mb-1">
                  <Phone className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span className="font-semibold text-white">CEO Volis</span>
                </div>
                <a href="tel:+17279220141" className="text-gray-400 hover:text-amber-400 transition-colors ml-8">
                  +1 (727) 922-0141
                </a>
                <p className="text-xs text-gray-500 ml-8">Albanian, Greek, English</p>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                <a href="mailto:AdriaticBayExoticsLLC@gmail.com" className="hover:text-amber-400 transition-colors break-all">
                  AdriaticBayExoticsLLC@gmail.com
                </a>
              </li>
              <li className="text-gray-400 text-sm">
                <div className="font-semibold text-white mb-1">Business Hours</div>
                <div className="text-xs">Mon-Sun: 8am - 11pm</div>
                <div className="text-xs text-gray-500">After hours available</div>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 Adriaticbay Exotics. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-amber-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-amber-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-amber-400 transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
