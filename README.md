# eShop Project

A modern ecommerce application built using Next.js, TypeScript, Zustand, and Tailwind CSS.

## 🚀 Live Demo

[Click here to view the live project](https://e-commerce-next-js-q2os.vercel.app/)

## Features

- Product listing
- Category based product filtering
- Shopping cart
- Add and remove products
- Responsive design
- Reusable components
- Live Product Viewers
- 
## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Socket.IO

## Installation

1. Clone the repository:

```bash
git clone https://github.com/jilsonjoy98/E-commerce-Next-js.git
```

2. Navigate to the project:

```bash
cd e-com
```

3. Install dependencies:

```bash
npm install
```

4. Start development server:

```bash
npm run dev
```

5. Open in browser:

```text
http://localhost:3000
```

## Project Structure

```text
src/
├── app/
├── components/
├── data/
├── lib/
├── public/
├── server/
├── store/
└── types/
```

## Home page

![Home Page](https://i.postimg.cc/mDYz4kCD/home-page.png)

The homepage provides a clean and user-friendly shopping experience with the following sections:

- **Promotional Banner:** Highlights special offers, discounts, and promotional campaigns.
- **Categories:** Displays categories such as Electronics and Toys for easy product navigation.
- **Featured Products:** Showcases selected products with images, names, prices, and product details.

The homepage is designed to make product discovery simple and improve the overall shopping experience.

## Product Listing Page

![Products listing Page](https://i.postimg.cc/nLMgNQ8H/product-page.png)

The product listing page allows users to browse and discover products with flexible filtering and sorting options.

- View All Products: Displays all available products in an organized product grid.
- Search Products: Allows users to quickly find products by searching for product names.
- Category Filter: Filters products based on selected categories, such as Electronics and Toys.
- Price Filter: Allows users to filter products within a specific price range.
- Tags Filter: Filters products based on associated product tags.
- Sorting: Sorts products based on price, popularity, or other available sorting options.

## Product Detail Page

![Products detail Page](https://i.postimg.cc/rwGwz3zP/product-detail-page.png)

The product detail page provides complete product information and an interactive shopping experience.

- Product Images: Displays product images with image navigation.
- Product Information: Shows product name, description, price, and availability.
- Product Variants: Allows users to select available product options, if applicable.
- Quantity Selection: Allows users to increase or decrease product quantity.
- Add to Cart: Adds the selected product to the shopping cart.
- Live Viewers: Displays the number of users currently viewing the same product in real time using Socket.IO.

## Shopping Cart Page

![Cart Page](https://i.postimg.cc/RVdMBfYD/cart-page.png)

The shopping cart page allows users to manage their selected products before proceeding to checkout.

- Cart Items: Displays all products added to the shopping cart.
- Product Details: Shows product images, names, prices, and selected quantities.
- Quantity Management: Allows users to increase or decrease product quantities.
- Remove Products: Allows users to remove individual products from the cart.
- Price Calculation: Automatically calculates the subtotal and total price based on product quantities.
- Cart Summary: Displays the order summary and total amount.
- Continue Shopping: Allows users to navigate back to the product listing page.
