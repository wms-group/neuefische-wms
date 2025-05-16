import {CategoryOutputDTO, ProductInputDTO, ProductOutputDTO} from "@/types";
import {ProductForm, ProductList} from "@/features/product";
import {toast, Toaster} from "sonner";
import {AxiosError} from "axios";
import {useProductContext} from "@/context/products/useProductContext.ts";
import {useParams} from "react-router-dom";
import {CategoryBreadcrumbs, CategoryCardWithSubcategories} from "@/features/category";
import {useEffect, useState} from "react";
import {useCategoriesContext} from "@/context/CategoriesContext.ts";

const ProductListPage = () => {
    const {getProductsByCategoryId, addProduct} = useProductContext();

    const categoryId = useParams().categoryId;

    const [category, setCategory] = useState<CategoryOutputDTO | undefined>(undefined);
    const [products, setProducts] = useState<ProductOutputDTO[]>([]);

    const {categories} = useCategoriesContext();

    useEffect(() => {
        if (categoryId) {
            setCategory(categories.find(c => c.id === categoryId))
            getProductsByCategoryId(categoryId)
                .then(setProducts)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .catch(_e => {
                    setProducts([])
            })
        } else {
            setCategory(undefined);
            setProducts([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryId, categories])

    const handleSubmitProduct = async (product: ProductInputDTO) => {
        return toast.promise(addProduct(product),
            {
                loading: "Speichere Kategorie...",
                success: "Kategorie erfolgreich gespeichert.",
                error: (reason: AxiosError) => "Speichern der Kategorie fehlgeschlagen: " + reason.message
            });
    }

    return (
        <div className={"product-list-page p-2 flex flex-col gap-4"}>
            <h2>Produkte</h2>
            {category && <CategoryBreadcrumbs category={category} basePath={"/products/category"} rootName={"Produkte"} rootPath={"/products"}/>}
            <ProductForm onSubmit={handleSubmitProduct} defaultCategoryId={categoryId ?? ""}/>
            <CategoryCardWithSubcategories category={category ?? null} basePath={"/products/category"}>
                {products.length === 0 ? "Keine Produkte" : products.length + " Produkt" + (products.length > 1 ? "e" : "")}
            </CategoryCardWithSubcategories>
            <ProductList products={products} categoryId={category?.id ?? null} />
            <Toaster />
        </div>
    )
}

export default ProductListPage;