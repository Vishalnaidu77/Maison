import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import CreateProduct from "../features/products/Pages/CreateProduct";
import SellerProductList from "../features/products/Pages/SellerProductList";
import Protected from "./Protected";
import Home from "../features/products/Pages/Home";
import ProductDetails from "../features/products/Pages/ProductDetails";
import EditProduct from "../features/products/Pages/EditProduct";
import Cart from "../features/cart/pages/Cart";
import SellerUsers from "../features/products/Pages/SellerUsers";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/seller/dashboard/add-product",
        element: <Protected role="seller">
            <CreateProduct />
            </Protected>
    },
    {
        path: "/seller/dashboard/products",
        element: <Protected role="seller">
                <SellerProductList />
            </Protected>
    },
    {
        path: "/seller/dashboard/users",
        element: <Protected role="seller">
                <SellerUsers />
            </Protected>
    },
    {
        path: "product/:productId",
        element: <ProductDetails />
    },
    {
        path: "seller/dashboard/product/:productId",
        element: <Protected role="seller">
            <EditProduct />
        </Protected>
    },
    {
        path: "/cart",
        element: <Cart />
    }
])