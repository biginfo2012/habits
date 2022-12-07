import React, { useEffect, useState } from "react";
import { XCircleIcon, ViewGridAddIcon, CreditCardIcon } from "@heroicons/react/solid";
import { Nav, Card, Form, Button, Table, Tooltip, FormCheck, OverlayTrigger } from 'react-bootstrap';

import { useLogin } from "contexts/ApplicationContext";

import { TablePagination } from "./TablePagination";
import { Routes } from "routes";
import { Link } from "react-router-dom";


export const NFTsTable = (props) => {
  const { nfts = [], allSelected, refresh, setRefresh, showNumber } = props;
  const [bulkOption, setBulkOption] = useState(0);
  const disabledBulkMenu = nfts.filter(u => u.isSelected).length === 0;

  // #region Pagination

  const increment = (nfts.length % showNumber > 0 ? 1 : 0)
  const pagesNumber = parseInt(Math.floor(nfts.length / showNumber)) + increment

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

  const selectNFT = (id) => {
    props.selectNFT && props.selectNFT(id);
  };

  const selectAllNFTs = () => {
    props.selectAllNFTs && props.selectAllNFTs();
  };

  const bulkActionChange = (e) => {
    const newOption = e.target.value;
    setBulkOption(newOption);
  }

  const applyBulkAction = () => {
    if (bulkOption === "delete_nfts")
      deleteNFTs();
    setBulkOption(0)
  }

  const deleteNFTs = (ids) => {
    props.deleteNFTs && props.deleteNFTs(ids)
  }

  const TableRow = (props) => {
    const { _id, urlAsset, walletAddress, name, isSelected } = props;

    return (
      <tr className={"border-bottom"} style={{ borderColor: "black" }}>
        <td>
          <FormCheck type="checkbox" className="dashboard-check">
            <FormCheck.Input id={`nft-${_id}`} checked={isSelected} onChange={() => selectNFT(_id)} />
            <FormCheck.Label htmlFor={`nft-${_id}`} />
          </FormCheck>
        </td>
        <td>
          <Card.Link as={Link} className="d-flex align-items-center" to={{ pathname: Routes.NFT.path, state: { nftFromProps: props, isNewVariantFromProps: false } }}>
            <div className="d-block" style={{ maxWidth: "350px", overflow: "hidden", textOverflow: "ellipsis" }}>
              <span className="fw-bold">{urlAsset}</span>
            </div>
          </Card.Link>
        </td>
        <td>
          <div className="d-block">
            <span className="fw-bold">{name}</span>
          </div>
        </td>
        {/* <td><span className="fw-normal">{categories !== "" ? categories.find(x => x._id == productId).name : ""}</span></td> */}
        <td>
          <div className="d-block">
            <span className="fw-bold">{walletAddress}</span>
          </div>
        </td>
        <td>
          <OverlayTrigger placement="top" overlay={<Tooltip className="m-0">View NFT Sales</Tooltip>}>
            <Card.Link as={Link} className="ms-2" to={{ pathname: Routes.NFTSales.path, state: { nftId: props._id } }}>
              <CreditCardIcon className="icon icon-xs text-info" />
            </Card.Link>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip className="m-0">View Auctions</Tooltip>}>
            <Card.Link as={Link} className="ms-2" to={{ pathname: Routes.Auctions.path, state: { nftId: props._id } }}>
              <ViewGridAddIcon className="icon icon-xs text-success" />
            </Card.Link>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip className="m-0">Delete</Tooltip>}>
            <Card.Link className="ms-2" onClick={() => deleteNFTs([_id])}>
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
            <option value="delete_nfts">Delete NFTs</option>
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
                  <FormCheck.Input id="nftCheckAll" checked={allSelected} onChange={selectAllNFTs} />
                  <FormCheck.Label htmlFor="nftCheckAll" />
                </FormCheck>
              </th>
              <th className="border-bottom">Url Asset</th>
              <th className="border-bottom">Title</th>
              <th className="border-bottom">WalletAddress</th>
              <th className="border-bottom"> </th>
            </tr>
          </thead>
          <tbody className="border-0">
            {nfts.slice((activePaginationItem - 1) * showNumber, activePaginationItem * showNumber).map(u => <TableRow key={`nft-${u._id}`} {...u} />)}
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
            Showing entries from <b>{1 + (activePaginationItem - 1) * showNumber}</b> to <b>{activePaginationItem * showNumber > nfts.length ? nfts.length : activePaginationItem * showNumber}</b> out of <b>{nfts.length}</b>.
          </small>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};