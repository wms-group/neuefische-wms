import {cn} from "@/utils";

type CategoryLinksSkeletonProps = {
    className?: string;
    count?: number;
}

function CategoryLinksSkeleton({className, count}: Readonly<CategoryLinksSkeletonProps>) {
    return (
        <div className={cn("flex flex-row items-center gap-2", className)}>
            {Array.from({length: count ?? 1}).map((_, idx) => (
                <div key={"skel-link-"+idx} className="h-6 w-32 rounded bg-gray-200/30 dark:bg-neutral-500 animate-pulse" />
                ))}
        </div>
    )
}

export default CategoryLinksSkeleton;