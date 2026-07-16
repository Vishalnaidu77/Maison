import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import CreateProduct from "../features/products/Pages/CreateProduct";
import SellerProductList from "../features/products/Pages/SellerProductList";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <h1>Radhe Radhe</h1>
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
        path: "/seller/products/create",
        element: <CreateProduct />
    },
    {
        path: "/seller/products",
        element: <SellerProductList />
    }
])