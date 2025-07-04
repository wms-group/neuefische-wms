import {useEffect, useState} from "react";
import {isProductOutputDTO, ProductInputDTO, ProductOutputDTO} from "@/types";
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
        loading: true,
        error: null
    });

    let loadCounter = 0;

    function increaseCounterAndSetLoading() {
        loadCounter++;
        setLoading(loadCounter > 0);
    }

    function decreaseCounterAndSetLoading() {
        loadCounter--;
        setLoading(loadCounter > 0);
    }

    function withReplaceOrAddedProductsSorted(existingProducts: ProductOutputDTO[], products: ProductOutputDTO[]) {
        return [
            ...existingProducts.filter(p => products.find(p2 => p2.id !== p.id) === undefined),
            ...products
            ]
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    function withReplacedProductSorted(existingProducts: ProductOutputDTO[], product: ProductOutputDTO) {
        return existingProducts.map(p => p.id === product.id ? product : p)
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    function withRemovedProduct(existingProducts: ProductOutputDTO[], productId: string) {
        return existingProducts.filter(p => p.id !== productId);
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

    const getProductsByCategoryId = async (categoryId: string): Promise<ProductOutputDTO[]> => {
        if (categoryId in state.productsByCategoryId) {
            return Promise.resolve(state.productsByCategoryId[categoryId]);
        }
        increaseCounterAndSetLoading();
        return ProductApi.getProductsByCategoryId(categoryId)
            .then(products => {
                if (products.length === 0) {
                    setState(prev => ({...prev, productsByCategoryId: {...prev.productsByCategoryId, [categoryId]: []}}));
                    return Promise.resolve([]);
                }
                setProducts(prev => withReplaceOrAddedProductsSorted(prev, products));
                return products
            })
            .catch(e => {
                setError(e.message);
                throw e;
            })
            .finally(() => decreaseCounterAndSetLoading());
    }

    const addProduct = async(newProduct: ProductInputDTO) => {
        increaseCounterAndSetLoading();
        setError(null);
        return ProductApi.saveProduct(newProduct)
            .then((savedProduct) => {
                if (savedProduct && isProductOutputDTO(savedProduct)) {
                    setProducts(prev => withAddedProductAtFirst(prev, savedProduct));
                    return savedProduct;
                }
                setError("Ungültige Antwort beim Speichern des Produktes")
                throw new TypeError("Ungültige Antwort beim Speichern des Produktes");
            })
            .catch(e => {
                setError(e.message);
                throw e;
            })
            .finally(() => decreaseCounterAndSetLoading());
    }

    const updateProduct = async (changedProduct: ProductInputDTO, productId: string) => {
        increaseCounterAndSetLoading();
        setError(null);
        return ProductApi.updateProduct(changedProduct, productId)
            .then((updatedProduct) => {
                if (updatedProduct && isProductOutputDTO(updatedProduct)) {
                    setProducts(prev => withReplacedProductSorted(prev, updatedProduct));
                    return updatedProduct;
                }
                setError("Ungültige Antwort beim Speichern des Produktes")
                throw new TypeError("Ungültige Antwort beim Speichern des Produktes");
            })
            .catch(e => {
                setError(e.message);
                throw e;
            })
            .finally(() => decreaseCounterAndSetLoading());
    }

    const deleteProduct = async (productId: string) => {
        increaseCounterAndSetLoading();
        setError(null);
        return ProductApi.deleteProduct(productId)
            .then(() => {
                setProducts(prev => withRemovedProduct(prev, productId));
            })
            .catch(e => {
                setError(e.message);
                throw e;
            })
            .finally(() => decreaseCounterAndSetLoading());
    }

    const flushProducts = () => {
        setProducts([]);
    }

    const getProducts = async (): Promise<ProductOutputDTO[] | undefined> => {
        increaseCounterAndSetLoading();
        setError(null);
        try {
            const products = await ProductApi.getAllProducts();
            setProducts(products);
            return products;
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message);
            }
            return undefined;
        } finally {
            decreaseCounterAndSetLoading();
        }
    };


    return {
        products: state.products,
        getProductsByCategoryId,
        loading: state.loading,
        error: state.error,
        addProduct,
        updateProduct,
        deleteProduct,
        flushProducts,
        getProducts
    };
}