import {cn, selectGroupsFromCategoryOutputDTOs} from "@/utils";
import {clsx} from "clsx";
import SearchableSelect from "@/components/ui/SearchableSelect.tsx";
import {ProductInputDTO, ProductOutputDTO} from "@/types";
import {useEffect, useState} from "react";
import {useCategoriesContext} from "@/context/CategoriesContext.ts";
import Button from "@/components/ui/button";
import Card from "@/components/shared/card.tsx";

type ProductFormProps = {
    onSubmit: (product: ProductInputDTO) => Promise<unknown>;
    value?: ProductOutputDTO;
    defaultCategoryId: string;
    className?: string;
    formRef?: React.RefObject<HTMLFormElement | null>;
}

const ProductForm = ({onSubmit, value, defaultCategoryId, className, formRef}: ProductFormProps) => {
    const [product, setProduct] = useState<ProductInputDTO>({
        name: value?.name ?? "",
        categoryId: value?.categoryId ?? defaultCategoryId,
        price: value?.price ?? "",
    });

    useEffect(() => {
        setProduct(prev => { return {...prev, categoryId: defaultCategoryId}});
    }, [defaultCategoryId]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const savedProduct = await onSubmit(product);
        if (!value) {
            setProduct({
                name: "",
                categoryId: defaultCategoryId,
                price: "",
            });
        }
        return savedProduct;
    }

    const categories = useCategoriesContext().categories;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setProduct({...product, [name]: value});
    }

    const {loading} = useCategoriesContext();

    return (
        <Card
            title={"Neues Produkt"}
            className={cn(className, "max-w-2xl")}
            actions={<Button onClick={() => formRef.current?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))}>
                hinzufügen
            </Button>}
        >
        <form
            ref={(ref) => {
                if (formRef) {
                    formRef.current = ref
                }
            }}
            className={cn("flex gap-1 flex-row justify-between items-endopacity-100 transition-opacity duration-200", className)} style={{ opacity: loading ? 0.5 : 1 }}
            onSubmit={handleSubmit}>
            <div className="h-full grow flex-basis-40">
                <label htmlFor="name" className={cn("text-sm/6 font-medium text-gray")}>Name</label>
                <input
                    name="name"
                    value={product.name}
                    className={cn(
                        'block w-full rounded border-none bg-white/95 px-3 py-1.5 text-gray-900',
                        'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-gray-900'
                    )}
                    onChange={handleChange}
                />
            </div>
            <div className="h-full grow flex-basis-20 max-w-32">
                <label htmlFor="price" className={cn("text-sm/6 font-medium text-gray")}>Preis</label>
                <input
                    name="price"
                    value={parseFloat(product.price.replace(",", ".")).toFixed(2)}
                    type="number"
                    step="0.01"
                    min="0"
                    max="1000000"
                    placeholder="0.00"
                    className={cn(
                        'block w-full rounded border-none bg-white/95 px-3 py-1.5 text-gray-900',
                        'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-gray-900'
                    )}
                    onChange={handleChange}
                />
            </div>
            <div className="h-full grow flex-basis-60">
                <label htmlFor="categoryId" className={clsx("text-sm/6 font-medium text-gray")}>Kategorie</label>
                <SearchableSelect
                    name="categoryId"
                    options={selectGroupsFromCategoryOutputDTOs(categories)}
                    onChange={(newValue) => handleChange({target: {name: 'categoryId', value: newValue?.value}} as unknown as React.ChangeEvent<HTMLInputElement>)}
                    mandatory={true}
                    value={product.categoryId}
                    defaultValue={defaultCategoryId}/>
            </div>
        </form>
        </Card>
    )
}

export default ProductForm;