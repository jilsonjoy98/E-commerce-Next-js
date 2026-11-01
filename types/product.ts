export interface ProductReview {
  id: string;
  user: string;
  rating: number;
  date: string;
  comment: string;
}

export interface ProductVariant {
  id: string;
  type: string;
  color: string;
  color_code: string;
  price: number;
  image: string;
  stock: number;
}

export interface ProductRating {
  rate: number;
  count: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  tag: string;
  base_price: number;
  featured: boolean;
  rating: ProductRating;
  reviews?: ProductReview[];
  default_image: string;
  variants?: ProductVariant[];
}
