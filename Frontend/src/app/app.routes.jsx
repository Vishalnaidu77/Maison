import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import CreateProduct from "../features/products/Pages/CreateProduct";
import SellerProductList from "../features/products/Pages/SellerProductList";
import Protected from "./Protected";
import Home from "../features/products/Pages/Home";
import ProductDetails from "../features/products/Pages/ProductDetails";

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
        path: "product/:productId",
        element: <ProductDetails />
    }
])