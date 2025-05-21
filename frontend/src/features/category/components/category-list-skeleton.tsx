import {CategoryCardSkeleton} from "@/features/category";

type CategoryListSkeletonProps = {
    count?: number;
    className?: string;
}

function CategoryListSkeleton({count = 2, className}: Readonly<CategoryListSkeletonProps>) {
    return (
        <>
            {Array.from({length: count}).map((_, idx) => (
                <CategoryCardSkeleton className={className} key={'skel-list-' + idx}/>
            ))}
        </>
    );
}

export default CategoryListSkeleton;