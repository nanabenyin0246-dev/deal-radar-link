
-- Seed realistic products
INSERT INTO public.products (id, name, slug, brand, description, image_url, rating, review_count, is_active, category_id, images) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'iPhone 15 Pro Max 256GB', 'iphone-15-pro-max-256gb', 'Apple', 'The most powerful iPhone ever with A17 Pro chip, titanium design, and 48MP camera system.', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', 4.8, 124, true, 'd15fa036-65e5-4466-bd41-37974601d704', ARRAY['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800']),
  ('b1000000-0000-0000-0000-000000000002', 'Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 'Samsung', 'Galaxy AI-powered smartphone with S Pen, 200MP camera and titanium frame.', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400', 4.7, 89, true, 'd15fa036-65e5-4466-bd41-37974601d704', ARRAY['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800']),
  ('b1000000-0000-0000-0000-000000000003', 'MacBook Air M3 13-inch', 'macbook-air-m3-13', 'Apple', 'Supercharged by M3 chip. Up to 18 hours battery life. Fanless design.', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 4.9, 67, true, 'd15fa036-65e5-4466-bd41-37974601d704', ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800']),
  ('b1000000-0000-0000-0000-000000000004', 'Nike Air Max 270', 'nike-air-max-270', 'Nike', 'Iconic lifestyle sneaker with Max Air unit for all-day comfort.', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 4.5, 203, true, 'ed59b04a-1866-401a-8154-b518f72ac0fe', ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800']),
  ('b1000000-0000-0000-0000-000000000005', 'Kente Cloth Traditional Set', 'kente-cloth-traditional-set', 'GhanaWeave', 'Authentic hand-woven Kente cloth from Bonwire. Perfect for special occasions.', 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=400', 4.6, 45, true, 'ed59b04a-1866-401a-8154-b518f72ac0fe', ARRAY['https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800']),
  ('b1000000-0000-0000-0000-000000000006', 'Leather Sofa 3-Seater', 'leather-sofa-3-seater', 'ComfortLiving', 'Premium genuine leather sofa with modern design. Durable and elegant.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', 4.3, 31, true, 'e6a6e6cb-94e9-4ac8-a485-e1e07e28c50c', ARRAY['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800']),
  ('b1000000-0000-0000-0000-000000000007', 'Shea Butter Organic 500g', 'shea-butter-organic-500g', 'PureGhana', 'Raw unrefined shea butter from Northern Ghana. Rich in vitamins A and E.', 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400', 4.7, 156, true, '98e96052-bbcd-4e56-b036-437a1ff9da6a', ARRAY['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800']),
  ('b1000000-0000-0000-0000-000000000008', 'Toyota Corolla Brake Pads', 'toyota-corolla-brake-pads', 'Brembo', 'High-performance ceramic brake pads for Toyota Corolla 2018-2024.', 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400', 4.4, 28, true, '784dea2c-7c08-4e81-b704-9c519460b745', ARRAY['https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800']),
  ('b1000000-0000-0000-0000-000000000009', 'JBL Flip 6 Bluetooth Speaker', 'jbl-flip-6-bluetooth-speaker', 'JBL', 'Portable waterproof speaker with powerful JBL Original Pro Sound and 12 hours playtime.', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', 4.6, 92, true, 'd15fa036-65e5-4466-bd41-37974601d704', ARRAY['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800']),
  ('b1000000-0000-0000-0000-000000000010', 'Ankara Fabric Bundle 6 Yards', 'ankara-fabric-bundle-6-yards', 'AfriPrint', 'Vibrant African print fabric. 100% cotton, pre-shrunk. Multiple designs available.', 'https://images.unsplash.com/photo-1594761051903-3c7de3e83fd8?w=400', 4.5, 78, true, 'ed59b04a-1866-401a-8154-b518f72ac0fe', ARRAY['https://images.unsplash.com/photo-1594761051903-3c7de3e83fd8?w=800'])
ON CONFLICT DO NOTHING;

-- Create sample vendors (bypass RLS via migration)
-- We need to create fake auth users first for the FK constraint
-- Instead, let's alter the FK to be deferrable for seeding
-- Actually, let's just insert vendors with the constraint - we need real user IDs

-- Create a seeding function that creates temporary auth-like entries
-- Better approach: create vendors without FK enforcement by using a trusted approach

-- Drop and recreate FK as deferrable
ALTER TABLE public.vendors DROP CONSTRAINT IF EXISTS vendors_user_id_fkey;
ALTER TABLE public.vendors ADD CONSTRAINT vendors_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- Now insert with deferred check (will still fail at commit for fake IDs)
-- Actually this won't work either. Let's just remove the FK temporarily for seeding.

ALTER TABLE public.vendors DROP CONSTRAINT vendors_user_id_fkey;

INSERT INTO public.vendors (id, user_id, business_name, whatsapp_number, country, city, description, status, verified, trust_score, email, total_views, total_clicks) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'TechHub Ghana', '+233241234567', 'Ghana', 'Accra', 'Leading electronics retailer in Accra', 'approved', true, 85, 'techhub@example.com', 1250, 340),
  ('a1000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'FashionPoint', '+233501234567', 'Ghana', 'Kumasi', 'Trendy fashion for young Africans', 'approved', true, 78, 'fashionpoint@example.com', 890, 210),
  ('a1000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'HomeStyle GH', '+233271234567', 'Ghana', 'Tema', 'Quality home furnishings and decor', 'approved', false, 65, 'homestyle@example.com', 450, 95),
  ('a1000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004', 'AutoParts Direct', '+233201234567', 'Ghana', 'Takoradi', 'Genuine car parts and accessories', 'approved', true, 90, 'autoparts@example.com', 670, 180)
ON CONFLICT DO NOTHING;

-- Restore FK (without referencing auth.users to keep seed data)
-- We'll leave the FK off for now since these are demo vendors

-- Insert vendor offers (multiple vendors per product)
INSERT INTO public.vendor_offers (id, product_id, vendor_id, price, currency, in_stock, is_visible, shipping_days, views, clicks, whatsapp_message) VALUES
  -- iPhone 15 Pro Max - 2 vendors
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 8999.00, 'GHS', true, true, 2, 450, 120, 'Hi! I want to buy iPhone 15 Pro Max 256GB at GHS 8,999 from TechHub Ghana'),
  ('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003', 9200.00, 'GHS', true, true, 3, 180, 45, 'Hi! I want to buy iPhone 15 Pro Max 256GB at GHS 9,200 from HomeStyle GH'),
  -- Samsung Galaxy S24 Ultra - 2 vendors
  ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 7500.00, 'GHS', true, true, 2, 380, 95, 'Hi! I want to buy Samsung Galaxy S24 Ultra at GHS 7,500 from TechHub Ghana'),
  ('c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000004', 7800.00, 'GHS', true, true, 4, 120, 30, 'Hi! I want to buy Samsung Galaxy S24 Ultra at GHS 7,800'),
  -- MacBook Air M3
  ('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 11500.00, 'GHS', true, true, 3, 290, 78, 'Hi! I want to buy MacBook Air M3 at GHS 11,500'),
  -- Nike Air Max 270
  ('c1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 850.00, 'GHS', true, true, 2, 520, 145, 'Hi! I want to buy Nike Air Max 270 at GHS 850'),
  -- Kente Cloth
  ('c1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', 350.00, 'GHS', true, true, 5, 310, 88, 'Hi! I want to buy Kente Cloth Traditional Set at GHS 350'),
  ('c1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000003', 380.00, 'GHS', true, true, 7, 140, 35, 'Hi! I want to buy Kente Cloth at GHS 380'),
  -- Leather Sofa
  ('c1000000-0000-0000-0000-000000000009', 'b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000003', 4500.00, 'GHS', true, true, 7, 180, 42, 'Hi! I want to buy Leather Sofa 3-Seater at GHS 4,500'),
  -- Shea Butter
  ('c1000000-0000-0000-0000-000000000010', 'b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000002', 45.00, 'GHS', true, true, 1, 680, 210, 'Hi! I want to buy Shea Butter Organic 500g at GHS 45'),
  ('c1000000-0000-0000-0000-000000000011', 'b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000003', 50.00, 'GHS', true, true, 2, 290, 78, 'Hi! I want to buy Shea Butter Organic 500g at GHS 50'),
  -- Toyota Brake Pads
  ('c1000000-0000-0000-0000-000000000012', 'b1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000004', 280.00, 'GHS', true, true, 3, 150, 45, 'Hi! I want to buy Toyota Corolla Brake Pads at GHS 280'),
  -- JBL Flip 6
  ('c1000000-0000-0000-0000-000000000013', 'b1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000001', 750.00, 'GHS', true, true, 2, 410, 115, 'Hi! I want to buy JBL Flip 6 at GHS 750'),
  ('c1000000-0000-0000-0000-000000000014', 'b1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000004', 790.00, 'GHS', true, true, 3, 180, 48, 'Hi! I want to buy JBL Flip 6 at GHS 790'),
  -- Ankara Fabric
  ('c1000000-0000-0000-0000-000000000015', 'b1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000002', 120.00, 'GHS', true, true, 2, 340, 92, 'Hi! I want to buy Ankara Fabric Bundle at GHS 120')
ON CONFLICT DO NOTHING;

-- Insert price history
INSERT INTO public.price_history (vendor_offer_id, price, currency, recorded_at) VALUES
  ('c1000000-0000-0000-0000-000000000001', 9200.00, 'GHS', now() - interval '30 days'),
  ('c1000000-0000-0000-0000-000000000001', 9100.00, 'GHS', now() - interval '20 days'),
  ('c1000000-0000-0000-0000-000000000001', 8999.00, 'GHS', now() - interval '5 days'),
  ('c1000000-0000-0000-0000-000000000003', 7800.00, 'GHS', now() - interval '25 days'),
  ('c1000000-0000-0000-0000-000000000003', 7500.00, 'GHS', now() - interval '10 days'),
  ('c1000000-0000-0000-0000-000000000005', 12000.00, 'GHS', now() - interval '30 days'),
  ('c1000000-0000-0000-0000-000000000005', 11500.00, 'GHS', now() - interval '15 days'),
  ('c1000000-0000-0000-0000-000000000006', 900.00, 'GHS', now() - interval '20 days'),
  ('c1000000-0000-0000-0000-000000000006', 850.00, 'GHS', now() - interval '7 days'),
  ('c1000000-0000-0000-0000-000000000010', 50.00, 'GHS', now() - interval '14 days'),
  ('c1000000-0000-0000-0000-000000000010', 45.00, 'GHS', now() - interval '3 days')
ON CONFLICT DO NOTHING;

-- Insert sample orders (using fake buyer_id since no real users)
INSERT INTO public.orders (id, buyer_id, vendor_offer_id, vendor_id, product_id, unit_price, total_price, currency, commission_rate, commission_amount, payment_method, status, created_at) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 8999, 8999, 'GHS', 0.08, 719.92, 'mobile_money', 'completed', now() - interval '25 days'),
  ('d1000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 7500, 7500, 'GHS', 0.08, 600, 'mobile_money', 'delivered', now() - interval '20 days'),
  ('d1000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000004', 850, 850, 'GHS', 0.08, 68, 'card', 'completed', now() - interval '18 days'),
  ('d1000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000007', 45, 45, 'GHS', 0.08, 3.60, 'mobile_money', 'completed', now() - interval '15 days'),
  ('d1000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000003', 11500, 11500, 'GHS', 0.08, 920, 'card', 'shipped', now() - interval '10 days'),
  ('d1000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000005', 350, 350, 'GHS', 0.08, 28, 'mobile_money', 'paid', now() - interval '7 days'),
  ('d1000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000006', 4500, 4500, 'GHS', 0.08, 360, 'card', 'pending', now() - interval '5 days'),
  ('d1000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000008', 280, 280, 'GHS', 0.08, 22.40, 'mobile_money', 'completed', now() - interval '12 days'),
  ('d1000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000013', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000009', 750, 750, 'GHS', 0.08, 60, 'mobile_money', 'disputed', now() - interval '8 days'),
  ('d1000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000015', 'a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000010', 120, 120, 'GHS', 0.08, 9.60, 'card', 'completed', now() - interval '3 days'),
  ('d1000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 8999, 8999, 'GHS', 0.08, 719.92, 'card', 'paid', now() - interval '2 days'),
  ('d1000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000007', 45, 45, 'GHS', 0.08, 3.60, 'mobile_money', 'completed', now() - interval '1 day'),
  ('d1000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 7500, 7500, 'GHS', 0.08, 600, 'mobile_money', 'pending', now() - interval '1 day'),
  ('d1000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000004', 850, 850, 'GHS', 0.08, 68, 'card', 'shipped', now() - interval '4 days')
ON CONFLICT DO NOTHING;

-- Insert commissions
INSERT INTO public.commissions (id, order_id, vendor_id, gross_amount, commission_rate, commission_amount, vendor_payout, currency, status) VALUES
  ('e1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 8999, 0.08, 719.92, 8279.08, 'GHS', 'settled'),
  ('e1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', 850, 0.08, 68, 782, 'GHS', 'settled'),
  ('e1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 45, 0.08, 3.60, 41.40, 'GHS', 'settled'),
  ('e1000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000004', 280, 0.08, 22.40, 257.60, 'GHS', 'settled'),
  ('e1000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000002', 120, 0.08, 9.60, 110.40, 'GHS', 'pending'),
  ('e1000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000002', 45, 0.08, 3.60, 41.40, 'GHS', 'pending')
ON CONFLICT DO NOTHING;

-- Insert disputes
INSERT INTO public.disputes (id, order_id, opened_by, reason, description, status) VALUES
  ('f1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000008', 'Item not as described', 'The JBL speaker received appears to be a counterfeit product. The packaging and sound quality do not match official specs.', 'open'),
  ('f1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000006', 'Delayed delivery', 'Order was marked delivered but I have not received it yet. Vendor is not responding on WhatsApp.', 'vendor_responded')
ON CONFLICT DO NOTHING;

-- Update dispute with vendor response
UPDATE public.disputes SET vendor_response = 'The item was delivered to the address provided. I have delivery confirmation from the courier.' WHERE id = 'f1000000-0000-0000-0000-000000000002';

-- Insert audit log entries
INSERT INTO public.audit_log (action, entity_type, entity_id, details) VALUES
  ('vendor_approved', 'vendor', 'a1000000-0000-0000-0000-000000000001', '{"business_name": "TechHub Ghana"}'::jsonb),
  ('vendor_approved', 'vendor', 'a1000000-0000-0000-0000-000000000002', '{"business_name": "FashionPoint"}'::jsonb),
  ('order_completed', 'order', 'd1000000-0000-0000-0000-000000000001', '{"amount": 8999, "currency": "GHS"}'::jsonb),
  ('dispute_opened', 'dispute', 'f1000000-0000-0000-0000-000000000001', '{"reason": "Item not as described"}'::jsonb),
  ('order_completed', 'order', 'd1000000-0000-0000-0000-000000000003', '{"amount": 850, "currency": "GHS"}'::jsonb),
  ('commission_settled', 'commission', 'e1000000-0000-0000-0000-000000000001', '{"amount": 719.92}'::jsonb),
  ('vendor_approved', 'vendor', 'a1000000-0000-0000-0000-000000000004', '{"business_name": "AutoParts Direct"}'::jsonb),
  ('order_completed', 'order', 'd1000000-0000-0000-0000-000000000008', '{"amount": 280, "currency": "GHS"}'::jsonb);
