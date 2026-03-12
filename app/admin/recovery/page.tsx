// pages/admin/payment-recovery.tsx
'use client'
import React, { useState } from 'react';
import axios from 'axios';

// Types - Updated to match actual API response
interface DatabaseInfo {
  paymentId: string;
  paymentStatus: string;
  orderStatus: string;
  hasPaymentResponse: boolean;
  razorpayPaymentId: string | null;
  razorpayOrderId: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

interface RazorpayPaymentDetails {
  id: string;
  status: string;
  method: string;
  amount: number;
  currency: string;
  captured: boolean;
  email: string;
  contact: string;
  description: string;
  order_id: string;
  created_at: number;
  fee?: number;
  tax?: number;
  card?: any;
  upi?: {
    vpa: string;
    flow: string;
    payer_account_type: string;
  };
  wallet?: any;
  bank?: any;
  error_code?: string | null;
  error_description?: string | null;
  notes?: Record<string, string>;
}

interface RazorpayInfo {
  current: RazorpayPaymentDetails | null;
  allPayments: RazorpayPaymentDetails[];
  error: string | null;
  isCaptured: boolean;
}

interface DiagnosisInfo {
  needsFix: boolean;
  message: string;
  recoveryCommand: string | null;
}

interface DebugResponseData {
  database: DatabaseInfo;
  razorpay: RazorpayInfo;
  diagnosis: DiagnosisInfo;
}

interface DebugResponse {
  success: boolean;
  data: DebugResponseData;
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

  // Format amount from paise to rupees
  const formatAmount = (paise: number | undefined): string => {
    if (!paise) return '₹0.00';
    return `₹${(paise / 100).toFixed(2)}`;
  };

