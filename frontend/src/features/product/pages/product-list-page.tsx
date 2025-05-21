import {CategoryInputDTO, CategoryOutputDTO, ProductInputDTO, ProductOutputDTO} from "@/types";
import {ProductList, ProductNewFormCard} from "@/features/product";
import {toast} from "sonner";
import {AxiosError} from "axios";
import {useProductContext} from "@/context/products/useProductContext.ts";
import {useEffect, useState} from "react";
import {useCategoriesContext} from "@/context/CategoriesContext.ts";
import {useParams} from "react-router-dom";
import {
    CategoryBreadcrumbs,
    CategoryCardWithSubcategories, CategoryLinksSkeleton,
    CategoryList,
    CategoryNewFormCard
} from "@/features/category";
import GridLayout from "@/components/shared/grid-layout.tsx";
import LayoutContainer from "@/components/shared/layout-container.tsx";

const ProductListPage = () => {
    const {getProductsByCategoryId, addProduct, updateProduct, deleteProduct, flushProducts, loading: productsLoading} = useProductContext();

    const categoryId = useParams().categoryId;

    const [category, setCategory] = useState<CategoryOutputDTO | undefined>(undefined);
    const [products, setProducts] = useState<ProductOutputDTO[]>([]);

    const {categories, addCategory, updateCategory, deleteCategory, flushCategories, loading: categoriesLoading} = useCategoriesContext();

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

    const handleSubmitNewCategory = async (category: CategoryInputDTO) => {
        return toast.promise(addCategory(category),
            {
                loading: "Speichere Kategorie...",
                success: "Kategorie erfolgreich gespeichert.",
                error: (reason: AxiosError) => "Speichern der Kategorie fehlgeschlagen: " + reason.message
            });
    }

    const handleSubmitUpdatedCategory = async (category: CategoryInputDTO, categoryId: string) => {
        return toast.promise(updateCategory(category, categoryId),
            {
                loading: "Speichere Kategorie...",
                success: "Kategorie erfolgreich gespeichert.",
                error: (reason: AxiosError) => "Speichern der Kategorie fehlgeschlagen: " + reason.message
            });
    }

    const handleDeleteCategory = async (categoryId: string, moveToCategory?: string) => {
        return toast.promise(deleteCategory(categoryId, moveToCategory)
                .then(() => {
                    flushCategories();
                    flushProducts();
                }),
            {
                loading: "Lösche Kategorie...",
                success: "Kategorie erfolgreich gelöscht.",
                error: (reason: AxiosError) => "Löschen der Kategorie fehlgeschlagen: " + reason.message
            });
    }
    useEffect(() => {
        setCategory(categories.find(c => c.id === categoryId))
    }, [categoryId, categories])

    return (
        <LayoutContainer className={"product-list-page p-2 flex flex-col gap-4"}>
            <h2>Produkte</h2>
            {categoryId && (category ? <CategoryBreadcrumbs category={category} basePath={"/products/category"} rootName={"Produkte"}
                                              rootPath={"/products"}/> : <CategoryLinksSkeleton count={3} className={"h-5"}/>)}
            <GridLayout gridCols={{base: 1, "2xl": 2}}>
                <CategoryCardWithSubcategories category={category ?? null} basePath={"/products/category"}>
                    {categoryId && <>{products.length === 0 && "Keine Produkte"}
                    {products.length === 1 && "Ein Produkt"}
                    {products.length > 1 && products.length + " Produkte"}</>}
                </CategoryCardWithSubcategories>
            </GridLayout>
            <GridLayout gridCols={{ base: 1, xl: 3 }}>
                <CategoryNewFormCard onSubmit={handleSubmitNewCategory} disabled={categoriesLoading} defaultParentId={categoryId ?? null}/>
                <CategoryList
                    parentId={category?.id ?? null}
                    basePath="/products/category"
                    onSubmit={handleSubmitUpdatedCategory}
                    onDelete={handleDeleteCategory}/>
            </GridLayout>
            {categoryId && <GridLayout gridCols={{base: 1, xl: 3}}>
                <ProductNewFormCard onSubmit={handleSubmitNewProduct} disabled={productsLoading}
                                    defaultCategoryId={categoryId ?? ""}/>
                <ProductList
                    products={products} categoryId={category?.id ?? null}
                    onSubmit={handleSubmitUpdatedProduct}
                    onDelete={handleDeleteProduct}
                />
            </GridLayout>}
        </LayoutContainer>
    )
}

export default ProductListPage;