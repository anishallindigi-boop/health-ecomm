// app/return-policy/page.tsx or pages/return-policy.tsx

import React from 'react';
import Head from 'next/head';

export default function ReturnPolicy() {
  return (
    <>
      <main className="min-h-screen bg-[#fdfbf7] text-[#44403c] font-sans">
        {/* Header */}
        <header className="bg-background text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Return & Refund Policy</h1>
            <p className="text-lg text-green-100">Multani Pansari</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
          {/* Introduction */}
          <p className="text-lg leading-relaxed">
            At Multani Pansari, we are committed to delivering high-quality Ayurvedic and herbal products to our customers. Please read our Return & Refund Policy carefully before making a purchase.
          </p>

          {/* Return Policy */}
          <section className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-green-900 mb-6 border-b pb-2">Return Policy</h2>
            
            <p className="font-semibold mb-4">We only accept returns under the following conditions:</p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>The product must be <strong>unused, unopened, and in its original packaging</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>The return request must be raised within <strong>48 hours of delivery</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>The product must not be damaged, tampered with, or altered in any way.</span>
              </li>
            </ul>

            <h3 className="text-red-700 font-bold mb-4">❌ Non-Returnable Conditions:</h3>
            <ul className="space-y-3 mb-4">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>If the product seal is <strong>opened or broken</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>If the product is <strong>used or partially consumed</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>If the packaging is <strong>damaged by the customer after delivery</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Products purchased under special offers or discounts (unless damaged during transit).</span>
              </li>
            </ul>

            <p className="bg-amber-50 border-l-4 border-amber-400 p-4 text-amber-800 text-sm">
              Since our products are Ayurvedic and health-related consumables, we do not accept returns for opened or damaged items due to hygiene and safety reasons.
            </p>
          </section>

          {/* Refund Policy */}
          <section className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-green-900 mb-6 border-b pb-2">Refund Policy</h2>
            
            <p className="bg-stone-800 text-white p-4 rounded-lg text-center font-bold mb-6">
              Multani Pansari follows a strict No Refund Policy.
            </p>

            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-stone-600 mt-1">•</span>
                <span>Once the order is placed and confirmed, it <strong>cannot be cancelled or refunded</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-stone-600 mt-1">•</span>
                <span>No refund will be issued for opened, used, or damaged products.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-stone-600 mt-1">•</span>
                <span>Shipping charges (if any) are non-refundable.</span>
              </li>
            </ul>
          </section>

          {/* Damaged Product During Transit */}
          <section className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-green-900 mb-6 border-b pb-2">Damaged Product During Transit</h2>
            
            <p className="mb-4">If you receive a product that is damaged during shipping:</p>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Please share <em>clear images and an unboxing video</em> within <strong>24 hours</strong> of delivery.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>After verification, we may offer a <em>replacement at our discretion</em> (no refund).</span>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}