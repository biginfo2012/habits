import React, { useEffect, useState } from "react";
import { XCircleIcon } from "@heroicons/react/solid";
import { Nav, Card, Form, Button, Table, Tooltip, FormCheck, OverlayTrigger } from 'react-bootstrap';

import { TablePagination } from "./TablePagination";
import { Routes } from "routes";
import { Link } from "react-router-dom";


export const AuctionsTable = (props) => {
  const { auctions = [], allSelected, refresh, setRefresh, showNumber } = props;
  const [bulkOption, setBulkOption] = useState(0);
  const disabledBulkMenu = auctions.filter(u => u.isSelected).length === 0;

  // #region Pagination

  const increment = (auctions.length % showNumber > 0 ? 1 : 0)
  const pagesNumber = parseInt(Math.floor(auctions.length / showNumber)) + increment

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

  const selectAuction = (id) => {
    props.selectAuction && props.selectAuction(id);
  };

  const selectAllAuctions = () => {
    props.selectAllAuctions && props.selectAllAuctions();
  };

  const bulkActionChange = (e) => {
    const newOption = e.target.value;
    setBulkOption(newOption);
  }

  const applyBulkAction = () => {
    if (bulkOption === "delete_auctions")
      deleteAuctions();
    setBulkOption(0)
  }

  const deleteAuctions = (ids) => {
    props.deleteAuctions && props.deleteAuctions(ids)
  }

  const TableRow = (props) => {
    const { _id, name, basePrice, description, expiry, isSelected } = props;

    return (
      <tr className={"border-bottom"} style={{ borderColor: "black" }}>
        <td>
          <FormCheck type="checkbox" className="dashboard-check">
            <FormCheck.Input id={`auction-${_id}`} checked={isSelected} onChange={() => selectAuction(_id)} />
            <FormCheck.Label htmlFor={`auction-${_id}`} />
          </FormCheck>
        </td>
        <td>
          <Card.Link as={Link} className="d-flex align-items-center" to={{ pathname: Routes.Auction.path, state: { auctionFromProps: props, isNewVariantFromProps: false } }}>
            <div className="d-block" style={{ maxWidth: "350px", overflow: "hidden", textOverflow: "ellipsis" }}>
              <span className="fw-bold">{name}</span>
            </div>
          </Card.Link>
        </td>
        <td>
          <div className="d-block">
            <span className="fw-bold">{basePrice}</span>
          </div>
        </td>
        <td>
          <div className="d-block">
            <span className="fw-bold">{description}</span>
          </div>
        </td>
        <td>
          <div className="d-block">
            <span className="fw-bold">{expiry}</span>
          </div>
        </td>
        <td>
          <OverlayTrigger placement="top" overlay={<Tooltip className="m-0">Delete</Tooltip>}>
            <Card.Link className="ms-2" onClick={() => deleteAuctions([_id])}>
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
            <option value="delete_auctions">Delete Auctions</option>
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
                  <FormCheck.Input id="auctionCheckAll" checked={allSelected} onChange={selectAllAuctions} />
                  <FormCheck.Label htmlFor="auctionCheckAll" />
                </FormCheck>
              </th>
              <th className="border-bottom">Auctioin Name</th>
              <th className="border-bottom">Base Price</th>
              <th className="border-bottom">Description</th>
              <th className="border-bottom">Expiration Time</th>
              <th className="border-bottom"> </th>
            </tr>
          </thead>
          <tbody className="border-0">
            {auctions.slice((activePaginationItem - 1) * showNumber, activePaginationItem * showNumber).map(u => <TableRow key={`auction-${u._id}`} {...u} />)}
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
            Showing entries from <b>{1 + (activePaginationItem - 1) * showNumber}</b> to <b>{activePaginationItem * showNumber > auctions.length ? auctions.length : activePaginationItem * showNumber}</b> out of <b>{auctions.length}</b>.
          </small>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};