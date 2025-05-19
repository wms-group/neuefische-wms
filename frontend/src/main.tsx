import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {SidebarProvider} from "@/provider/sidebar-provider.tsx";
import {OrderDetailPage, OrderListPage} from "@/features/orders";
import {ProductListPage} from "@/features/product";
import {CategoryListPage} from "@/features/category";
import {UserCreatePage, UserProfilePage} from "@/features/user/pages";
import {HallListPage, HallDetailPage, HallEditPage} from "@/features/halls";
import {RootLayout} from "@/layouts";
import CategoriesProductsLayout from './layouts/categories-products-layout.tsx';
import HallLayout from './layouts/hall-layout.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <SidebarProvider>
                <BrowserRouter>
                    <Routes>
                        {/*APP RootLayout*/}
                        <Route element={<RootLayout/>}>
                            {/*APP Entry point*/}
                            <Route path={"/"} element={<App/>}/>

                            {/*Relative routing for categories*/}
                            <Route path={"categories"} element={<CategoriesProductsLayout/>}>
                                <Route index element={<CategoryListPage/>}/>
                                <Route path=":categoryId" element={<CategoryListPage/>}/>
                            </Route>

                            {/*Relative routing for products*/}
                            <Route path={"products"} element={<CategoriesProductsLayout/>}>
                                <Route index element={<ProductListPage/>}/>
                                <Route path="category/:categoryId" element={<ProductListPage/>}/>
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

                            <Route path={"halls"} element={<HallLayout />}>
                                <Route index element={<HallListPage />} />
                                <Route path="new" element={<HallEditPage />} />
                                <Route path=":id" element={<HallDetailPage />} />
                                <Route path=":id/edit" element={<HallEditPage />} />
                        </Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
        </SidebarProvider>
    </StrictMode>
)
