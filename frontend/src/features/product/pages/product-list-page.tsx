import LayoutContainer from "@/components/shared/layout-container.tsx";
import {useProductContext} from "@/context/products/useProductContext.ts";
import {useEffect, useState} from "react";
import {CategoryOutputDTO, ProductInputDTO, ProductOutputDTO} from "@/types";
import {useCategoriesContext} from "@/context/CategoriesContext.ts";
import {useParams} from "react-router-dom";
import {toast} from "sonner";
import {AxiosError} from "axios";
import {CategoryBreadcrumbs, CategoryCardWithSubcategories} from "@/features/category";
import {ProductForm, ProductList} from "@/features/product";
import GridLayout from "@/components/shared/grid-layout.tsx";

const ProductListPage = () => {
    const {getProductsByCategoryId, addProduct} = useProductContext();

    const categoryId = useParams().categoryId;

    const [category, setCategory] = useState<CategoryOutputDTO | undefined>(undefined);
    const [products, setProducts] = useState<ProductOutputDTO[]>([]);

    const {categories} = useCategoriesContext();

    useEffect(() => {
        if (categoryId) {
            setCategory(categories.find(c => c.id === categoryId))
        } else {
            setCategory(undefined);
            setProducts([]);
        }
    }, [categoryId, categories])

    useEffect(() => {
        if (!category) {
            return
        }
        getProductsByCategoryId(category.id)
            .then((products) => {
                setProducts(products)
            })

            .catch(() => {
                setProducts([])
            })
    }, [category, getProductsByCategoryId]);

    const handleSubmitProduct = async (product: ProductInputDTO) => {
        return toast.promise(addProduct(product)
                .then(product => {
                    if (product) {
                        setProducts(prev => [product, ...prev]);
                    }
                    return product;
                }),
            {
                loading: "Speichere Produkt...",
                success: "Produkt erfolgreich gespeichert.",
                error: (reason: AxiosError) => "Speichern des Produkts fehlgeschlagen: " + reason.message
            });
    }

    return (
        <LayoutContainer className={"product-list-page p-2 flex flex-col gap-4"}>
            <h2>Produkte</h2>
            {category && <CategoryBreadcrumbs category={category} basePath={"/products/category"} rootName={"Produkte"}
                                              rootPath={"/products"}/>}
            <ProductForm onSubmit={handleSubmitProduct} defaultCategoryId={categoryId ?? ""}/>
            <GridLayout gridCols={{base: 1, sm: 2, xl: 3}}>
                <CategoryCardWithSubcategories category={category ?? null} basePath={"/products/category"}>
                    {products.length === 0 && "Keine Produkte"}
                    {products.length === 1 && "Ein Produkt"}
                    {products.length > 1 && products.length + " Produkte"}
                </CategoryCardWithSubcategories>
            </GridLayout>
            <GridLayout gridCols={{base: 1, sm: 2, xl: 3}}>
                <ProductList
                    products={products}
                    categoryId={category?.id ?? null}
                    className={"product-list"}

                />
            </GridLayout>
        </LayoutContainer>
    )
}

export default ProductListPage;