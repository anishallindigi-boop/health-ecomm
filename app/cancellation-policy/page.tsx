// app/cancellation-policy/page.tsx or pages/cancellation-policy.tsx

import React from 'react';
import Head from 'next/head';
import { 
  Ban, 
  XCircle, 
  AlertTriangle,
  PackageX,
  DollarSign
} from 'lucide-react';

export default function CancellationPolicy() {
  return (
    <>
 

      <main className="min-h-screen bg-[#fdfbf7] text-[#44403c]">
        {/* Header */}
        <header className="bg-background text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Cancellation Policy</h1>
            <p className="text-lg text-green-100">Multani Pansari</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
          {/* Customer Cancellation */}
          <section className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-700">
                <Ban size={24} />
              </div>
              <h2 className="text-2xl font-bold text-green-900">Order Cancellation</h2>
            </div>
            
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
              <div className="flex items-start gap-3">
                <XCircle className="text-red-600 mt-1 shrink-0" size={24} />
                <p className="text-lg font-medium text-red-900">
                  Orders once placed <strong>cannot be cancelled</strong>.
                </p>
              </div>
            </div>
          </section>

          {/* Company Cancellation */}
          <section className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-2xl font-bold text-green-900">Our Rights</h2>
            </div>
            
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
              <div className="flex items-start gap-3">
                <PackageX className="text-amber-600 mt-1 shrink-0" size={24} />
                <p className="text-lg text-amber-900">
                  Multani Pansari reserves the right to cancel any order due to <strong>stock unavailability</strong> or <strong>pricing errors</strong>.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}