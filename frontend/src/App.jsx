import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import { Login } from './features/auth/Login';
import { Register } from './features/auth/Register';
import { BuyerLayout } from './layouts/BuyerLayout';
import { SellerLayout } from './layouts/SellerLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { BuyerHome } from './features/catalog/BuyerHome';
import { SellerDashboardHome } from './features/seller/SellerDashboardHome';
import { AnimatedHero } from './components/ui/AnimatedHero';
import {
  CategoryPage, SearchResults, ProductDetail, VendorStorefront,
  CartPage, CheckoutPage, OrderHistory, Wishlist, ProfilePage
} from './features/pages/BuyerPages';
import {
  SellerOnboarding, ProductManager, BulkUpload, OrderManager,
  SellerAnalytics, PayoutLedger, StoreSettings
} from './features/pages/SellerPages';
import {
  VendorApproval, CatalogModeration, PromotionsCMS,
  OrderOversight, PlatformAnalytics, CommissionConfig
} from './features/pages/AdminPages';
import { PlatformSplash } from './features/pages/PlatformSplash';

function ProtectedRoute({ children, allowedRole }) {
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
                    <Route path="/" element={<PlatformSplash />} />

                    <Route path="/store" element={<BuyerLayout />}>
            <Route index element={
              <>
                <AnimatedHero />
                <div id="shop-section" className="max-w-7xl mx-auto px-6 mt-12 scroll-mt-32">
                  <BuyerHome />
                </div>
              </>
            } />
            <Route path="category/:id" element={<CategoryPage />} />
            <Route path="search" element={<SearchResults />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="vendor/:id" element={<VendorStorefront />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

                    <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

                    <Route path="/seller" element={<ProtectedRoute allowedRole="SELLER"><SellerLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="onboarding" element={<SellerOnboarding />} />
            <Route path="dashboard" element={<SellerDashboardHome />} />
            <Route path="products" element={<ProductManager />} />
            <Route path="products/bulk" element={<BulkUpload />} />
            <Route path="orders" element={<OrderManager />} />
            <Route path="analytics" element={<SellerAnalytics />} />
            <Route path="payouts" element={<PayoutLedger />} />
            <Route path="settings" element={<StoreSettings />} />
          </Route>

                    <Route path="/admin" element={<ProtectedRoute allowedRole="ADMIN"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="analytics" />} />
            <Route path="vendors" element={<VendorApproval />} />
            <Route path="catalog" element={<CatalogModeration />} />
            <Route path="promotions" element={<PromotionsCMS />} />
            <Route path="orders" element={<OrderOversight />} />
            <Route path="analytics" element={<PlatformAnalytics />} />
            <Route path="commissions" element={<CommissionConfig />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