  // Format Unix timestamp to readable date
  const formatUnixDate = (timestamp: number | undefined): string => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleString();
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
      console.log('Debug response:', res.data);
    } catch (error: any) {
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
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Format date from ISO string
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case 'captured':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'authorized':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'pending':
      case 'initiated':
      case 'processing':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
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
                    placeholder="e.g., ORD-20260311-89759WZU"
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
                    disabled={loading || !debugInfo?.data?.diagnosis?.needsFix}
                    className={`px-6 py-2 rounded-lg disabled:opacity-50 flex items-center transition-colors ${
                      debugInfo?.data?.diagnosis?.needsFix
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
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
                      debugInfo?.data?.diagnosis?.needsFix ? '🚨 Force Fix' : '🛠️ Force Fix'
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
                    <div className={`mb-6 p-4 rounded-lg border-2 ${
                      debugInfo.data.diagnosis.needsFix 
                        ? 'bg-yellow-50 border-yellow-400' 
                        : debugInfo.data.database?.paymentStatus === 'captured'
                        ? 'bg-green-50 border-green-400'
                        : 'bg-gray-50 border-gray-300'
                    }`}>
                      <div className="flex items-start">
                        <span className="text-3xl mr-3">
                          {debugInfo.data.diagnosis.needsFix ? '⚠️' : 
                           debugInfo.data.database?.paymentStatus === 'captured' ? '✅' : 'ℹ️'}
                        </span>
                        <div className="flex-1">
                          <p className="font-bold text-lg mb-1">
                            {debugInfo.data.diagnosis.message}
                          </p>
                          {debugInfo.data.diagnosis.needsFix && (
                            <div className="mt-2 p-3 bg-white rounded border border-yellow-300">
                              <p className="text-sm text-gray-700 mb-1">Recovery Command:</p>
                              <code className="bg-gray-800 text-green-400 px-3 py-2 rounded block text-sm font-mono">
                                {debugInfo.data.diagnosis.recoveryCommand}
                              </code>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Database State */}
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                      <h4 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                        <span className="mr-2">🗄️</span> Database State
                      </h4>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white p-3 rounded shadow-sm">
                            <p className="text-xs text-gray-500 uppercase font-semibold">Payment Status</p>
                            <p className={`text-lg font-bold ${
                              debugInfo.data.database?.paymentStatus === 'captured' ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              {debugInfo.data.database?.paymentStatus || 'N/A'}
                            </p>
                          </div>
                          <div className="bg-white p-3 rounded shadow-sm">
                            <p className="text-xs text-gray-500 uppercase font-semibold">Order Status</p>
                            <p className="text-lg font-bold text-gray-800">
                              {debugInfo.data.database?.orderStatus || 'N/A'}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white p-3 rounded shadow-sm">
                            <p className="text-xs text-gray-500 uppercase font-semibold">Amount (DB)</p>
                            <p className="text-lg font-bold text-gray-800">
                              ₹{debugInfo.data.database?.amount?.toFixed(2) || '0.00'}
                            </p>
                          </div>
                          <div className="bg-white p-3 rounded shadow-sm">
                            <p className="text-xs text-gray-500 uppercase font-semibold">Has Response</p>
                            <p className="text-lg font-bold">
                              {debugInfo.data.database?.hasPaymentResponse ? 
                                <span className="text-green-600">✅ Yes</span> : 
                                <span className="text-red-600">❌ No</span>}
                            </p>
                          </div>
                        </div>

                        <div className="bg-white p-3 rounded shadow-sm">
                          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Payment ID</p>
                          <p className="text-sm font-mono text-gray-700 break-all">{debugInfo.data.database?.paymentId || 'N/A'}</p>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                          <div className="bg-white p-3 rounded shadow-sm">
                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Razorpay Order ID</p>
                            <p className="text-sm font-mono text-blue-600">{debugInfo.data.database?.razorpayOrderId || 'N/A'}</p>
                          </div>
                          <div className="bg-white p-3 rounded shadow-sm">
                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Razorpay Payment ID</p>
                            <p className="text-sm font-mono text-blue-600">{debugInfo.data.database?.razorpayPaymentId || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white p-3 rounded shadow-sm">
                            <p className="text-xs text-gray-500 uppercase font-semibold">Created</p>
                            <p className="text-xs text-gray-700">{formatDate(debugInfo.data.database?.createdAt)}</p>
                          </div>
                          <div className="bg-white p-3 rounded shadow-sm">
                            <p className="text-xs text-gray-500 uppercase font-semibold">Updated</p>
                            <p className="text-xs text-gray-700">{formatDate(debugInfo.data.database?.updatedAt)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Razorpay State */}
                    <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                      <h4 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                        <span className="mr-2">⚡</span> Razorpay State
                      </h4>

                      {debugInfo.data.razorpay?.error ? (
                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700">
                          <p className="font-semibold">❌ Error fetching from Razorpay:</p>
                          <p className="text-sm mt-1">{debugInfo.data.razorpay.error}</p>
                        </div>
                      ) : debugInfo.data.razorpay?.current ? (
                        <div className="space-y-4">
                          {/* Status Badge */}
                          <div className={`p-3 rounded-lg border-2 ${getStatusColor(debugInfo.data.razorpay.current.status)}`}>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold uppercase">Razorpay Status</span>
                              <span className="text-xl font-bold">{debugInfo.data.razorpay.current.status}</span>
                            </div>
                            {debugInfo.data.razorpay.isCaptured && (
                              <p className="text-xs mt-1 opacity-75">✅ Payment is captured in Razorpay</p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded shadow-sm">
                              <p className="text-xs text-gray-500 uppercase font-semibold">Method</p>
                              <p className="text-lg font-bold text-gray-800 capitalize">
                                {debugInfo.data.razorpay.current.method || 'N/A'}
                              </p>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm">
                              <p className="text-xs text-gray-500 uppercase font-semibold">Amount</p>
                              <p className="text-lg font-bold text-gray-800">
                                {formatAmount(debugInfo.data.razorpay.current.amount)}
                              </p>
                            </div>
                          </div>

                          <div className="bg-white p-3 rounded shadow-sm">
                            <p className="text-xs text-gray-500 uppercase font-semibold">Razorpay Payment ID</p>
                            <p className="text-sm font-mono text-blue-600">{debugInfo.data.razorpay.current.id}</p>
                          </div>

                          <div className="bg-white p-3 rounded shadow-sm">
                            <p className="text-xs text-gray-500 uppercase font-semibold">Customer</p>
                            <p className="text-sm text-gray-800">{debugInfo.data.razorpay.current.email}</p>
                            <p className="text-sm text-gray-600">{debugInfo.data.razorpay.current.contact}</p>
                          </div>

                          {/* Payment Method Details */}
                          {debugInfo.data.razorpay.current.upi && (
                            <div className="bg-purple-50 p-3 rounded border border-purple-200">
                              <p className="text-xs text-purple-600 uppercase font-semibold mb-1">UPI Details</p>
                              <p className="text-sm font-mono text-gray-800">{debugInfo.data.razorpay.current.upi.vpa}</p>
                              <p className="text-xs text-gray-600">Flow: {debugInfo.data.razorpay.current.upi.flow}</p>
                            </div>
                          )}

                          {debugInfo.data.razorpay.current.card && (
                            <div className="bg-indigo-50 p-3 rounded border border-indigo-200">
                              <p className="text-xs text-indigo-600 uppercase font-semibold mb-1">Card Details</p>
                              <p className="text-sm text-gray-800">
                                {debugInfo.data.razorpay.current.card.network} **** {debugInfo.data.razorpay.current.card.last4}
                              </p>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded shadow-sm">
                              <p className="text-xs text-gray-500 uppercase font-semibold">Fee</p>
                              <p className="text-sm font-bold text-gray-800">
                                {formatAmount(debugInfo.data.razorpay.current.fee)}
                              </p>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm">
                              <p className="text-xs text-gray-500 uppercase font-semibold">Tax</p>
                              <p className="text-sm font-bold text-gray-800">
                                {formatAmount(debugInfo.data.razorpay.current.tax)}
                              </p>
                            </div>
                          </div>

                          <div className="bg-white p-3 rounded shadow-sm">
                            <p className="text-xs text-gray-500 uppercase font-semibold">Created At (Razorpay)</p>
                            <p className="text-sm text-gray-700">{formatUnixDate(debugInfo.data.razorpay.current.created_at)}</p>
                          </div>

                          {/* Error Info if any */}
                          {debugInfo.data.razorpay.current.error_code && (
                            <div className="bg-red-50 border border-red-200 p-3 rounded">
                              <p className="text-xs text-red-600 uppercase font-semibold">Error</p>
                              <p className="text-sm text-red-700">{debugInfo.data.razorpay.current.error_description}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No Razorpay data available</p>
                      )}
                    </div>
                  </div>

                  {/* All Payments Section */}
                  {debugInfo.data.razorpay?.allPayments && debugInfo.data.razorpay.allPayments.length > 0 && (
                    <div className="mt-6 bg-gray-50 rounded-lg p-5 border border-gray-200">
                      <h4 className="font-bold text-gray-800 mb-4">
                        All Payments ({debugInfo.data.razorpay.allPayments.length})
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Captured</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {debugInfo.data.razorpay.allPayments.map((payment, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-xs font-mono text-gray-900">{payment.id}</td>
                                <td className="px-4 py-2">
                                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    payment.status === 'captured' ? 'bg-green-100 text-green-800' : 
                                    payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {payment.status}
                                  </span>
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700 capitalize">{payment.method}</td>
                                <td className="px-4 py-2 text-sm text-gray-700">{formatAmount(payment.amount)}</td>
                                <td className="px-4 py-2">
                                  {payment.captured ? 
                                    <span className="text-green-600">✅</span> : 
                                    <span className="text-red-600">❌</span>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Raw Data Accordion */}
                  <details className="mt-6 group">
                    <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900 font-medium p-3 bg-gray-100 rounded-lg transition-colors">
                      <span className="group-open:rotate-90 inline-block transition-transform mr-2">▶</span>
                      View Raw Response Data
                    </summary>
                    <pre className="mt-2 p-4 bg-gray-900 rounded-lg overflow-auto text-xs max-h-96 text-green-400 font-mono">
                      {JSON.stringify(debugInfo, null, 2)}
                    </pre>
                  </details>
                </div>
              </div>
            )}

            {/* API Response */}
            {apiResponse && (
              <div className={`rounded-lg p-4 border-2 ${
                apiResponse.success 
                  ? 'bg-green-50 border-green-400' 
                  : 'bg-red-50 border-red-400'
              }`}>
                <h4 className={`font-bold mb-2 ${
                  apiResponse.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {apiResponse.success ? '✅ Recovery Result' : '❌ Error'}
                </h4>
                <p className={`text-sm mb-2 ${
                  apiResponse.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {apiResponse.message}
                </p>
                {apiResponse.data && (
                  <pre className={`text-xs overflow-auto p-2 rounded ${
                    apiResponse.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {JSON.stringify(apiResponse.data, null, 2)}
                  </pre>
                )}
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
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
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
                  className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center transition-colors font-semibold"
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
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-600 font-semibold">Total Processed</p>
                    <p className="text-3xl font-bold text-blue-700">{results.total}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-green-600 font-semibold">Recovered ✅</p>
                    <p className="text-3xl font-bold text-green-700">{results.recovered.length}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-sm text-red-600 font-semibold">Failed ❌</p>
                    <p className="text-3xl font-bold text-red-700">{results.failed.length}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-600 font-semibold">Pending ⏳</p>
                    <p className="text-3xl font-bold text-yellow-700">{results.pending.length}</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
                    <p className="text-sm text-gray-600 font-semibold">Errors ⚠️</p>
                    <p className="text-3xl font-bold text-gray-700">{results.errors.length}</p>
                  </div>
                </div>

                {/* Recovered Orders Table */}
                {results.recovered.length > 0 && (
                  <div className="px-6 pb-6">
                    <h4 className="font-bold text-gray-800 mb-3 text-lg">Recovered Orders</h4>
                    <div className="overflow-x-auto border rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-green-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Order Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Previous Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Razorpay ID</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {results.recovered.map((item, index) => (
                            <tr key={index} className="hover:bg-green-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{item.orderNumber}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₹{item.amount}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                  {item.previousStatus}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{item.razorpayPaymentId}</td>
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
                    <h4 className="font-bold text-gray-800 mb-3 text-lg">Errors</h4>
                    <div className="overflow-x-auto border rounded-lg border-red-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-red-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Order Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Error</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {results.errors.map((item, index) => (
                            <tr key={index} className="hover:bg-red-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{item.orderNumber}</td>
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