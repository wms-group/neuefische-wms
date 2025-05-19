import React from 'react'
import { CategoryOutputDTO } from '@/types'

type NavigatingProps = {
  category: CategoryOutputDTO;
  actions?: React.ReactNode;
};

type NonNavigatingProps = {
  category: CategoryOutputDTO;
  actions?: React.ReactNode;
};

type CategoryPillProps = NavigatingProps | NonNavigatingProps;


const CategoryPill = ({category,  actions}: CategoryPillProps) => {

    return (
        <div
        className={`inline-flex items-center rounded-full bg-gray-100 text-gray-800 px-3 py-1 font-medium mr-2 select-none transition`}
        aria-label={category.name}
        >
            {category.name}
        {actions && <span className="ml-2 flex items-center">{actions}</span>}
        </div>
    )
}

export default CategoryPill