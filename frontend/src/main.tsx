import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {SidebarProvider} from "@/provider/sidebar-provider.tsx";
import {OrderDetailPage, OrderListPage} from "@/features/orders";
import {ProductDetailPage, ProductListPage} from "@/features/product";
import {CategoryDetailPage, CategoryListPage} from "@/features/category";
import {UserCreatePage, UserProfilePage} from "@/features/user/pages";
import {HallDetailPage, HallEditPage, HallListPage} from "@/features/halls";
import {DashboardLayoutPage, RootLayout} from "@/layouts";
import CategoriesProductsLayout from './layouts/categories-products-layout.tsx';
import HallLayout from './layouts/hall-layout.tsx';
import Dashboard from "@/pages/dashboard.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <SidebarProvider>
            <BrowserRouter>
                <Routes>
                    {/*APP RootLayout*/}
                    <Route element={<RootLayout/>}>
                        {/*APP Entry point*/}
                        <Route element={<DashboardLayoutPage/>}>
                            <Route path={"/"} element={<Dashboard/>}/>
                        </Route>


                        {/*Relative routing for products*/}
                        <Route path={"products"}>
                            <Route index element={<ProductListPage/>}/>
                            <Route path=":id" element={<ProductDetailPage/>}/>
                        </Route>
                        {/*Relative routing for categories*/}
                        <Route path={"categories"} element={<CategoriesProductsLayout/>}>
                            <Route index element={<CategoryListPage/>}/>
                            <Route path=":id" element={<CategoryDetailPage/>}/>
                        </Route>

                        {/*Relative routing for products*/}
                        <Route path={"products"} element={<CategoriesProductsLayout/>}>
                            <Route index element={<ProductListPage/>}/>
                            <Route path=":id" element={<ProductDetailPage/>}/>
                        </Route>

                        {/*Relative routing for orders*/}
                        <Route path={"orders"}>
                            <Route index element={<OrderListPage/>}/>
                            <Route path=":id" element={<OrderDetailPage/>}/>
                        </Route>

                        {/*Relative routing for users*/}
                        <Route path={"/users"}>
                            <Route path={"user-profile"} element={<UserProfilePage/>}/>
                            <Route path={"create-user"} element={<UserCreatePage/>}/>
                            {/* rotes can be extend to
                                users:id
                                users:id/edit
                                ...*/}
                        </Route>

                        <Route path={"halls"} element={<HallLayout/>}>
                            <Route index element={<HallListPage/>}/>
                            <Route path="new" element={<HallEditPage/>}/>
                            <Route path=":id" element={<HallDetailPage/>}/>
                            <Route path=":id/edit" element={<HallEditPage/>}/>
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </SidebarProvider>
    </StrictMode>
)
