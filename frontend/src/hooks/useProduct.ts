import {useEffect, useState} from "react";
import {ProductInputDTO, ProductOutputDTO, isProductOutputDTO} from "@/types";
import {ProductApi} from "@/features/product";

export type useProductApi = ReturnType<typeof useProduct>;

type StateProps = {
    products: ProductOutputDTO[];
    productsByCategoryId: Record<string, ProductOutputDTO[]>;
    loading: boolean;
    error: string | null;
}

export default function useProduct() {
    const [state, setState] = useState<StateProps>({
        products: [],
        productsByCategoryId: {},
        loading: false,
        error: null
    });

    function withReplaceOrAddedProducts(existingProducts: ProductOutputDTO[], products: ProductOutputDTO[]) {
        return [
            ...existingProducts.filter(p => products.find(p2 => p2.id !== p.id) === undefined),
            ...products
            ];
    }

    function setProducts(productsOrSetter: ProductOutputDTO[] | ((prev: ProductOutputDTO[]) => ProductOutputDTO[])) {
        if (Array.isArray(productsOrSetter)) {
            setState(prev => ({ ...prev, products: productsOrSetter }));
            return productsOrSetter
        }
        setState(prev => ({ ...prev, products: productsOrSetter(prev.products) }));
        return state.products;
    }

    function setError(error: string | null) {
        setState(prev => ({ ...prev, error }));
    }

    function setLoading(loading: boolean) {
        setState(prev => ({ ...prev, loading }));
    }

    useEffect(() => {
        const productsByCategory: Record<string, ProductOutputDTO[]> = {};
        state.products.forEach(p => {
            productsByCategory[p.categoryId] = productsByCategory[p.categoryId] || [];
            productsByCategory[p.categoryId].push(p);
        })
        setState(prev => ({ ...prev, productsByCategoryId: productsByCategory }));
    }, [state.products]);

    const withAddedProductAtFirst = (products: ProductOutputDTO[], product: ProductOutputDTO) => {
        return [product, ...products.filter(d => d.id !== product.id)];
    }

    const getProductsByCategoryId = (categoryId: string): Promise<ProductOutputDTO[]> => {
        if (categoryId in state.productsByCategoryId) {
            return Promise.resolve(state.productsByCategoryId[categoryId]);
        }
        setLoading(true);
        return ProductApi.getProductsByCategoryId(categoryId)
            .then(products => {
                if (products.length === 0) {
                    setState(prev => ({...prev, productsByCategoryId: {...prev.productsByCategoryId, [categoryId]: []}}));
                    return Promise.resolve([]);
                }
                setProducts(prev => withReplaceOrAddedProducts(prev, products));
                return products
            })
            .catch(e => {
                setError(e.message);
                throw e;
            })
            .finally(() => setLoading(false));
    }

    const addProduct = (newProduct: ProductInputDTO) => {
        setLoading(true);
        setError(null);
        return ProductApi.saveProduct(newProduct)
            .then((savedProduct) => {
                if (savedProduct && isProductOutputDTO(savedProduct)) {
                    setProducts(prev => withAddedProductAtFirst(prev, savedProduct));
                    return savedProduct;
                }
                setError("Ungültige Antwort beim Speichern des Gerichts")
                throw new TypeError("Ungültige Antwort beim Speichern des Gerichts");
            })
            .catch(e => {
                setError(e.message);
                throw e;
            })
            .finally(() => setLoading(false));
    }

    return {
        products: state.products,
        getProductsByCategoryId,
        loading: state.loading,
        error: state.error,
        addProduct,
    };
}