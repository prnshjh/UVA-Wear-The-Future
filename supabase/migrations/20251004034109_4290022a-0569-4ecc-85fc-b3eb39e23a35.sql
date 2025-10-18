-- Create category enum
CREATE TYPE public.product_category AS ENUM ('Jeans', 'T-Shirts', 'Shirts', 'Hoodies', 'Jackets');

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category public.product_category NOT NULL,
  sizes TEXT[] NOT NULL DEFAULT '{}',
  stock INTEGER NOT NULL DEFAULT 0,
  images TEXT[] NOT NULL DEFAULT '{}',
  trending BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products (e-commerce)
CREATE POLICY "Products are viewable by everyone"
  ON public.products FOR SELECT
  USING (true);

-- Create index for better performance
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_trending ON public.products(trending);
CREATE INDEX idx_products_price ON public.products(price);

-- Insert sample products
INSERT INTO public.products (name, description, price, category, sizes, stock, images, trending) VALUES
('Classic Slim Fit Jeans', 'Premium denim with stretch comfort. Perfect for everyday wear.', 299900, 'Jeans', ARRAY['28', '30', '32', '34', '36'], 50, ARRAY['/placeholder.svg'], true),
('Black Crew Neck T-Shirt', 'Essential cotton tee with modern fit. Soft and breathable.', 99900, 'T-Shirts', ARRAY['S', 'M', 'L', 'XL'], 100, ARRAY['/placeholder.svg'], true),
('Oxford Button-Down Shirt', 'Classic oxford shirt in crisp cotton. Timeless style.', 199900, 'Shirts', ARRAY['S', 'M', 'L', 'XL'], 75, ARRAY['/placeholder.svg'], false),
('Minimalist Hoodie', 'Premium fleece hoodie. Comfort meets style.', 349900, 'Hoodies', ARRAY['S', 'M', 'L', 'XL', 'XXL'], 60, ARRAY['/placeholder.svg'], true),
('Urban Bomber Jacket', 'Modern bomber with premium finish. Street-ready style.', 599900, 'Jackets', ARRAY['S', 'M', 'L', 'XL'], 40, ARRAY['/placeholder.svg'], true),
('Raw Selvedge Jeans', 'Authentic Japanese selvedge denim. Ages beautifully.', 449900, 'Jeans', ARRAY['28', '30', '32', '34', '36'], 30, ARRAY['/placeholder.svg'], false),
('White Premium Tee', 'Heavyweight cotton tee. Superior quality.', 129900, 'T-Shirts', ARRAY['S', 'M', 'L', 'XL'], 80, ARRAY['/placeholder.svg'], false),
('Linen Summer Shirt', 'Breathable linen blend. Perfect for warm days.', 229900, 'Shirts', ARRAY['S', 'M', 'L', 'XL'], 45, ARRAY['/placeholder.svg'], false),
('Tech Fleece Hoodie', 'Advanced fabric technology. Lightweight warmth.', 399900, 'Hoodies', ARRAY['S', 'M', 'L', 'XL'], 55, ARRAY['/placeholder.svg'], false),
('Leather Biker Jacket', 'Genuine leather with quilted details. Statement piece.', 999900, 'Jackets', ARRAY['S', 'M', 'L', 'XL'], 20, ARRAY['/placeholder.svg'], true);