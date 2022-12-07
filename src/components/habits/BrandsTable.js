import React, { useEffect, useState } from "react";
import { XCircleIcon } from "@heroicons/react/solid";
import { Nav, Card, Form, Button, Table, Tooltip, FormCheck, OverlayTrigger } from 'react-bootstrap';

import { useLogin } from "contexts/ApplicationContext";

import axios from "axios";
import { globalSettings } from "misc/globals";
import { StatusCodes } from "http-status-codes";
import { TablePagination } from "./TablePagination";

const getFirstLetterOfEachWord = (text) => (
  text ? text.match(/\b\w/g).join('') : ''
);

export const BrandsTable = (props) => {
  const { brands = [], allSelected, refresh, setRefresh, showNumber } = props;
  const [bulkOption, setBulkOption] = useState(0);
  const disabledBulkMenu = brands.filter(u => u.isSelected).length === 0;

  const { userInfo } = useLogin()

  // #region Pagination

  const increment = (brands.length % showNumber > 0 ? 1 : 0)
  const pagesNumber = parseInt(Math.floor(brands.length / showNumber)) + increment

  const [activePaginationItem, setActivePaginationItem] = useState(1);

  const onPrevItem = () => {
    const prevActiveItem = activePaginationItem === 1 ? activePaginationItem : activePaginationItem - 1;
    setActivePaginationItem(prevActiveItem);
  };

  const onNextItem = (totalPages) => {
    const nextActiveItem = activePaginationItem === totalPages ? activePaginationItem : activePaginationItem + 1;
    setActivePaginationItem(nextActiveItem);
  };

  const handlePaginationChange = (event) => {
    setActivePaginationItem(parseInt(event.target.id));
  };

  useEffect(() => {
    setActivePaginationItem(1)
  }, [refresh])

  // #endregion

  const selectBrand = (id) => {
    props.selectBrand && props.selectBrand(id);
  };

  const selectAllBrands = () => {
    props.selectAllBrands && props.selectAllBrands();
  };

  const bulkActionChange = (e) => {
    const newOption = e.target.value;
    setBulkOption(newOption);
  }

  const applyBulkAction = () => {
    if (bulkOption === "delete_brands") deleteBrands();
  }

  const deleteBrands = (ids) => {
    props.deleteBrands && props.deleteBrands(ids)
  }

  const TableRow = (props) => {
    const { _id, name, date, isSelected } = props;

    return (
      <tr className="border-bottom">
        <td>
          <FormCheck type="checkbox" className="dashboard-check">
            <FormCheck.Input id={`user-${_id}`} checked={isSelected} onChange={() => selectBrand(_id)} />
            <FormCheck.Label htmlFor={`user-${_id}`} />
          </FormCheck>
        </td>
        <td>
          <Card.Link className="d-flex align-items-center">
            <div className="d-block">
              <span className="fw-bold">{name}</span>
            </div>
          </Card.Link>
        </td>
        <td><span className="fw-normal">{date}</span></td>
        
        <td>
          <OverlayTrigger placement="top" overlay={<Tooltip className="m-0">Delete</Tooltip>}>
            <Card.Link className="ms-2" onClick={() => deleteBrands([_id])}>
              <XCircleIcon className="icon icon-xs text-danger" />
            </Card.Link>
          </OverlayTrigger>
        </td>
      </tr>
    );
  };

  return (
   
    <Card border="0" className="table-wrapper table-responsive shadow">
      <Card.Body>
        <div className="d-flex mb-3">
          <Form.Select className="fmxw-200" disabled={disabledBulkMenu} value={bulkOption} onChange={bulkActionChange}>
            <option value="bulk_action">Bulk Action</option>
            <option value="delete_brands">Delete Brands</option>
          </Form.Select>
          <Button variant="secondary" size="sm" className="ms-3" disabled={disabledBulkMenu} onClick={applyBulkAction}>
            Apply
          </Button>
        </div>
        <Table hover className="user-table align-items-center">
          <thead>
            <tr>
              <th className="border-bottom">
                <FormCheck type="checkbox" className="dashboard-check">
                  <FormCheck.Input id="brandCheckAll" checked={allSelected} onChange={selectAllBrands} />
                  <FormCheck.Label htmlFor="brandCheckAll" />
                </FormCheck>
              </th>
              <th className="border-bottom">Name</th>
              <th className="border-bottom">Date Created</th>
              <th className="border-bottom"></th>
            </tr>
          </thead>
          <tbody className="border-0">
            {/* {brands.map(u => <TableRow key={`brand-${u._id}`} {...u} />)} */}
            {brands.slice((activePaginationItem-1)*showNumber, activePaginationItem*showNumber).map(u => <TableRow key={`brand-${u._id}`} {...u} />)}
          </tbody>
        </Table>
        <Card.Footer className="px-3 border-0 d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <Nav>
            <TablePagination
              onNextItem={onNextItem} 
              onPrevItem={onPrevItem} 
              handlePaginationChange={handlePaginationChange}
              activeItem={activePaginationItem} 
              totalPages={pagesNumber} 
              withIcons 
            />
          </Nav>
          <small className="fw-normal small mt-4 mt-lg-0">
            Showing entries from <b>{1+(activePaginationItem-1)*showNumber}</b> to <b>{activePaginationItem*showNumber > brands.length ? brands.length : activePaginationItem*showNumber}</b> out of <b>{brands.length}</b>.
          </small>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};