import LayoutContainer from "@/components/shared/layout-container.tsx";

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
            .then((products  ) => {
                setProducts(products)
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .catch(_e => {
                setProducts([])
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category]);

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
        <div className={"product-list-page p-2 flex flex-col gap-4"}>
            <h2>Produkte</h2>
            {category && <CategoryBreadcrumbs category={category} basePath={"/products/category"} rootName={"Produkte"} rootPath={"/products"}/>}
            <ProductForm onSubmit={handleSubmitProduct} defaultCategoryId={categoryId ?? ""}/>
            <CategoryCardWithSubcategories category={category ?? null} basePath={"/products/category"}>
                {products.length === 0 && "Keine Produkte"}
                {products.length === 1 && "Ein Produkt"}
                {products.length > 1 && products.length + " Produkte"}
            </CategoryCardWithSubcategories>
            <ProductList products={products} categoryId={category?.id ?? null} />
            <Toaster />
        </div>
    )
}

export default ProductListPage;