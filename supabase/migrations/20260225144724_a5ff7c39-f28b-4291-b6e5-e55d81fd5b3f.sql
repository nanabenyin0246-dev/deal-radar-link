
-- ============================================
-- RobCompare Database Schema
-- ============================================

-- Enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user', 'vendor');

-- Enum for vendor status
CREATE TYPE public.vendor_status AS ENUM ('pending', 'approved', 'suspended');

-- ============================================
-- 1. Profiles table (all users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  country TEXT DEFAULT 'Ghana',
  preferred_currency TEXT DEFAULT 'GHS',
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 2. User roles table
-- ============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- 3. Vendors table
-- ============================================
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  country TEXT NOT NULL DEFAULT 'Ghana',
  city TEXT,
  whatsapp_number TEXT NOT NULL,
  email TEXT,
  website TEXT,
  trust_score INTEGER DEFAULT 50 CHECK (trust_score >= 0 AND trust_score <= 100),
  verified BOOLEAN DEFAULT FALSE,
  status vendor_status DEFAULT 'pending',
  total_views INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved vendors visible to all" ON public.vendors FOR SELECT USING (status = 'approved' OR auth.uid() = user_id);
CREATE POLICY "Vendors can update own profile" ON public.vendors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can register as vendor" ON public.vendors FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 4. Categories table
-- ============================================
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories visible to all" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- 5. Products table
-- ============================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  brand TEXT,
  description TEXT,
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES public.categories(id),
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active products visible to all" ON public.products FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- 6. Vendor Offers (vendor-product price link)
-- ============================================
CREATE TABLE public.vendor_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  price NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GHS',
  in_stock BOOLEAN DEFAULT TRUE,
  is_visible BOOLEAN DEFAULT TRUE,
  shipping_days INTEGER DEFAULT 3,
  whatsapp_message TEXT,
  payment_link TEXT,
  variant_info JSONB DEFAULT '{}',
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(vendor_id, product_id, currency)
);

ALTER TABLE public.vendor_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visible offers readable by all" ON public.vendor_offers FOR SELECT USING (is_visible = TRUE);
CREATE POLICY "Vendors can manage own offers" ON public.vendor_offers FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.vendors WHERE id = vendor_id AND user_id = auth.uid())
);
CREATE POLICY "Vendors can update own offers" ON public.vendor_offers FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.vendors WHERE id = vendor_id AND user_id = auth.uid())
);
CREATE POLICY "Vendors can delete own offers" ON public.vendor_offers FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.vendors WHERE id = vendor_id AND user_id = auth.uid())
);

-- ============================================
-- 7. Price History
-- ============================================
CREATE TABLE public.price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_offer_id UUID NOT NULL REFERENCES public.vendor_offers(id) ON DELETE CASCADE,
  price NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Price history readable by all" ON public.price_history FOR SELECT USING (true);

-- ============================================
-- 8. Updated_at trigger function
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vendor_offers_updated_at BEFORE UPDATE ON public.vendor_offers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 9. Auto-create profile + role on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 10. Product images storage bucket
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

CREATE POLICY "Product images publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Authenticated users can upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own product images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- 11. Indexes for performance
-- ============================================
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_vendor_offers_product ON public.vendor_offers(product_id);
CREATE INDEX idx_vendor_offers_vendor ON public.vendor_offers(vendor_id);
CREATE INDEX idx_vendors_user ON public.vendors(user_id);
CREATE INDEX idx_price_history_offer ON public.price_history(vendor_offer_id);
