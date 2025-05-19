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

type ProductActionsProps = {
    isEditing: boolean;
    onDelete?: () => void;
    onSubmit?: () => void;
    handleEdit: () => void;
    handleDelete: () => void;
    handleSubmitClicked: () => void;
}

const ProductActions = ({isEditing, onDelete, onSubmit, handleEdit, handleDelete, handleSubmitClicked}: ProductActionsProps) => (
    <>
        <>{onSubmit && <EditOrSubmitButton isEditing={isEditing} handleEdit={handleEdit} handleSubmitClicked={handleSubmitClicked} />}</>
        <>{isEditing && <Button onClick={handleEdit}>Abbrechen</Button>}</>
        <>{onDelete && <Button onClick={handleDelete} className={cn("bg-red-300 text-white/90")}>Löschen</Button>}</>
    </>
);

type EditOrSubmitButtonProps = {
    isEditing: boolean;
    handleEdit: () => void;
    handleSubmitClicked: () => void;
}

const EditOrSubmitButton = ({isEditing, handleEdit, handleSubmitClicked}: EditOrSubmitButtonProps) => (
    isEditing ?
        (<Button onClick={handleSubmitClicked}>Speichern</Button>) :
        (<Button onClick={handleEdit}>Bearbeiten</Button>)
);

type ProductEditProps = {
    product: ProductOutputDTO;
    onSubmit: (product: ProductInputDTO) => Promise<unknown>;
    formRef?: React.RefObject<HTMLFormElement>;
}

const ProductEdit = ({product, onSubmit, formRef}: ProductEditProps) => (
    <ProductForm defaultCategoryId={product.categoryId} onSubmit={onSubmit} value={product} {...{formRef}} />
);

type ProductContentProps = {
    product: ProductOutputDTO;
}

const ProductContent = ({product}: ProductContentProps) => (
    <div>
        <div>Preis: {product.price}</div>
    </div>
);

const ProductCard = ({product, onDelete, onSubmit, className}: ProductCardProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const handleDelete = () => {
        if (!onDelete) return;
        setIsEditing(false);
        return onDelete(product.id);
    };

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleSubmitClicked = () => {
        if (!formRef.current) return;
        formRef.current.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    };

    const handleSubmit = (submittedProduct: ProductInputDTO): Promise<unknown> => {
        if (!onSubmit) return Promise.resolve();
        return onSubmit(submittedProduct, product.id)
            .then(() => {
                setIsEditing(false);
            });
    };

    return (
        <Card
            title={product.name}
            actions={<ProductActions
                isEditing={isEditing}
                onDelete={onDelete ? () => handleDelete() : undefined}
                onSubmit={onSubmit ? () => handleSubmitClicked() : undefined}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleSubmitClicked={handleSubmitClicked}
            />}
            className={cn(className, "max-w-2xl")}
        >
            {isEditing ?
                <ProductEdit product={product} onSubmit={handleSubmit}
                    {...(formRef.current !== null && {formRef: formRef as React.RefObject<HTMLFormElement>})}
                /> :
                <ProductContent product={product} />}
        </Card>
    );
};

export default ProductCard;