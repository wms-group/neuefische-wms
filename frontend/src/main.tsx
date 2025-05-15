import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import RootLayout from "@/layouts/root-layout.tsx";
import {OrderDetailPage, OrderListPage} from "@/features/orders";
import {ProductDetailPage, ProductListPage} from "@/features/product";
import {CategoryDetailPage, CategoryListPage} from "@/features/category";
import {CategoriesProvider} from "../context/CategoriesProvider.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <CategoriesProvider>
        <BrowserRouter >
            <Routes>
                {/*APP RootLayout*/}
                <Route element={<RootLayout />}>
                    {/*APP Entry point*/}
                    <Route path={"/"} element={<App/>} />

                    {/*Relative routing for categories*/}
                    <Route path={"categories"}>
                        <Route index element={<CategoryListPage />} />
                        <Route path=":id" element={<CategoryDetailPage />} />
                    </Route>

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

                </Route>
            </Routes>
        </BrowserRouter>
      </CategoriesProvider>
  </StrictMode>,
)
