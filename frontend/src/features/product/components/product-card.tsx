import {ProductInputDTO, ProductOutputDTO} from "@/types";
import Card from "@/components/shared/card.tsx";
import {cn} from "@/utils";
import Button from "@/components/ui/button.tsx";
import {ProductForm} from "@/features/product";
import {useRef, useState} from "react";

type ProductCardProps = {
    product: ProductOutputDTO;
    className?: string;
    onDelete?: (productId: string) => Promise<unknown>;
    onSubmit?: (submittedProduct: ProductInputDTO, productId: string) => Promise<unknown>;
}

const ProductCard = ({product, onDelete, onSubmit, className}: ProductCardProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const formRef = useRef<HTMLFormElement>(null);

    const handleDelete = () => {
        if (!onDelete) return Promise.resolve();
        setIsEditing(false);
        return onDelete(product.id);
    }

    const handleEdit = () => {
        setIsEditing(!isEditing);
    }

    const handleSubmitClicked = () => {
        if (!formRef.current) return;
        formRef.current.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }

    const handleSubmit = (submittedProduct: ProductInputDTO): Promise<unknown> => {
        if (!onSubmit) return Promise.resolve();
        return onSubmit(submittedProduct, product.id)
            .then(() => {
                setIsEditing(false);
            })
    }

    const ProductActions = ()=> (
        <>
            <>{onSubmit && <EditOrSubmitButton />}</>
            <>{isEditing && <Button onClick={handleEdit}>Abbrechen</Button>}</>
            <>{onDelete && <Button onClick={handleDelete} className={cn("bg-red-300 text-white/90")}>Löschen</Button>}</>
        </>
    )

    const EditOrSubmitButton = () => (
        isEditing ?
            (<Button onClick={handleSubmitClicked}>Speichern</Button>) :
            (<Button onClick={handleEdit}>Bearbeiten</Button>)
    )


    const ProductEdit = () => (
        <ProductForm defaultCategoryId={product.categoryId} onSubmit={handleSubmit} value={product} formRef={formRef}></ProductForm>
    )

    const ProductContent = () => (
        <div>{product.price}</div>
    )

    return (
        <Card title={product.name} actions={<ProductActions />} className={cn(className, "max-w-2xl")}>
            {isEditing ? <ProductEdit /> : <ProductContent />}
        </Card>
    )
}

export default ProductCard;