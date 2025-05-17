import {ProductInputDTO} from "@/types";
import {useEffect, useRef, useState} from "react";
import {cn, selectGroupsFromCategoryOutputDTOs} from "@/utils";
import {clsx} from "clsx";
import Card from "@/components/shared/card.tsx";
import SearchableSelect from "@/components/ui/SearchableSelect.tsx";
import {useCategoriesContext} from "@/context/CategoriesContext.ts";

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

    const categories = useCategoriesContext().categories;

    return (
        <Card
            title={"Neues Produkt"}
            className={cn(className, "max-w-2xl")}
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            actions={<button type="button" onClick={_e => formRef.current?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))} className="rounded w-fit h-fit bg-gray-600 px-4 py-2 text-sm text-white data-hover:bg-gray-500 data-hover:data-active:bg-gray-700">
                hinzufügen
            </button>}
        >
            <form
                ref={(ref) => {
                    formRef.current = ref
                }}
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