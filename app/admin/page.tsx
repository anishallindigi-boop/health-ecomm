'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  ShoppingCart,
  DollarSign,
  Activity,
  TrendingUp,
  Clock,
  Package,
  CreditCard,
  UserCheck,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  ChartCandlestick,
  Wallet,
  X,
  Search,
  Bell,
  ChevronDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { getAllOrders } from '@/redux/slice/OrderSlice';
import { getProducts } from '@/redux/slice/ProductSlice';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Format currency in INR
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Get status badge variant with custom colors
const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'processing':
      return { variant: 'default', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' };
    case 'shipped':
      return { variant: 'default', className: 'bg-blue-100 text-blue-700 hover:bg-blue-100' };
    case 'delivered':
    case 'completed':
    case 'order success':
      return { variant: 'default', className: 'bg-green-100 text-green-700 hover:bg-green-100' };
    case 'cancelled':
      return { variant: 'default', className: 'bg-red-100 text-red-700 hover:bg-red-100' };
    default:
      return { variant: 'default', className: 'bg-gray-100 text-gray-700 hover:bg-gray-100' };
  }
};

// Check if payment is captured (successful)
const isPaymentCaptured = (order: any) => {
  // Check different possible payment status fields
  const paymentStatus = order.paymentStatus?.toLowerCase() || '';
  const orderStatus = order.status?.toLowerCase() || '';
  const paymentIntent = order.paymentIntent;
  
  return (
    paymentStatus === 'captured' || 
    paymentStatus === 'succeeded' || 
    paymentStatus === 'completed' ||
    paymentStatus === 'paid' ||
    orderStatus === 'completed' ||
    orderStatus === 'delivered' ||
    orderStatus === 'order success' ||
    (paymentIntent && paymentIntent.status === 'succeeded') ||
    order.paymentCaptured === true
  );
};

// Chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Helper function to generate monthly sales data (only for captured payments)
const generateMonthlySalesData = (orders: any[] = []) => {
  const now = new Date();
  const months = [];
  
  // Filter only orders with captured payments
  const capturedOrders = orders.filter(order => isPaymentCaptured(order));
  
  // Get last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = format(date, 'MMM');
    
    // Filter captured orders for this month
    const monthOrders = capturedOrders.filter(order => {
      const orderDate = new Date(order.createdAt || 0);
      return (
        orderDate.getMonth() === date.getMonth() &&
        orderDate.getFullYear() === date.getFullYear()
      );
    });
    
    const revenue = monthOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    months.push({
      name: monthName,
      revenue,
      orders: monthOrders.length
    });
  }
  
  return months;
};

// Helper function to generate category distribution
const generateCategoryData = (products: any[]) => {
  const categories: Record<string, number> = {};
  
  products.forEach(product => {
    if (product.categoryid && product.categoryid.length > 0) {
      const category = product.categoryid[0]; // Assuming first category is primary
      categories[category] = (categories[category] || 0) + 1;
    }
  });
  
  return Object.entries(categories).map(([name, value]) => ({
    name,
    value
  }));
};

