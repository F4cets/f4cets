// f4cets/routes/page.routes.js
const routes = [
    {
      path: "/presentation",
      name: "Home",
      component: "presentation",
    },
    {
      path: "/marketplace",
      name: "Marketplace",
      component: "marketplace",
    },
    {
      path: "/affiliate",
      name: "Affiliates",
      component: "affiliate",
    },
    {
      path: "/sellers/:storeId",
      name: "Seller Store",
      component: "ecommerce",
      invisible: true, // Hidden from navigation
    },
    {
      path: "/products/:itemId",
      name: "Product",
      component: "product",
      invisible: true, // Hidden from navigation
    },
    {
      path: "/shopping-cart",
      name: "Cart",
      component: "shopping-cart",
      invisible: true, // Hidden from navigation
    },
  ];
  
  export default routes;