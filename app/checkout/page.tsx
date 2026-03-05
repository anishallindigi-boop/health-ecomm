// app/checkout/page.tsx
'use client';
import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ShieldCheck,
  Truck,
  Package,
  Lock,
  ArrowLeft,
  MapPin,
  CheckCircle2,
  IndianRupee,
  Phone,
  Mail,
  Home,
  Building,
  Navigation,
  Clock,
  Gift,
  Tag,
  X,
  Loader2,
  Percent,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { 
  clearCart,
  updateCartQuantity,
  removeCartItem,
  getCartItems 
} from "@/redux/slice/CartItemSlice";
import { GetAllShipping } from "@/redux/slice/ShippingMethodSlice";
import { 
  createOrder, 
  initiateRazorpayPayment,
  verifyRazorpayPayment,
  resetOrderState,
  clearOrder,
  checkPaymentStatus
} from "@/redux/slice/OrderSlice";
import { applyCoupon, clearAppliedCoupon } from "@/redux/slice/CouponSlice";
import { Order } from "@/redux/slice/OrderSlice";

const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL as string;
const GST_RATE = 0.05; // 5% GST

// Razorpay script loader
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  /* ---------------- LOADING STATES ---------------- */
  const [loadingItems, setLoadingItems] = useState<string[]>([]);
  const [loadingClear, setLoadingClear] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');

  /* ---------------- CART DATA ---------------- */
  const rawCart = useAppSelector((s: any) => s.usercart.cart) as any[] | undefined;

  // Order state
  const { loading: orderLoading, order: createdOrder, razorpayOrder, error } = useAppSelector(
    (s: any) => s.order
  );

  // Fetch fresh cart data on mount
  useEffect(() => {
    dispatch(getCartItems());
    dispatch(resetOrderState());
    dispatch(clearOrder());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      setProcessingPayment(false);
    }
  }, [error]);

  const items = useMemo(() => {
    if (!rawCart || rawCart.length === 0) return [];

    return rawCart.map((c: any) => {
      const hasVariation = !!c.variationId;
      const variation = c.variationId;

      return {
        cartId: c._id,
        productId: c.productId._id,
        variationId: hasVariation ? variation?._id : null,
        name: c.productId.name,
        image: hasVariation && variation?.image
          ? variation.image
          : c.productId.mainImage,
        qty: c.quantity,
        stock: hasVariation ? variation?.stock ?? null : c.productId.stock ?? null,
        price: hasVariation
          ? (variation?.discountPrice ?? variation?.price ?? c.productId.price)
          : (c.productId.discountPrice ?? c.productId.price),
        originalPrice: hasVariation
          ? (variation?.price ?? c.productId.price)
          : c.productId.price,
        attributes: hasVariation ? (variation?.attributes ?? {}) : {},
      };
    });
  }, [rawCart]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [items]);

  /* ---------------- CART HANDLERS ---------------- */
  const changeQty = async (cartId: string, newQty: number, stock: number | null) => {
    if (stock !== null && newQty > stock) {
      toast.error(`Only ${stock} items available in stock`);
      return;
    }

    setLoadingItems((prev) => [...prev, cartId]);

    try {
      if (newQty <= 0) {
        await dispatch(removeCartItem(cartId));
        toast.success("Item removed from cart");
      } else {
        await dispatch(updateCartQuantity({ cartId, quantity: newQty }));
      }
    } catch (error) {
      toast.error("Failed to update quantity");
    } finally {
      setLoadingItems((prev) => prev.filter((id) => id !== cartId));
    }
  };

  const removeItem = async (cartId: string) => {
    setLoadingItems((prev) => [...prev, cartId]);
    try {
      await dispatch(removeCartItem(cartId));
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setLoadingItems((prev) => prev.filter((id) => id !== cartId));
    }
  };

  const clearAllItems = async () => {
    setLoadingClear(true);
    try {
      await dispatch(clearCart());
      toast.success("Cart cleared successfully");
    } catch (error) {
      toast.error("Failed to clear cart");
    } finally {
      setLoadingClear(false);
    }
  };

  /* ---------------- COUPON STATE ---------------- */
  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const { appliedCoupon, loading: couponLoading, error: couponError } = useAppSelector(
    (state: any) => state.coupon
  );

  /* ---------------- SHIPPING METHODS ---------------- */
  const { shippingMethods, loading: shippingLoading } = useAppSelector(
    (s: any) => s.shippingmethod
  );

  const [selectedShipping, setSelectedShipping] = useState<any>(null);

  useEffect(() => {
    dispatch(GetAllShipping());
  }, [dispatch]);

  useEffect(() => {
    if (shippingMethods?.length > 0 && !selectedShipping) {
      setSelectedShipping(shippingMethods[0]);
    }
  }, [shippingMethods, selectedShipping]);

  const shippingCost = selectedShipping?.price || 0;

  /* ---------------- TAX & TOTAL ---------------- */
  const tax = Number((subtotal * GST_RATE).toFixed(2));
  const discountAmount = appliedCoupon?.discountAmount || 0;
  const total = Math.max(0, subtotal + tax + shippingCost - discountAmount);
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  // ⭐⭐⭐ GET PRODUCT IDs FOR COUPON ⭐⭐⭐
  const productIds = useMemo(() => {
    return items.map(item => item.productId);
  }, [items]);

  // Apply coupon handler with product IDs
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    
    if (couponCode.length < 3) {
      toast.error("Coupon code must be at least 3 characters");
      return;
    }

    setApplyingCoupon(true);
    
    const result: any = await dispatch(applyCoupon({
      code: couponCode.trim(),
      cartTotal: subtotal,
      shippingCost: shippingCost,
      productIds: productIds,
    }));
    
    setApplyingCoupon(false);

    if (applyCoupon.fulfilled.match(result)) {
      toast.success(`Coupon applied! You saved ₹${result.payload.discountAmount}`);
      setCouponCode("");
    } else {
      toast.error(result.payload || "Invalid coupon code");
    }
  };

  // Remove coupon handler
  const handleRemoveCoupon = () => {
    dispatch(clearAppliedCoupon());
    toast.info("Coupon removed");
  };

  // Clear coupon error
  useEffect(() => {
    if (couponError) {
      toast.error(couponError);
    }
  }, [couponError]);

  /* ---------------- ADDRESS FORM ---------------- */
  const [address, setAddress] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'pincode') {
      const pincode = value.replace(/\D/g, '').slice(0, 6);
      setAddress({ ...address, [name]: pincode });
    } else {
      setAddress({ ...address, [name]: value });
    }
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!address.name.trim()) errors.name = "Name is required";
    if (!address.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(address.email)) {
      errors.email = "Invalid email format";
    }
    if (!address.phone.trim()) {
      errors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(address.phone)) {
      errors.phone = "Invalid phone number (10 digits required)";
    }
    if (!address.address.trim()) errors.address = "Address is required";
    if (!address.city.trim()) errors.city = "City is required";
    if (!address.state.trim()) errors.state = "State is required";
    if (!address.pincode.trim()) {
      errors.pincode = "PIN Code is required";
    } else if (!/^\d{6}$/.test(address.pincode)) {
      errors.pincode = "Invalid PIN Code (6 digits required)";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* ---------------- RAZORPAY PAYMENT HANDLER ---------------- */
  const handleRazorpayPayment = useCallback(async (order: Order, razorpayData: any) => {
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay SDK");
      }

      const options = {
        key: razorpayData.key,
        amount: razorpayData.amount,
        currency: razorpayData.currency,
        name: "Your Store Name", // Update with your store name
        description: `Order #${order.orderNumber}`,
        image: "https://your-logo-url.com/logo.png", // Update with your logo
        order_id: razorpayData.order_id,
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verificationResult: any = await dispatch(verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id!,
            }));

            if (verifyRazorpayPayment.fulfilled.match(verificationResult)) {
              // Clear cart and coupon
              await dispatch(clearCart());
              dispatch(clearAppliedCoupon());
              
              toast.success("Payment successful! Your order has been confirmed.");
              
              // Store order info in session storage
              sessionStorage.setItem('lastOrder', JSON.stringify({
                orderNumber: order.orderNumber,
                orderId: order._id,
                total: order.total,
                paymentId: verificationResult.payload.data.razorpayPaymentId
              }));
              
              // Redirect to order success page
              router.push(`/order-success?order=${order.orderNumber}`);
            } else {
              throw new Error(verificationResult.payload || "Payment verification failed");
            }
          } catch (error: any) {
            console.error("Payment verification error:", error);
            toast.error(error.message || "Payment verification failed");
            setProcessingPayment(false);
          }
        },
        prefill: {
          name: address.name,
          email: address.email,
          contact: address.phone,
        },
        notes: {
          orderId: order._id,
          orderNumber: order.orderNumber,
        },
        theme: {
          color: "#6366f1", // Your primary color
        },
        modal: {
          ondismiss: () => {
            setProcessingPayment(false);
            toast.info("Payment cancelled");
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      
      razorpay.on('payment.failed', (response: any) => {
        console.error("Payment failed:", response.error);
        toast.error(`Payment failed: ${response.error.description}`);
        setProcessingPayment(false);
      });

      razorpay.open();
      
    } catch (error: any) {
      console.error("Razorpay error:", error);
      toast.error(error.message || "Failed to initialize payment");
      setProcessingPayment(false);
    }
  }, [address, dispatch, router]);

  /* ---------------- PLACE ORDER & PAY ---------------- */
  const placeOrderAndPay = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    if (!selectedShipping) {
      toast.error("Please select a shipping method");
      return;
    }

    setProcessingPayment(true);

    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        productVariationId: item.variationId || undefined,
        quantity: item.qty,
        price: item.price,
        name: item.name,
        image: item.image,
        attributes: item.attributes,
        originalPrice: item.originalPrice,
      }));

      const orderData: Partial<Order> = {
        customerName: address.name,
        customerEmail: address.email,
        customerPhone: address.phone,
        shippingAddress: {
          addressLine1: address.address,
          addressLine2: address.landmark || "",
          city: address.city,
          state: address.state,
          postalCode: address.pincode,
          country: "India",
        },
        billingAddress: {
          addressLine1: address.address,
          addressLine2: address.landmark || "",
          city: address.city,
          state: address.state,
          postalCode: address.pincode,
          country: "India",
        },
        shippingMethodId: selectedShipping._id,
        shippingCost: selectedShipping.price || 0,
        subtotal,
        tax,
        discount: discountAmount,
        total,
        notes: "",
        items: orderItems,
        userAgent: navigator.userAgent,
        couponCode: appliedCoupon?.code || null,
      };

      // Step 1: Create order
      const orderResult: any = await dispatch(createOrder(orderData));

      if (!createOrder.fulfilled.match(orderResult)) {
        throw new Error(orderResult.payload?.message || "Order creation failed");
      }

      const createdOrder = orderResult.payload.order;
      
      // Step 2: Initiate Razorpay payment
      const paymentResult: any = await dispatch(initiateRazorpayPayment(createdOrder._id!));

      if (!initiateRazorpayPayment.fulfilled.match(paymentResult)) {
        throw new Error(paymentResult.payload || "Payment initiation failed");
      }

      // Step 3: Open Razorpay checkout
      await handleRazorpayPayment(createdOrder, paymentResult.payload.data);

    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to process order");
      setProcessingPayment(false);
    }
  };

  /* ---------------- CHECK PENDING PAYMENTS ---------------- */
  useEffect(() => {
    const lastOrder = sessionStorage.getItem('lastOrder');
    if (lastOrder) {
      try {
        const orderData = JSON.parse(lastOrder);
        if (orderData.orderNumber) {
          // Check payment status
          dispatch(checkPaymentStatus(orderData.orderNumber));
        }
      } catch (error) {
        console.error("Error parsing lastOrder:", error);
      }
    }
  }, [dispatch]);

  /* ---------------- EMPTY CART ---------------- */
  if (!items.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-4">
        <div className="text-center">
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-24 h-24 text-primary/40" />
          </div>
          <h2 className="text-3xl font-bold mb-3 text-gray-800">Your cart is empty</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Add some amazing products to your cart before proceeding to checkout.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/">
            <Button size="lg" variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Button>
          </Link>
          <Link href="/cart">
            <Button size="lg" className="gap-2">
              <Package className="w-4 h-4" />
              View Cart
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  /* ---------------- MAIN UI ---------------- */
  return (
    <div className="min-h-screen py-5 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
                <Lock className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-primary">Secure Checkout</h1>
                <p className="text-gray-600 mt-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-sm px-4 py-2">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <Link href="/cart">
              <Button variant="ghost" className="gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4" />
                Back to Cart
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              onClick={clearAllItems}
              disabled={loadingClear}
              className="gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Address, Shipping */}
          <div className="col-span-1 lg:col-span-2 space-y-8">
            {/* Cart Items with Quantity Controls */}
            <Card className="p-6 border-0 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Review Your Items</h2>
                  <p className="text-gray-600">You can adjust quantities here</p>
                </div>
              </div>

              <div className="space-y-6">
                {items.map((item) => {
                  const isLoading = loadingItems.includes(item.cartId);
                  const isOutOfStock = item.stock !== null && item.qty >= item.stock;
                  const itemTotal = item.price * item.qty;

                  return (
                    <div key={item.cartId} className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100/80 transition-colors">
                      <div className="relative shrink-0">
                        <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200">
                          <img
                            src={`${item.image}`}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {item.stock !== null && item.qty >= item.stock && (
                          <Badge variant="destructive" className="absolute -top-2 -right-2 text-xs">
                            Max Stock
                          </Badge>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                              {item.name}
                            </h3>
                            
                            {Object.keys(item.attributes).length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {Object.entries(item.attributes).map(([key, value]: any) => (
                                  <Badge 
                                    key={key} 
                                    variant="outline" 
                                    className="text-xs px-2 py-0.5 capitalize"
                                  >
                                    {key}: {value}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-bold text-gray-900">₹{item.price}</span>
                              {item.originalPrice > item.price && (
                                <span className="text-sm text-gray-400 line-through">
                                  ₹{item.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-gray-500 mb-1">Item Total</p>
                            <p className="text-lg font-bold text-gray-900">₹{itemTotal}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => changeQty(item.cartId, item.qty - 1, item.stock)}
                              disabled={isLoading || item.qty <= 1}
                              className="rounded-full w-8 h-8 border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>

                            <span className="w-12 text-center font-semibold text-lg">
                              {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                              ) : (
                                item.qty
                              )}
                            </span>

                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => changeQty(item.cartId, item.qty + 1, item.stock)}
                              disabled={isLoading || isOutOfStock}
                              className="rounded-full w-8 h-8 border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.cartId)}
                            disabled={isLoading}
                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>

                        {item.stock !== null && (
                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-green-500 rounded-full"
                                  style={{ width: `${Math.min((item.qty / item.stock) * 100, 100)}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-600">
                                {item.stock - item.qty} left
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Shipping Address */}
            <Card className="p-8 border-0 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Delivery Address</h2>
                  <p className="text-gray-600">Where should we deliver your order?</p>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                      <Home className="w-4 h-4" />
                      Full Name *
                    </Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={address.name} 
                      onChange={handleChange} 
                      className={`h-12 ${formErrors.name ? 'border-red-500' : ''}`}
                      placeholder="John Doe"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4" />
                      Email Address *
                    </Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={address.email} 
                      onChange={handleChange} 
                      className={`h-12 ${formErrors.email ? 'border-red-500' : ''}`}
                      placeholder="john@example.com"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                      <Phone className="w-4 h-4" />
                      Phone Number *
                    </Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={address.phone} 
                      onChange={handleChange} 
                      className={`h-12 ${formErrors.phone ? 'border-red-500' : ''}`}
                      placeholder="9876543210"
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="address" className="flex items-center gap-2 mb-2">
                      <Navigation className="w-4 h-4" />
                      Street Address *
                    </Label>
                    <Input 
                      id="address" 
                      name="address" 
                      value={address.address} 
                      onChange={handleChange} 
                      className={`h-12 ${formErrors.address ? 'border-red-500' : ''}`}
                      placeholder="123 Main Street, Apt 4B"
                    />
                    {formErrors.address && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="landmark" className="flex items-center gap-2 mb-2">
                      <Building className="w-4 h-4" />
                      Landmark (Optional)
                    </Label>
                    <Input 
                      id="landmark" 
                      name="landmark" 
                      value={address.landmark} 
                      onChange={handleChange} 
                      className="h-12"
                      placeholder="Near City Mall, Opposite Park"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="mb-2 block">City *</Label>
                      <Input 
                        id="city" 
                        name="city" 
                        value={address.city} 
                        onChange={handleChange} 
                        className={`h-12 ${formErrors.city ? 'border-red-500' : ''}`}
                        placeholder="Mumbai"
                      />
                      {formErrors.city && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="state" className="mb-2 block">State *</Label>
                      <Input 
                        id="state" 
                        name="state" 
                        value={address.state} 
                        onChange={handleChange} 
                        className={`h-12 ${formErrors.state ? 'border-red-500' : ''}`}
                        placeholder="Maharashtra"
                      />
                      {formErrors.state && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="pincode" className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        PIN Code *
                      </Label>
                    </div>
                    <div className="relative">
                      <Input 
                        id="pincode" 
                        name="pincode" 
                        value={address.pincode} 
                        onChange={handleChange} 
                        className={`h-12 pl-9 ${formErrors.pincode ? 'border-red-500' : ''}`}
                        placeholder="400001"
                        maxLength={6}
                      />
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    {formErrors.pincode && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.pincode}</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Shipping Method */}
            <Card className="p-8 border-0 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-green-50">
                    <Truck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Shipping Method</h2>
                    <p className="text-gray-600">
                      Select your preferred delivery option
                    </p>
                  </div>
                </div>
                {selectedShipping && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Estimated Delivery: {selectedShipping.estimatedDays || '3-5 business days'}
                  </Badge>
                )}
              </div>
              
              {shippingLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                  <p className="text-gray-600">Loading shipping methods...</p>
                </div>
              ) : shippingMethods?.length > 0 ? (
                <RadioGroup 
                  value={selectedShipping?._id} 
                  onValueChange={(value) => {
                    const method = shippingMethods.find((m: any) => m._id === value);
                    setSelectedShipping(method);
                    // Recalculate coupon with new shipping cost if coupon is applied
                    if (appliedCoupon) {
                      dispatch(applyCoupon({
                        code: appliedCoupon.code,
                        cartTotal: subtotal,
                        shippingCost: method?.price || 0,
                        productIds: productIds,
                      }));
                    }
                  }}
                  className="space-y-4"
                >
                  {shippingMethods.map((m: any) => (
                    <label
                      key={m._id}
                      className={`flex flex-col lg:flex-row lg:items-center justify-between p-4 lg:p-6 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedShipping?._id === m._id 
                          ? 'border-primary bg-primary/5 shadow-md' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <RadioGroupItem value={m._id} className="h-5 w-5" />
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-lg ${m.price === 0 ? 'bg-green-100' : 'bg-gray-100'}`}>
                            <Truck className={`w-5 h-5 ${m.price === 0 ? 'text-green-600' : 'text-gray-600'}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-gray-900">{m.name}</p>
                              {m.price === 0 && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                  Free Delivery
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <p className="text-sm text-gray-600">
                                {m.estimatedDays || '3-5 business days'}
                              </p>
                            </div>
                            {m.description && (
                              <p className="text-xs text-gray-500 mt-1">{m.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right mt-4 lg:mt-0">
                        <span className={`text-xl font-bold ${
                          m.price === 0 ? 'text-green-600' : 'text-gray-900'
                        }`}>
                          {m.price === 0 ? 'FREE' : `₹${m.price}`}
                        </span>
                        {m.price > 0 && (
                          <p className="text-xs text-gray-500 mt-1">Delivery charge</p>
                        )}
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                    <Truck className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No Shipping Methods Available
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Please contact customer support for assistance with your delivery.
                  </p>
                </div>
              )}

              {selectedShipping && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-700">Delivery Promise</p>
                    <p className="text-xs text-blue-600">
                      Your order will be delivered by {selectedShipping.estimatedDays || '3-5 business days'}. 
                      Tracking information will be provided once shipped.
                    </p>
                  </div>
                </div>
              )}
            </Card>

            {/* Payment Method Selection */}
            <Card className="p-8 border-0 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50">
                  <CreditCard className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
                  <p className="text-gray-600">Select how you'd like to pay</p>
                </div>
              </div>

              <RadioGroup 
                value={paymentMethod} 
                onValueChange={(value: any) => setPaymentMethod(value)}
                className="space-y-4"
              >
                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'razorpay' 
                      ? 'border-primary bg-primary/5 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <RadioGroupItem value="razorpay" className="h-5 w-5" />
                  <div className="flex-1 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-indigo-100">
                        <CreditCard className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Razorpay</p>
                        <p className="text-sm text-gray-600">Pay via UPI, Card, NetBanking, Wallet</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <img src="/razorpay-icon.svg" alt="Razorpay" className="h-6 w-auto" />
                      <span className="text-xs text-gray-500">Secure</span>
                    </div>
                  </div>
                </label>
              </RadioGroup>

              <div className="mt-6 p-4 bg-indigo-50 rounded-lg flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium text-indigo-700">100% Secure Payments</p>
                  <p className="text-xs text-indigo-600">
                    Your payment information is encrypted and processed securely by Razorpay.
                    We never store your card details.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 p-8 bg-gradient-to-br from-white to-gray-50 border-0 shadow-xl rounded-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <Package className="w-6 h-6 text-primary" />
                Order Summary
              </h2>

              {/* Order Items Summary (Compact) */}
<div className="space-y-4 mb-6 max-h-56 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
  {items.map((item, idx) => (
    <div 
      key={idx} 
      className="flex justify-between items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
    >
      {/* Left: Image + Details */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="font-medium text-gray-900 line-clamp-2 leading-snug text-[13px]">
            {item.name}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              Qty: {item.qty}
            </span>
            <span className="text-xs text-gray-400">
              ₹{item.price} each
            </span>
          </div>
        </div>
      </div>

      {/* Right: Price */}
      <div className="text-right pt-0.5">
        <span className="font-semibold text-gray-900 text-[13px]">
          ₹{(item.price * item.qty).toLocaleString('en-IN')}
        </span>
      </div>
    </div>
  ))}
</div>

              <Separator className="my-6" />

              {/* COUPON CODE SECTION */}
              <div className="mb-6">
                {!appliedCoupon ? (
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Tag className="w-4 h-4" />
                      Have a coupon code?
                    </Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          type="text"
                          placeholder="Enter code (e.g., SAVE20)"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                          className="h-11 pl-9 uppercase"
                          disabled={orderLoading || processingPayment}
                        />
                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      <Button
                        onClick={handleApplyCoupon}
                        disabled={applyingCoupon || !couponCode.trim() || orderLoading || processingPayment}
                        className="h-11 px-4 bg-primary text-white hover:bg-primary/90"
                      >
                        {applyingCoupon ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Apply'
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Enter your coupon code to get exclusive discounts
                    </p>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-green-900">
                            {appliedCoupon.code}
                          </p>
                          <p className="text-sm text-green-700">
                            {appliedCoupon.type === 'percentage' 
                              ? `${appliedCoupon.value}% off` 
                              : appliedCoupon.type === 'fixed'
                              ? `₹${appliedCoupon.value} off`
                              : 'Free shipping'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        disabled={orderLoading || processingPayment}
                        className="p-2 text-green-700 hover:bg-green-100 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <p className="text-sm text-green-800 flex items-center justify-between">
                        <span>You saved:</span>
                        <span className="font-bold text-lg">₹{discountAmount}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Separator className="my-6" />

              {/* Price Breakdown */}
              <div className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-gray-900">₹{subtotal}</span>
                </div>
                
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600 flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" />
                    GST (5%)
                  </span>
                  <span className="text-blue-600 font-semibold">+₹{tax}</span>
                </div>
                
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Shipping
                  </span>
                  <div className="text-right">
                    <span className={`font-semibold ${shippingCost === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {shippingCost === 0 ? 'FREE' : `+₹${shippingCost}`}
                    </span>
                    {selectedShipping && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {selectedShipping.name}
                      </p>
                    )}
                  </div>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-lg">
                    <span className="text-green-600 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Discount ({appliedCoupon.code})
                    </span>
                    <span className="font-semibold text-green-600">-₹{discountAmount}</span>
                  </div>
                )}

                <Separator className="my-4" />

                {/* Total */}
                <div className="flex justify-between items-center pt-2">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">Total Amount</span>
                    <p className="text-xs text-gray-500 mt-1">Including all taxes & charges</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-primary">₹{total}</span>
                    <p className="text-xs text-gray-500 mt-1">
                      ₹{subtotal} + ₹{tax} GST + {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`} shipping
                      {appliedCoupon && ` - ₹${discountAmount} discount`}
                    </p>
                  </div>
                </div>

                {/* Place Order & Pay Button */}
                <Button
                  size="lg"
                  className="w-full mt-8 text-white h-14 text-lg font-semibold bg-background cursor-pointer transition-all duration-300"
                  onClick={placeOrderAndPay}
                  disabled={
                    orderLoading || 
                    shippingLoading || 
                    !selectedShipping ||
                    items.length === 0 ||
                    processingPayment ||
                    paymentMethod !== 'razorpay'
                  }
                >
                  {orderLoading || processingPayment ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {orderLoading ? 'Creating Order...' : processingPayment ? 'Redirecting to Payment...' : ''}
                    </>
                  ) : !selectedShipping ? (
                    <>
                      <Truck className="w-5 h-5 mr-2" />
                      Select Shipping Method
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Pay ₹{total} with Razorpay
                    </>
                  )}
                </Button>

                {/* Payment Features */}
                <div className="mt-6 grid grid-cols-3 gap-2 text-xs text-center">
                  <div className="p-2">
                    <CreditCard className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <p>Credit/Debit Card</p>
                  </div>
                  <div className="p-2">
                    {/* <img src="/upi-icon.svg" alt="UPI" className="w-4 h-4 mx-auto mb-1" /> */}
                    <p>UPI</p>
                  </div>
                  <div className="p-2">
                    <Building className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <p>NetBanking</p>
                  </div>
                </div>

                {/* Selected Shipping Summary */}
                <div className="mt-4 space-y-2 text-xs text-gray-500">
                  {selectedShipping && (
                    <div className="flex items-center justify-between">
                      <span>Delivery by:</span>
                      <span className="font-medium text-gray-700">
                        {selectedShipping.estimatedDays || '3-5 business days'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    By placing your order, you agree to our{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </div>

                {/* Security Badges */}
                <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    SSL Secure
                  </div>
                  <div className="flex items-center gap-1">
                    <Lock className="w-4 h-4 text-green-600" />
                    Encrypted
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    PCI DSS
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}