const AdminDashboard = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading: authLoading } = useAppSelector((state: RootState) => state.auth);
  const { orders, loading: ordersLoading, error } = useAppSelector((state: RootState) => state.order);
  const { products, loading: productsLoading } = useAppSelector((state: RootState) => state.product);
  
  // Generate chart data from real data (only captured payments)
  const salesData = generateMonthlySalesData(orders);
  const categoryData = generateCategoryData(products);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate dashboard stats
  // Only include captured payments in revenue calculation
  const capturedOrders = orders.filter(order => isPaymentCaptured(order));
  const totalRevenue = capturedOrders.reduce((sum, order) => sum + (order.total || 0), 0);
  
  // All orders count (for total orders)
  const totalOrders = orders.length;
  
  // Payment stats
  const pendingPayments = orders.filter(order => !isPaymentCaptured(order) && order.status?.toLowerCase() !== 'cancelled').length;
  const cancelledOrders = orders.filter(order => order.status?.toLowerCase() === 'cancelled').length;
  
  // Calculate product stats
  const totalProducts = products.length;
  const publishedProducts = products.filter(p => p.status === 'published').length;
  const outOfStockProducts = products.filter(p => 
    parseInt(p.stock || '0') <= 0
  ).length;

  // Stats data
  const stats = [
    { 
      title: 'Total Products', 
      value: totalProducts.toString(),
      icon: Package, 
      change: `${totalProducts > 0 ? Math.round((publishedProducts / totalProducts) * 100) : 0}% Published`, 
      trend: 'up' as const
    },
    { 
      title: 'Total Orders', 
      value: totalOrders.toString(), 
      icon: ShoppingCart, 
      change: `${capturedOrders.length} Completed · ${pendingPayments} Pending`, 
      trend: 'up' as const
    },
    { 
      title: 'Revenue (Captured)', 
      value: formatCurrency(totalRevenue), 
      icon: Wallet, 
      change: `From ${capturedOrders.length} successful payments`,
      trend: 'up' as const
    },
    { 
      title: 'Out of Stock', 
      value: outOfStockProducts.toString(), 
      icon: ChartCandlestick, 
      change: `${totalProducts > 0 ? Math.round((outOfStockProducts / totalProducts) * 100) : 0}% of products`, 
      trend: outOfStockProducts > 0 ? 'up' as const : 'down' as const
    },
  ];

  useEffect(() => {
    // Fetch data when component mounts
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch both orders and products
        await Promise.all([
         dispatch(getAllOrders({ 
            page: 1,
            limit: 100, // Get enough orders for meaningful analytics
            sortBy: 'createdAt',
            sortOrder: 'desc'
            // You can add additional filters if needed:
            // paymentStatus: 'captured', // Uncomment if you want to filter by payment status
          })).unwrap(),
          dispatch(getProducts()).unwrap()
        ]);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  // Format date
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  // Format order date
  const formatOrderDate = (dateString?: string) => formatDate(dateString);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading || ordersLoading || productsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="">
        {/* Main Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                      <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
                      <div className={`mt-2 flex items-center text-sm ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" />
                        )}
                        <span className="truncate max-w-[150px]" title={stat.change}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 rounded-full bg-primary/10">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 gap-6 mt-6">
            {/* Revenue and Orders Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Revenue & Orders Overview</CardTitle>
                    <CardDescription>
                      Monthly performance metrics (captured payments only)
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-green-50">
                    <Wallet className="h-3 w-3 mr-1" />
                    Captured Payments
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={salesData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip 
                        formatter={(value: any, name: any) => {
                          if (name === 'revenue') {
                            return [formatCurrency(Number(value)), 'Revenue (Captured)'];
                          }
                          return [value, 'Orders (Captured)'];
                        }}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="orders"
                        name="Orders"
                        stroke="#82ca9d"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Table */}
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Products</CardTitle>
                  <CardDescription>Recently added products ({products.length} total)</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push('/admin/product')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productsLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No products found
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.slice(0, 5).map((product) => (
                      <TableRow key={product._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            {product.mainImage && (
                              <img 
                                src={product.mainImage}
                                alt={product.name}
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            )}
                            <span className="font-medium">{product.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(parseFloat(product.price || '0'))}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={parseInt(product.stock || '0') > 0 ? "default" : "destructive"} 
                            className={parseInt(product.stock || '0') > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                          >
                            {product.stock || '0'} units
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={`px-3 py-1 rounded-full text-xs ${
                              product.status === 'published' 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-400 text-white'
                            }`}
                          >
                            {product.status === 'published' ? 'Published' : 'Draft'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => router.push(`/admin/product/${product._id}`)} 
                            className='cursor-pointer'
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              
              {/* Quick Stats about products */}
              {products.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-500">Published</p>
                    <p className="font-semibold">{publishedProducts}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-500">Out of Stock</p>
                    <p className="font-semibold text-red-600">{outOfStockProducts}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-500">Avg Price</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        products.reduce((acc, p) => acc + parseFloat(p.price || '0'), 0) / products.length
                      )}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>
                    Latest transactions from your store
                    <span className="ml-2 text-xs text-gray-500">
                      ({capturedOrders.length} captured payments)
                    </span>
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push(`/admin/orders`)} className='cursor-pointer'>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordersLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-red-500">
                        Error loading orders: {error}
                      </TableCell>
                    </TableRow>
                  ) : orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.slice(0, 5).map((order) => {
                      const paymentCaptured = isPaymentCaptured(order);
                      return (
                        <TableRow key={order._id}>
                          <TableCell className="font-medium">{order.orderNumber || 'N/A'}</TableCell>
                          <TableCell>{order.customerName || 'N/A'}</TableCell>
                          <TableCell>{formatOrderDate(order.createdAt)}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={getStatusVariant(order.status).variant as any}
                              className={getStatusVariant(order.status).className}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={paymentCaptured ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}
                            >
                              {paymentCaptured ? 'Captured' : 'Pending'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(order.total || 0)}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => router.push(`/admin/orders/${order._id}`)} 
                              className='cursor-pointer'
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;