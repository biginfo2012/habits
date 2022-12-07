import React, { useEffect, useState } from "react";
import { CheckCircleIcon, MinusCircleIcon, XCircleIcon, ViewGridAddIcon } from "@heroicons/react/solid";
import { Nav, Card, Form, Button, Table, Tooltip, FormCheck, OverlayTrigger } from 'react-bootstrap';

import { useLogin } from "contexts/ApplicationContext";

import { TablePagination } from "./TablePagination";
import { Routes } from "routes";
import { Link } from "react-router-dom";

const getFirstLetterOfEachWord = (text) => (
  text ? text.match(/\b\w/g).join('') : ''
);

export const ProductsTable = (props) => {
  const { products = [], allSelected, refresh, setRefresh, showNumber } = props;
  const [bulkOption, setBulkOption] = useState(0);
  const disabledBulkMenu = products.filter(u => u.isSelected).length === 0;

  const { userInfo, categories } = useLogin()

  // #region Pagination

  const increment = (products.length % showNumber > 0 ? 1 : 0)
  const pagesNumber = parseInt(Math.floor(products.length / showNumber)) + increment

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

  const selectProduct = (id) => {
    props.selectProduct && props.selectProduct(id);
  };

  const selectAllProducts = () => {
    props.selectAllProducts && props.selectAllProducts();
  };

  const bulkActionChange = (e) => {
    const newOption = e.target.value;
    setBulkOption(newOption);
  }

  const applyBulkAction = () => {
    if (bulkOption === "delete_products")
      deleteProducts();
    setBulkOption(0)  
  }

  const deleteProducts = (ids) => {
    props.deleteProducts && props.deleteProducts(ids)
  }

  const TableRow = (props) => {
    const { _id, code, title, categoryId, price, effect, isSelected, attributes } = props;
    const VerifiedIcon = effect ? CheckCircleIcon : MinusCircleIcon;
    const statusVariant = effect ? "success": "warning"
    console.log(attributes)
    
    return (
      <tr className={"border-bottom"} style={{borderColor: attributes.length == 0 ? "red" : "black"}}>
        <td>
          <FormCheck type="checkbox" className="dashboard-check">
            <FormCheck.Input id={`product-${_id}`} checked={isSelected} onChange={() => selectProduct(_id)} />
            <FormCheck.Label htmlFor={`product-${_id}`} />
          </FormCheck>
        </td>
        <td>
          <Card.Link as={Link} className="d-flex align-items-center" to={{pathname: Routes.Product.path, state: {productFromProps: props, isNewVariantFromProps: false}}}>
            <div className="d-block">
              <span className="fw-bold">{code}</span>
            </div>
          </Card.Link>
        </td>
        <td>
          <Card.Link as={Link} className="d-flex align-items-center" to={{pathname: Routes.Product.path, state: {productFromProps: props, isNewVariantFromProps: false}}}>
            <div className="d-block">
              <span className="fw-bold">{title}</span>
            </div>
          </Card.Link>
        </td>
        <td><span className="fw-normal">{categories !== "" ? categories.find(x => x._id == categoryId).name : ""}</span></td>
        <td>
          <span className="fw-normal d-flex align-items-center">{price}</span>
        </td>
        <td>
          <span className="fw-normal d-flex align-items-center">
            <VerifiedIcon className={`icon icon-xs text-${statusVariant} me-1`} />
          </span>
        </td>
        <td>
        <OverlayTrigger placement="top" overlay={<Tooltip className="m-0">Add Variant</Tooltip>}>
            <Card.Link as={Link} className="ms-2" to={{pathname: Routes.Product.path, state: {productFromProps: props, isNewVariantFromProps: true}}}>
              <ViewGridAddIcon className="icon icon-xs text-success" />
            </Card.Link>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip className="m-0">Delete</Tooltip>}>
            <Card.Link className="ms-2" onClick={() => deleteProducts([_id])}>
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
            <option value="delete_products">Delete Products</option>
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
                  <FormCheck.Input id="productCheckAll" checked={allSelected} onChange={selectAllProducts} />
                  <FormCheck.Label htmlFor="productCheckAll" />
                </FormCheck>
              </th>
              <th className="border-bottom">Code</th>
              <th className="border-bottom">Title</th>
              <th className="border-bottom">Category</th>
              <th className="border-bottom">Price</th>
              <th className="border-bottom">Has AR Effect</th>
              <th className="border-bottom"> </th>
            </tr>
          </thead>
          <tbody className="border-0">
            {products.slice((activePaginationItem-1)*showNumber, activePaginationItem*showNumber).map(u => <TableRow key={`product-${u._id}`} {...u} />)}
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
            Showing entries from <b>{1+(activePaginationItem-1)*showNumber}</b> to <b>{activePaginationItem*showNumber > products.length ? products.length : activePaginationItem*showNumber}</b> out of <b>{products.length}</b>.
          </small>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};