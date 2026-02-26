// app/shipping-policy/page.tsx or pages/shipping-policy.tsx

import React from 'react';
import Head from 'next/head';
import { 
  Package, 
  Clock, 
  Truck, 
  MapPin, 
  CreditCard, 
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function ShippingPolicy() {
  return (
    <>
   
      <main className="min-h-screen bg-[#fdfbf7] text-[#44403c]">
        {/* Header */}
        <header className="bg-background text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Shipping Policy</h1>
            <p className="text-lg text-green-100">Multani Pansari</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
          {/* Introduction */}
          <p className="text-lg leading-relaxed text-center max-w-2xl mx-auto">
            At Multani Pansari, we aim to deliver your Ayurvedic products safely and on time.
          </p>

          {/* Order Processing */}
          <section className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-700">
                <Package size={24} />
              </div>
              <h2 className="text-2xl font-bold text-green-900">Order Processing</h2>
            </div>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Clock className="text-green-600 mt-1 shrink-0" size={20} />
                <span>Orders are processed within <strong>1–3 working days</strong> after confirmation.</span>
              </li>
              <li className="flex items-start gap-3">
                <Calendar className="text-green-600 mt-1 shrink-0" size={20} />
                <span>Orders are <strong>not processed on Sundays or public holidays</strong>.</span>
              </li>
            </ul>
          </section>

          {/* Delivery Time */}
          <section className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700">
                <Truck size={24} />
              </div>
              <h2 className="text-2xl font-bold text-green-900">Delivery Time</h2>
            </div>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Clock className="text-blue-600 mt-1 shrink-0" size={20} />
                <span>Delivery usually takes <strong>3–15 working days</strong> depending on location.</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="text-blue-600 mt-1 shrink-0" size={20} />
                <span>Remote areas may take slightly longer.</span>
              </li>
            </ul>
          </section>

          {/* Shipping Charges */}
          <section className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700">
                <CreditCard size={24} />
              </div>
              <h2 className="text-2xl font-bold text-green-900">Shipping Charges</h2>
            </div>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CreditCard className="text-amber-600 mt-1 shrink-0" size={20} />
                <span>Shipping charges (if applicable) will be displayed at checkout.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 mt-1 shrink-0 text-lg">🎁</span>
                <span>Free shipping offers (if any) will be mentioned clearly on the website.</span>
              </li>
            </ul>
          </section>

          {/* Delivery Address */}
          <section className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-700">
                <MapPin size={24} />
              </div>
              <h2 className="text-2xl font-bold text-green-900">Delivery Address</h2>
            </div>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-red-600 mt-1 shrink-0" size={20} />
                <span>Please ensure <strong>correct shipping details</strong> while placing the order.</span>
              </li>
            </ul>

            <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg flex items-start gap-3">
              <AlertCircle className="text-red-600 mt-0.5 shrink-0" size={20} />
              <p className="text-red-800 text-sm">
                Multani Pansari is <strong>not responsible</strong> for delays due to incorrect address or contact details.
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}