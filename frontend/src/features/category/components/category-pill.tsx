import React from 'react'
import { useNavigate } from 'react-router-dom';
import { CategoryOutputDTO } from '@/types'

type NavigatingProps = {
  category: CategoryOutputDTO;
  navigates: true;
  actions?: React.ReactNode;
};

type NonNavigatingProps = {
  category: CategoryOutputDTO;
  navigates?: false;
  actions?: React.ReactNode;
};

type CategoryPillProps = NavigatingProps | NonNavigatingProps;


const CategoryPill = ({category, navigates, actions}: CategoryPillProps) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (navigates) {
            navigate(`/categories/${category.id}`);
        }
    };
  return (
    <span
      className={`inline-flex items-center rounded-full bg-gray-100 text-gray-800 px-3 py-1 font-medium mr-2 select-none transition
        ${navigates ? 'cursor-pointer hover:bg-gray-200 focus:ring-2 focus:ring-gray-400' : 'cursor-default'}
      `}
      onClick={navigates ? handleClick : undefined}
      tabIndex={navigates ? 0 : -1}
      role={navigates ? "button" : undefined}
      aria-label={category.name}
    >
      {category.name}
      {actions && <span className="ml-2 flex items-center">{actions}</span>}
    </span>
  )
}

export default CategoryPill