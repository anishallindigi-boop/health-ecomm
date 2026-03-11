// pages/admin/payment-recovery.tsx
'use client'
import React, { useState } from 'react';
import axios from 'axios';

// Types
interface DebugResponse {
  success: boolean;
  data: {
    database: {
      paymentId: string;
      paymentStatus: string;
      orderStatus: string;
      hasPaymentResponse: boolean;
      razorpayPaymentId: string | null;
      razorpayOrderId: string;
      amount: number;
      createdAt: string;
      updatedAt: string;
    };
    razorpay: {
      id: string;
      status: string;
      method: string;
      amount: number;
      card?: any;
      upi?: any;
      wallet?: any;
      bank?: any;
      error?: string;
    } | null;
    diagnosis: {
      needsFix: boolean;
      message: string;
      recoveryCommand: string | null;
    };
  };
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface RecoveryResults {
  total: number;
  recovered: Array<{
    orderNumber: string;
    paymentId: string;
    razorpayPaymentId: string;
    amount: number;
    previousStatus: string;
  }>;
  failed: Array<{
    orderNumber: string;
    paymentId: string;
    razorpayPaymentId: string;
    razorpayStatus: string;
  }>;
  pending: Array<{
    orderNumber: string;
    paymentId: string;
    razorpayPaymentId: string;
    razorpayStatus: string;
  }>;
  errors: Array<{
    orderNumber: string;
    paymentId: string;
    error: string;
  }>;
}

interface SelectedStatuses {
  initiated: boolean;
  processing: boolean;
  pending: boolean;
  [key: string]: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY as string;

const PaymentRecovery: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [hours, setHours] = useState<number>(24);
  const [results, setResults] = useState<RecoveryResults | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<SelectedStatuses>({
    initiated: true,
    processing: true,
    pending: true
  });

