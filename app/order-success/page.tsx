// app/order-success/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Mail, 
  Phone, 
  MapPin, 
  IndianRupee,
  CreditCard,
  Clock,
  Calendar,
  ShoppingBag,
  Home,
  FileText,
  Download,
  Printer,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getOrderByOrderNumber } from '@/redux/slice/OrderSlice';

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { color: string; label: string }> = {
    pending_payment: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Payment' },
    payment_initiated: { color: 'bg-blue-100 text-blue-800', label: 'Payment Initiated' },
    order_success: { color: 'bg-green-100 text-green-800', label: 'Order Confirmed' },
    processing: { color: 'bg-purple-100 text-purple-800', label: 'Processing' },
    shipped: { color: 'bg-indigo-100 text-indigo-800', label: 'Shipped' },
    delivered: { color: 'bg-emerald-100 text-emerald-800', label: 'Delivered' },
    cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    refunded: { color: 'bg-gray-100 text-gray-800', label: 'Refunded' },
  };
  const style = config[status] || { color: 'bg-gray-100 text-gray-800', label: status };
  
  return (
    <Badge className={`${style.color} border-0 px-3 py-1`}>
      {style.label}
    </Badge>
  );
};

// Payment Method Icon
const PaymentMethodIcon = ({ method }: { method: string }) => {
  const icons: Record<string, React.ReactNode> = {
    upi: <span className="text-xs font-bold text-blue-600">UPI</span>,
    card: <CreditCard className="w-4 h-4" />,
    netbanking: <span className="text-xs font-bold text-purple-600">NB</span>,
    wallet: <span className="text-xs font-bold text-orange-600">WALLET</span>,
  };
  return icons[method] || <CreditCard className="w-4 h-4" />;
};

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');

  console.log(orderNumber)
  const dispatch = useAppDispatch();
  const { order, loading } = useAppSelector((state: any) => state.order);

  useEffect(() => {
    if (orderNumber) {
      dispatch(getOrderByOrderNumber(orderNumber));
    }
  }, [dispatch, orderNumber]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const payment = order.paymentId;
  const shippingMethod = order.shippingMethodId;

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Success Header */}
        <Card className="p-6 md:p-8 mb-6 border-0 shadow-lg">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. We've received your order and will process it shortly.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-3">
              <StatusBadge status={order.status} />
              <Badge variant="outline" className="px-3 py-1">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </Badge>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Left Column - Order Details */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Order Info */}
            <Card className="p-6 border-0 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Order Information
                </h2>
                <span className="text-sm text-gray-500 font-mono">
                  #{order.orderNumber}
                </span>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium">
                      {new Date(order.createdAt).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Order Status:</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-medium">{order.items?.length} items</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Status:</span>
                    <Badge className={`${
                      order.paymentStatus === 'captured' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    } border-0`}>
                      {order.paymentStatus === 'captured' ? 'Paid' : order.paymentStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Method:</span>
                    <div className="flex items-center gap-1.5">
                      <PaymentMethodIcon method={order.paymentMethod} />
                      <span className="font-medium uppercase">{order.paymentMethod}</span>
                    </div>
                  </div>
                  {payment?.upiDetails?.vpa && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">UPI ID:</span>
                      <span className="font-mono text-xs">{payment.upiDetails.vpa}</span>
                    </div>
                  )}
                </div>
              </div>

              {payment?.razorpayPaymentId && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Payment ID:</span>
                    <span className="font-mono">{payment.razorpayPaymentId}</span>
                  </div>
                  {payment.razorpayPaymentResponse?.acquirer_data?.rrn && (
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>RRN:</span>
                      <span className="font-mono">{payment.razorpayPaymentResponse.acquirer_data.rrn}</span>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Order Items */}
            <Card className="p-6 border-0 shadow-md">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Order Items ({order.items?.length})
              </h2>
              
              <div className="space-y-4">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-white flex-shrink-0">
                      <img
                        src={item.image || item.productId?.mainImage}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3 className="font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                          <p className="text-xs text-gray-500 mt-1">SKU: {item.sku}</p>
                          
                          {item.attributes && Object.keys(item.attributes).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {Object.entries(item.attributes).map(([key, value]: any) => (
                                <span key={key} className="text-xs bg-white px-2 py-0.5 rounded border">
                                  {key}: {value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-gray-900">₹{item.price}</p>
                          {item.originalPrice > item.price && (
                            <p className="text-xs text-gray-400 line-through">₹{item.originalPrice}</p>
                          )}
                          <p className="text-sm text-gray-600 mt-1">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                        <span className="text-xs text-gray-500">Subtotal</span>
                        <span className="font-semibold text-primary">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Shipping Address */}
            <Card className="p-6 border-0 shadow-md">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Shipping Address
              </h2>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Home className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{order.customerName}</p>
                  <p className="text-gray-600 mt-1">{order.shippingAddress?.addressLine1}</p>
                  {order.shippingAddress?.addressLine2 && (
                    <p className="text-gray-600">{order.shippingAddress.addressLine2}</p>
                  )}
                  <p className="text-gray-600">
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
                  </p>
                  <p className="text-gray-600">{order.shippingAddress?.country}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{order.customerPhone}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="space-y-6">
            
            {/* Price Summary */}
            <Card className="p-6 border-0 shadow-md sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{order.subtotal?.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={order.shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                    {order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost?.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (GST)</span>
                  <span>₹{order.tax?.toFixed(2)}</span>
                </div>
                
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{order.discount?.toFixed(2)}</span>
                  </div>
                )}
                
                {order.couponCode && (
                  <div className="flex justify-between text-blue-600 text-xs">
                    <span>Coupon ({order.couponCode})</span>
                    <span>Applied</span>
                  </div>
                )}
                
                <Separator className="my-3" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-muted-foreground">₹{order.total?.toFixed(2)}</span>
                </div>
                
                {shippingMethod && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-900">{shippingMethod.name}</span>
                    </div>
                    <p className="text-xs text-blue-700 mt-1">
                      Estimated delivery: {shippingMethod.estimatedDays}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                <Link href={`/orders/${order.orderNumber}`}>
                  <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                    <Truck className="w-4 h-4" />
                    Track Order
                  </Button>
                </Link>
                
                
              </div>
            </Card>

            {/* What's Next */}
            <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
              <h3 className="font-semibold text-lg mb-4 text-gray-900">What's Next?</h3>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">Confirmation Email</p>
                    <p className="text-xs text-gray-600">
                      Sent to {order.customerEmail}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Package className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">Order Processing</p>
                    <p className="text-xs text-gray-600">
                      We're preparing your items
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Truck className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">Shipping</p>
                    <p className="text-xs text-gray-600">
                      You'll receive tracking info via email
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Need Help */}
            <Card className="p-4 border-0 shadow-sm text-center">
              <p className="text-sm text-gray-600 mb-2">Need help with your order?</p>
              <Link href="/contact">
                <Button variant="link" className="gap-1 text-primary">
                  Contact Support
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline" size="lg" className="gap-2">
              <Package className="w-4 h-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}