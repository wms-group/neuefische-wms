import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import RootLayout from "@/layouts/root-layout.tsx";
import {OrderDetailPage, OrderListPage} from "@/features/orders";
import {ProductDetailPage, ProductListPage} from "@/features/product";
import UserProfilePage from "@/features/user/pages/user-profile-page.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter >
        <Routes>
            {/*APP RootLayout*/}
            <Route element={<RootLayout />}>
                {/*APP Entry point*/}
                <Route path={"/"} element={<App/>} />

                {/*Relative routing for products*/}
                <Route path={"products"}>
                    <Route index element={<ProductListPage />} />
                    <Route path=":id" element={<ProductDetailPage />} />
                </Route>

                {/*Relative routing for orders*/}
                <Route path={"orders"}>
                    <Route index element={<OrderListPage />} />
                    <Route path=":id" element={<OrderDetailPage />} />
                </Route>

                {/*Relative routing for user*/}
                <Route path={"user-profile"} element={<UserProfilePage />} />

            </Route>
        </Routes>
    </BrowserRouter>
  </StrictMode>,
)
