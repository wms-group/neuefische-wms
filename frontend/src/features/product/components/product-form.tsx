import {cn, selectGroupsFromCategoryOutputDTOs} from "@/utils";
import {ProductInputDTO, ProductOutputDTO} from "@/types";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {InputWithLabel, SearchableSelect} from "@/components/ui";
import {useCategoriesContext} from "@/context/CategoriesContext.ts";

type ProductFormProps = {
    onSubmit: (product: ProductInputDTO) => Promise<unknown>;
    value?: ProductOutputDTO;
    disabled?: boolean;
    defaultCategoryId: string;
    className?: string;
    setFormRef: Dispatch<SetStateAction<HTMLFormElement | null>>
}

const ProductForm = ({onSubmit, value, disabled, defaultCategoryId, className, setFormRef}: ProductFormProps) => {
    const [product, setProduct] = useState<ProductInputDTO>({
        name: value?.name ?? "",
        categoryId: value?.categoryId ?? defaultCategoryId,
        price: value?.price ?? "",
    });

    const categories = useCategoriesContext().categories;

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
            className={cn("flex gap-2 flex-wrap flex-row justify-stretch items-end", className, disabled && "opacity-50 cursor-not-allowed")}
            onSubmit={handleSubmit}>
            <InputWithLabel
                label="Name"
                value={product.name}
                onChange={handleChange}
                onBlur={handleChange}
                name="name"
                fieldClassName="w-full grow-1 sm:w-fit sm:grow basis-80"
                className="bg-white/95"
                disabled={disabled}
            />
            <InputWithLabel
                name="price"
                label="Preis"
                value={product.price}
                placeholder="0,00"
                disabled={disabled}
                onChange={handleChange}
                fieldClassName="w-full w-fit grow sm:shrink-1 h-full basis-1"
                className="bg-white/95"
                onBlur={handleChange}
                />
            {value && <div className="h-full grow-1 basis-40 w-full">
                <label htmlFor="categoryId" className={"text-sm/6 font-medium text-gray"}>Kategorie</label>
                <SearchableSelect
                    name="categoryId"
                    options={selectGroupsFromCategoryOutputDTOs(categories)}
                    onChange={(newValue) => handleChange({
                        target: {
                            name: 'categoryId',
                            value: newValue?.value
                        }
                    } as unknown as React.ChangeEvent<HTMLInputElement>)}
                    mandatory={true}
                    value={product.categoryId}
                    defaultValue={defaultCategoryId}/>
            </div>}
        </form>
    )
}

export default ProductForm;