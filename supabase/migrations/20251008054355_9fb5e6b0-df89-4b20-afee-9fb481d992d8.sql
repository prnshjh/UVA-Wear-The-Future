-- Add foreign key constraint to wishlists table
ALTER TABLE public.wishlists
ADD CONSTRAINT wishlists_product_id_fkey
FOREIGN KEY (product_id)
REFERENCES public.products(id)
ON DELETE CASCADE;