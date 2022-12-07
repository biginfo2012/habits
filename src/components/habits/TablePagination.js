import React from "react";
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from "@heroicons/react/solid";
import { Pagination } from 'react-bootstrap';

export const TablePagination = (props) => {
  const { totalPages = 5, 
          size = "md", 
          withIcons = false, 
          disablePrev = false, 
          onNextItem=()=>{},
          onPrevItem=()=>{},
          activeItem=1,
          handlePaginationChange=()=>{}
         } = props;

  const items = [];
  for (let number = 1; number <= totalPages; number++) {
    const isItemActive = activeItem === number;

    items.push(
      <Pagination.Item active={isItemActive} key={number} id={number} onClick={(e) => handlePaginationChange(e)}>
        {number}
      </Pagination.Item>
    );
  };

  return (
    <Pagination size={size} className="mt-3">
      <Pagination.Prev disabled={disablePrev} onClick={onPrevItem}>
        {withIcons ? <ChevronDoubleLeftIcon className="icon icon-xs" /> : "Previous"}
      </Pagination.Prev>
      {items}
      <Pagination.Next onClick={() => onNextItem(totalPages)}>
        {withIcons ? <ChevronDoubleRightIcon className="icon icon-xs" /> : "Next"}
      </Pagination.Next>
    </Pagination>
  )
}