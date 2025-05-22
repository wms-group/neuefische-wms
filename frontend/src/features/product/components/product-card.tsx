import {ProductInputDTO, ProductOutputDTO} from "@/types";
import Card from "@/components/shared/card.tsx";
import {cn} from "@/utils";
import Button from "@/components/ui/button.tsx";
import {ProductForm} from "@/features/product";
import {Dispatch, SetStateAction, useState} from "react";
import {Box} from "lucide-react";
import {StockAmount} from "@/features/stock";

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

const ProductActions = ({
                            isEditing,
                            onDelete,
                            onSubmit,
                            handleEdit,
                            handleDelete,
                            handleSubmitClicked
                        }: ProductActionsProps) => (
    <>
        <>{onSubmit && <EditOrSubmitButton isEditing={isEditing} handleEdit={handleEdit}
                                           handleSubmitClicked={handleSubmitClicked}/>}</>
        <>{isEditing && <Button onClick={handleEdit}>Abbrechen</Button>}</>
        <>{onDelete && <Button onClick={handleDelete} variant="destructive">Löschen</Button>}</>
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
    setFormRef: Dispatch<SetStateAction<HTMLFormElement | null>>;
}

const ProductEdit = ({product, onSubmit, setFormRef}: ProductEditProps) => (
    <ProductForm defaultCategoryId={product.categoryId} onSubmit={onSubmit} value={product} setFormRef={setFormRef}/>
);

type ProductContentProps = {
    product: ProductOutputDTO;
}

const ProductContent = ({product}: ProductContentProps) => (
    <div className={"flex gap-4"}>
        <p>Preis: {product.price}</p>
        <StockAmount productId={product.id} />
    </div>

);

const ProductCard = ({product, onDelete, onSubmit, className}: ProductCardProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formRef, setFormRef] = useState<HTMLFormElement | null>(null);

    const handleDelete = () => {
        if (!onDelete) return;
        setIsEditing(false);
        return onDelete(product.id);
    };

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleSubmitClicked = () => {
        if (!formRef) return;
        formRef.dispatchEvent(new Event("submit", {cancelable: true, bubbles: true}));
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
            title={<div className="flex gap-1"><Box />{product.name}</div>}
            actions={
                <div className={"flex flex-wrap justify-end gap-2 w-full items-center"}>
                    <ProductActions
                        isEditing={isEditing}
                        onDelete={onDelete ? () => handleDelete() : undefined}
                        onSubmit={onSubmit ? () => handleSubmitClicked() : undefined}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        handleSubmitClicked={handleSubmitClicked}
                    />
                </div>}
            className={cn(className)}
        >
            {isEditing ?
                <ProductEdit product={product} onSubmit={handleSubmit} setFormRef={setFormRef}/> :
                <ProductContent product={product}/>}
        </Card>
    );
};

export default ProductCard;