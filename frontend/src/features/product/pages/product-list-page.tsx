import {CategoryOutputDTO, ProductInputDTO, ProductOutputDTO} from "@/types";
import {ProductList, ProductNewFormCard} from "@/features/product";
import {toast} from "sonner";
import {AxiosError} from "axios";
import {useProductContext} from "@/context/products/useProductContext.ts";
import {useEffect, useState} from "react";
import {useCategoriesContext} from "@/context/CategoriesContext.ts";
import {useParams} from "react-router-dom";
import {CategoryBreadcrumbs, CategoryCardWithSubcategories} from "@/features/category";
import GridLayout from "@/components/shared/grid-layout.tsx";
import LayoutContainer from "@/components/shared/layout-container.tsx";

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
            .then((products) => {
                setProducts(products)
            })

            .catch(() => {
                setProducts([])
            })
    }, [category, getProductsByCategoryId]);

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

    function withUpdatedProduct(products: ProductOutputDTO[], product: ProductOutputDTO) {
        return products.map(p => p.id === product.id ? product : p);
    }

    const handleSubmitUpdatedProduct = async (product: ProductInputDTO, productId: string) => {
        return toast.promise(updateProduct(product, productId)
                .then(product => {
                    if (product) {
                        setProducts(prev => withUpdatedProduct(prev, product));
                    }
                    return product;
                }),
            {
                loading: "Speichere Produkt...",
                success: "Produkt erfolgreich gespeichert.",
                error: (reason: AxiosError) => "Speichern des Produkts fehlgeschlagen: " + reason.message
            });
    }

    function withRemovedProduct(products: ProductOutputDTO[], productId: string) {
        return products.filter(p => p.id !== productId);
    }

    const handleDeleteProduct = async (productId: string) => {
        return toast.promise(deleteProduct(productId)
                .then(() => {
                    setProducts(prev => withRemovedProduct(prev, productId));
                }),
            {
                loading: "Lösche Produkt...",
                success: "Produkt erfolgreich gelöscht.",
                error: (reason: AxiosError) => "Löschen des Produkts fehlgeschlagen: " + reason.message
            });
    }

    return (
        <LayoutContainer className={"product-list-page p-2 flex flex-col gap-4"}>
            <h2>Produkte</h2>
            {category && <CategoryBreadcrumbs category={category} basePath={"/products/category"} rootName={"Produkte"}
                                              rootPath={"/products"}/>}
            <ProductNewFormCard onSubmit={handleSubmitNewProduct} defaultCategoryId={categoryId ?? ""}/>
            <GridLayout gridCols={{base: 1, sm: 2, xl: 3}}>
                <CategoryCardWithSubcategories category={category ?? null} basePath={"/products/category"}>
                    {products.length === 0 && "Keine Produkte"}
                    {products.length === 1 && "Ein Produkt"}
                    {products.length > 1 && products.length + " Produkte"}
                </CategoryCardWithSubcategories>
            </GridLayout>
            <GridLayout gridCols={{base: 1, sm: 2, xl: 3}}>
                <ProductList products={products} categoryId={category?.id ?? null} onSubmit={handleSubmitUpdatedProduct}
                             onDelete={handleDeleteProduct}/>
            </GridLayout>
        </LayoutContainer>
    )
}

export default ProductListPage;