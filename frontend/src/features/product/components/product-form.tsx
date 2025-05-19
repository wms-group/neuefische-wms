import {ProductInputDTO} from "@/types";
import {useEffect, useRef, useState} from "react";
import {cn, selectGroupsFromCategoryOutputDTOs} from "@/utils";
import {clsx} from "clsx";
import Card from "@/components/shared/card.tsx";
import SearchableSelect from "@/components/ui/SearchableSelect.tsx";
import {useCategoriesContext} from "@/context/CategoriesContext.ts";
import Button from "@/components/ui/button";

type ProductFormProps = {
    onSubmit: (product: ProductInputDTO) => Promise<unknown>;
    defaultCategoryId: string;
    className?: string;
}

export default function ProductForm({ onSubmit, className, defaultCategoryId }: Readonly<ProductFormProps>) {
    const [product, setProduct] = useState<ProductInputDTO>({
        name: "",
        categoryId: defaultCategoryId,
        price: "",
    });

    useEffect(() => {
        setProduct(prev => { return {...prev, categoryId: defaultCategoryId}});
    }, [defaultCategoryId]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSubmit(product);
        setProduct({
            name: "",
            categoryId: defaultCategoryId,
            price: "",
        });
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setProduct({...product, [name]: value});
    }

    const formRef = useRef<HTMLFormElement>(null);

    const {categories, loading} = useCategoriesContext();

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
                    formRef.current = ref
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
                            value={product.price}
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