  // Get auth token from localStorage/session (for admin token)
  const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Handle single order debug
  const handleDebugOrder = async (): Promise<void> => {
    if (!orderNumber) {
      alert('Please enter an order number');
      return;
    }

    setLoading(true);
    setDebugInfo(null);
    setApiResponse(null);

    try {
      const token = getToken();
      
      const res = await axios.get<DebugResponse>(`${API_URL}/api/orders/admin/debug-payment/${orderNumber}`, {
        headers: {
          'x-api-key': API_KEY,
          'Authorization': token ? `Bearer ${token}` : ''
        },
        withCredentials: true
      });
      
      setDebugInfo(res.data);
    //   console.log('Debug response:', res.data);
    } catch (error: any) {
    //   console.error('Debug error:', error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle single order force fix
  const handleForceFix = async (): Promise<void> => {
    if (!orderNumber) {
      alert('Please enter an order number');
      return;
    }

    if (!confirm(`Are you sure you want to force check and fix order ${orderNumber}?`)) {
      return;
    }

    setLoading(true);
    setApiResponse(null);

    try {
      const token = getToken();
      
      const res = await axios.get<ApiResponse>(`${API_URL}/api/orders/admin/force-check-payment/${orderNumber}`, {
        headers: {
          'x-api-key': API_KEY,
          'Authorization': token ? `Bearer ${token}` : ''
        },
        withCredentials: true
      });
      
      setApiResponse(res.data);
      
      // Refresh debug info
      await handleDebugOrder();
      
      alert(`✅ ${res.data.message}`);
    } catch (error: any) {
    //   console.error('Force fix error:', error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk recovery
  const handleBulkRecovery = async (): Promise<void> => {
    const statusArray = Object.entries(selectedStatuses)
      .filter(([_, selected]) => selected)
      .map(([status]) => status);

    if (statusArray.length === 0) {
      alert('Please select at least one status to recover');
      return;
    }

    if (!confirm(`This will check all payments older than ${hours} hours with status: ${statusArray.join(', ')}. Continue?`)) {
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const token = getToken();
      
      const res = await axios.post<{ success: boolean; data: RecoveryResults }>(
        `${API_URL}/api/orders/admin/recover-stuck-payments`, 
        {
          hours,
          status: statusArray
        },
        {
          headers: {
            'x-api-key': API_KEY,
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      
      setResults(res.data.data);
    } catch (error: any) {
    //   console.error('Bulk recovery error:', error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment Recovery Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Fix stuck payments where Razorpay shows captured but database shows pending
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('single')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'single'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🔍 Single Order Recovery
            </button>
            <button
              onClick={() => setActiveTab('bulk')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'bulk'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 Bulk Recovery
            </button>
          </nav>
        </div>

        {/* Single Order Recovery Tab */}
        {activeTab === 'single' && (
          <div className="space-y-6">
            {/* Input Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Single Order Recovery</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Order Number
                  </label>
                  <input
                    id="orderNumber"
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                    placeholder="e.g., ORD-20260311-6220CX86"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    onClick={handleDebugOrder}
                    disabled={loading}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center transition-colors"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Checking...
                      </>
                    ) : (
                      '🔍 Debug'
                    )}
                  </button>
                  <button
                    onClick={handleForceFix}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center transition-colors"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Fixing...
                      </>
                    ) : (
                      '🛠️ Force Fix'
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Debug Information */}
            {debugInfo && debugInfo.data && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Debug Information</h3>
                </div>
                <div className="p-6">
                  {/* Diagnosis Badge */}
                  {debugInfo.data.diagnosis && (
                    <div className={`mb-4 p-4 rounded-lg ${
                      debugInfo.data.diagnosis.needsFix 
                        ? 'bg-yellow-50 border border-yellow-200' 
                        : debugInfo.data.database?.paymentStatus === 'captured'
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}>
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">
                          {debugInfo.data.diagnosis.needsFix ? '⚠️' : 
                           debugInfo.data.database?.paymentStatus === 'captured' ? '✅' : 'ℹ️'}
                        </span>
                        <div>
                          <p className="font-medium">
                            {debugInfo.data.diagnosis.message}
                          </p>
                          {debugInfo.data.diagnosis.recoveryCommand && (
                            <p className="text-sm text-gray-600 mt-1">
                              Run: <code className="bg-gray-100 px-2 py-1 rounded">{debugInfo.data.diagnosis.recoveryCommand}</code>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Database State */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-3">Database State</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-500">Payment Status</p>
                        <p className={`text-lg font-semibold ${
                          debugInfo.data.database?.paymentStatus === 'captured' 
                            ? 'text-green-600' 
                            : 'text-yellow-600'
                        }`}>
                          {debugInfo.data.database?.paymentStatus || 'N/A'}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-500">Order Status</p>
                        <p className="text-lg font-semibold">{debugInfo.data.database?.orderStatus || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-500">Has Payment Response</p>
                        <p className="text-lg font-semibold">
                          {debugInfo.data.database?.hasPaymentResponse ? '✅ Yes' : '❌ No'}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="text-lg font-semibold">₹{debugInfo.data.database?.amount || 0}</p>
                      </div>
                    </div>
                    
                    {/* Payment IDs */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-500">Razorpay Order ID</p>
                        <p className="text-sm font-mono">{debugInfo.data.database?.razorpayOrderId || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-500">Razorpay Payment ID</p>
                        <p className="text-sm font-mono">{debugInfo.data.database?.razorpayPaymentId || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-500">Created At</p>
                        <p className="text-sm">{formatDate(debugInfo.data.database?.createdAt)}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-500">Updated At</p>
                        <p className="text-sm">{formatDate(debugInfo.data.database?.updatedAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Razorpay State */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-3">Razorpay State</h4>
                    {debugInfo.data.razorpay?.error ? (
                      <div className="bg-red-50 p-4 rounded-lg text-red-700">
                        {debugInfo.data.razorpay.error}
                      </div>
                    ) : debugInfo.data.razorpay ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-sm text-gray-500">Status</p>
                          <p className={`text-lg font-semibold ${
                            debugInfo.data.razorpay?.status === 'captured' 
                              ? 'text-green-600' 
                              : 'text-yellow-600'
                          }`}>
                            {debugInfo.data.razorpay?.status || 'N/A'}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-sm text-gray-500">Payment Method</p>
                          <p className="text-lg font-semibold">{debugInfo.data.razorpay?.method || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-sm text-gray-500">Amount</p>
                          <p className="text-lg font-semibold">
                            ₹{debugInfo.data.razorpay?.amount ? debugInfo.data.razorpay.amount / 100 : 'N/A'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">No Razorpay data available</p>
                    )}
                  </div>

                  {/* Raw Data Accordion */}
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                      View Raw Response Data
                    </summary>
                    <pre className="mt-2 p-4 bg-gray-50 rounded-lg overflow-auto text-xs max-h-96">
                      {JSON.stringify(debugInfo, null, 2)}
                    </pre>
                  </details>
                </div>
              </div>
            )}

            {/* API Response */}
            {apiResponse && (
              <div className={`rounded-lg p-4 ${
                apiResponse.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <h4 className={`font-medium mb-2 ${
                  apiResponse.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {apiResponse.success ? '✅ Recovery Result' : '❌ Error'}
                </h4>
                <pre className={`text-sm overflow-auto ${
                  apiResponse.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Bulk Recovery Tab */}
        {activeTab === 'bulk' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Bulk Payment Recovery</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hours Input */}
                <div>
                  <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-2">
                    Hours Old
                  </label>
                  <input
                    id="hours"
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    min="1"
                    max="168"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Check payments older than {hours} hours
                  </p>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Status to Check
                  </label>
                  <div className="space-y-2">
                    {Object.keys(selectedStatuses).map((status) => (
                      <label key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedStatuses[status]}
                          onChange={(e) => setSelectedStatuses({
                            ...selectedStatuses,
                            [status]: e.target.checked
                          })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleBulkRecovery}
                  disabled={loading}
                  className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center transition-colors"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    '🚀 Start Bulk Recovery'
                  )}
                </button>
              </div>
            </div>

            {/* Results */}
            {results && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recovery Results</h3>
                </div>
                
                {/* Stats Cards */}
                <div className="p-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600">Total Processed</p>
                    <p className="text-2xl font-bold text-blue-700">{results.total}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600">Recovered ✅</p>
                    <p className="text-2xl font-bold text-green-700">{results.recovered.length}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-red-600">Failed ❌</p>
                    <p className="text-2xl font-bold text-red-700">{results.failed.length}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-600">Pending ⏳</p>
                    <p className="text-2xl font-bold text-yellow-700">{results.pending.length}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Errors ⚠️</p>
                    <p className="text-2xl font-bold text-gray-700">{results.errors.length}</p>
                  </div>
                </div>

                {/* Recovered Orders Table */}
                {results.recovered.length > 0 && (
                  <div className="px-6 pb-6">
                    <h4 className="font-medium text-gray-700 mb-3">Recovered Orders</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previous Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Razorpay ID</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {results.recovered.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.orderNumber}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{item.amount}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.previousStatus}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{item.razorpayPaymentId}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Errors Table */}
                {results.errors.length > 0 && (
                  <div className="px-6 pb-6">
                    <h4 className="font-medium text-gray-700 mb-3">Errors</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {results.errors.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.orderNumber}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{item.error}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentRecovery;