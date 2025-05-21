import Card from "@/components/shared/card.tsx";
import {cn} from "@/utils";
import {CategoryLinksSkeleton} from "@/features/category";

type CategoryCardSkeletonProps = {
    className?: string;
}

function CategoryCardSkeleton({className}: Readonly<CategoryCardSkeletonProps>) {
    return (
        <Card
            title={
                <div className="h-6 w-32 rounded bg-primary animate-pulse" />
            }
            actions={
                <div className="flex justify-end items-center gap-2">
                    <div className="h-11 w-30 rounded-lg bg-primary animate-pulse" />
                    <div className="h-11 w-30 rounded-lg bg-primary animate-pulse" />
                </div>
            }
            className={cn(className, "max-w-2xl")}
        >
            <CategoryLinksSkeleton count={2} />
        </Card>
    );
}

export default CategoryCardSkeleton;