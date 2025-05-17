import {CategoryOutputDTO, ProductInputDTO, ProductOutputDTO} from "@/types";
import {ProductNewFormCard, ProductList} from "@/features/product";
import {toast, Toaster} from "sonner";
import {AxiosError} from "axios";
import {useProductContext} from "@/context/products/useProductContext.ts";
import {useParams} from "react-router-dom";
import {CategoryBreadcrumbs, CategoryCardWithSubcategories} from "@/features/category";
import {useEffect, useState} from "react";
import {useCategoriesContext} from "@/context/CategoriesContext.ts";

const ProductListPage = () => {
    const {getProductsByCategoryId, addProduct, updateProduct, deleteProduct} = useProductContext();

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
            .then((products  ) => {
                setProducts(products)
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .catch(_e => {
                setProducts([])
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category]);

    const handleSubmitNewProduct = async (product: ProductInputDTO) => {
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

    const handleSubmitUpdatedProduct = async (product: ProductInputDTO, productId: string) => {
        return toast.promise(updateProduct(product, productId)
                .then(product => {
                    if (product) {
                        setProducts(prev => prev.map(p => p.id === productId ? product : p));
                    }
                    return product;
                }),
                {
                    loading: "Speichere Produkt...",
                    success: "Produkt erfolgreich gespeichert.",
                    error: (reason: AxiosError) => "Speichern des Produkts fehlgeschlagen: " + reason.message
                });
    }

    const handleDeleteProduct = async (productId: string) => {
        return toast.promise(deleteProduct(productId)
                .then(() => {
                    setProducts(prev => prev.filter(p => p.id !== productId));
                }),
                {
                    loading: "Lösche Produkt...",
                    success: "Produkt erfolgreich gelöscht.",
                    error: (reason: AxiosError) => "Löschen des Produkts fehlgeschlagen: " + reason.message
                });
    }

    return (
        <div className={"product-list-page p-2 flex flex-col gap-4"}>
            <h2>Produkte</h2>
            {category && <CategoryBreadcrumbs category={category} basePath={"/products/category"} rootName={"Produkte"} rootPath={"/products"}/>}
            <ProductNewFormCard onSubmit={handleSubmitNewProduct} defaultCategoryId={categoryId ?? ""}/>
            <CategoryCardWithSubcategories category={category ?? null} basePath={"/products/category"}>
                {products.length === 0 && "Keine Produkte"}
                {products.length === 1 && "Ein Produkt"}
                {products.length > 1 && products.length + " Produkte"}
            </CategoryCardWithSubcategories>
            <ProductList products={products} categoryId={category?.id ?? null} onSubmit={handleSubmitUpdatedProduct} onDelete={handleDeleteProduct}/>
            <Toaster />
        </div>
    )
}

export default ProductListPage;