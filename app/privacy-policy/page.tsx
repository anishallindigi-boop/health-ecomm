// app/privacy-policy/page.tsx or pages/privacy-policy.tsx

import React from 'react';
import Head from 'next/head';
import { 
  Shield, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Package, 
  Truck, 
  HeadphonesIcon, 
  Megaphone, 
  Lock, 
  CreditCard,
  CheckCircle
} from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <>
  

      <main className="min-h-screen bg-[#fdfbf7] text-[#44403c]">
        {/* Header */}
        <header className="bg-background text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-lg text-green-100">Multani Pansari</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
          {/* Introduction */}
          <p className="text-lg leading-relaxed text-center max-w-2xl mx-auto">
            Multani Pansari respects your privacy and protects your personal information.
          </p>

          {/* Information We Collect */}
          <section className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700">
                <User size={24} />
              </div>
              <h2 className="text-2xl font-bold text-green-900">Information We Collect</h2>
            </div>
            
            <ul className="space-y-4">
              <li className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <User className="text-blue-600 shrink-0" size={20} />
                <span>Name</span>
              </li>
              <li className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Phone className="text-blue-600 shrink-0" size={20} />
                <span>Contact number</span>
              </li>
              <li className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Mail className="text-blue-600 shrink-0" size={20} />
                <span>Email address</span>
              </li>
              <li className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <MapPin className="text-blue-600 shrink-0" size={20} />
                <span>Shipping address</span>
              </li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-700">
                <Package size={24} />
              </div>
              <h2 className="text-2xl font-bold text-green-900">How We Use Your Information</h2>
            </div>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Package className="text-green-600 mt-1 shrink-0" size={20} />
                <span>Order processing</span>
              </li>
              <li className="flex items-start gap-3">
                <Truck className="text-green-600 mt-1 shrink-0" size={20} />
                <span>Delivery coordination</span>
              </li>
              <li className="flex items-start gap-3">
                <HeadphonesIcon className="text-green-600 mt-1 shrink-0" size={20} />
                <span>Customer support</span>
              </li>
              <li className="flex items-start gap-3">
                <Megaphone className="text-green-600 mt-1 shrink-0" size={20} />
                <span>Promotional communication <span className="text-stone-500">(if opted)</span></span>
              </li>
            </ul>
          </section>

          {/* Data Protection */}
          <section className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700">
                <Lock size={24} />
              </div>
              <h2 className="text-2xl font-bold text-green-900">Data Protection</h2>
            </div>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Shield className="text-amber-600 mt-1 shrink-0" size={20} />
                <span>We do not sell or share your personal data with third parties.</span>
              </li>
              <li className="flex items-start gap-3">
                <CreditCard className="text-amber-600 mt-1 shrink-0" size={20} />
                <span>Payment details are securely processed through trusted payment gateways.</span>
              </li>
            </ul>
          </section>

          {/* Agreement */}
          <section className="bg-green-900 text-white rounded-2xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle size={48} className="text-green-300" />
            </div>
            <p className="text-lg">
              By using our website, you agree to this Privacy Policy.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}