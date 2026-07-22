import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import CreateProduct from "../features/products/Pages/CreateProduct";
import SellerProductList from "../features/products/Pages/SellerProductList";
import Protected from "./Protected";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Protected>
                <h1>Radhe Radhe</h1>
            </Protected>
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
    }
])