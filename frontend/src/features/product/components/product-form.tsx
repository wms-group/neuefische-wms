import {cn, selectGroupsFromCategoryOutputDTOs} from "@/utils";
import {clsx} from "clsx";
import SearchableSelect from "@/components/ui/SearchableSelect.tsx";
import {ProductInputDTO, ProductOutputDTO} from "@/types";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {useCategoriesContext} from "@/context/CategoriesContext.ts";

type ProductFormProps = {
    onSubmit: (product: ProductInputDTO) => Promise<unknown>;
    value?: ProductOutputDTO;
    defaultCategoryId: string;
    className?: string;
    setFormRef: Dispatch<SetStateAction<HTMLFormElement | null>>
}

const ProductForm = ({onSubmit, value, defaultCategoryId, className, setFormRef}: ProductFormProps) => {
    const [product, setProduct] = useState<ProductInputDTO>({
        name: value?.name ?? "",
        categoryId: value?.categoryId ?? defaultCategoryId,
        price: value?.price ?? "0,00",
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
                price: "0,00",
            });
        }
        return savedProduct;
    }

    const categories = useCategoriesContext().categories;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setProduct({...product, [name]: value});
    }

    return (
        <form
            ref={setFormRef}
            data-testid={cn(
                "product-form",
                value ? "edit" : "new"
            )}
            className={cn("flex gap-1 flex-row justify-between items-end", className)}
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
                    value={product.price}
                    placeholder="0,00"
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
    )
}

export default ProductForm;