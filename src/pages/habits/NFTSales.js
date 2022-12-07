import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { CheckIcon, CogIcon, HomeIcon, PlusIcon, SearchIcon } from "@heroicons/react/solid";
import { Col, Row, Form, Button, ButtonGroup, Breadcrumb, InputGroup, Dropdown } from 'react-bootstrap';

import { NFTSalesTable } from "components/habits/NFTSalesTable";

import axios from "axios";
import { globalSettings } from "../../misc/globals";
import { useLogin } from "../../contexts/ApplicationContext";
import { Routes } from "routes";
import { Link, useLocation } from 'react-router-dom';

const SwalWithBootstrapButtons = withReactContent(Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary me-3',
    cancelButton: 'btn btn-gray'
  },
  buttonsStyling: false
}));

const NFTSales = () => {
  let location = useLocation()
  let nftId = location != undefined && location.state != undefined && location.state.nftId != undefined ? location.state.nftId : ""

  const [sales, setSales] = useState([]);
  const [refresh, setRefresh] = useState(0)
  const [searchValue, setSearchValue] = useState("");
  const [selectedShowNumber, setSelectedShowNumber] = useState(10);
  const selectedSaleIds = sales.filter(u => u.isSelected).map(u => u._id);
  const totalSales = sales.length;
  const allSelected = selectedSaleIds.length === totalSales;

  const { userInfo } = useLogin()


  useEffect(() => {
    const headerPayload = {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "get",
      url: globalSettings.baseApiUrl + globalSettings.nftApi + "/" + globalSettings.nftSalesApi + "/" + nftId,
      headers: headerPayload
    }).then((res) => {
      if (res) {
        const salesResult = res.data
        setSales(salesResult.map(u => ({ ...u, isSelected: false, show: true })))
      } else {

      }
    }).catch((err) => {
      // handle err
      console.log(err)
    })
  }, [refresh])

  const changeSearchValue = (e) => {
    const newSearchValue = e.target.value;
    console.log("test Search Sales")
    console.log(newSearchValue)
    const newSale = sales.map(u => ({ ...u, show: u.name.toLowerCase().includes(newSearchValue.toLowerCase()) }));
    console.log("-----------------------")
    console.log(newSale)
    console.log("-----------------------")
    setSearchValue(newSearchValue);
    setSales(newSale);
  };

  const selectAllSales = () => {
    if (selectedSaleIds && sales) {
      const newSale = selectedSaleIds.length === totalSales ?
        sales.map(u => ({ ...u, isSelected: false })) :
        sales.map(u => ({ ...u, isSelected: true }));

      setSales(newSale);
    }
  };

  const selectSale = (id) => {
    const newSale = sales.map(u => u._id === id ? ({ ...u, isSelected: !u.isSelected }) : u);
    setSales(newSale);
  };

  const deleteSales = async (ids) => {
    const salesToBeDeleted = ids ? ids : selectedSaleIds;
    const salesNr = salesToBeDeleted.length;
    const textMessage = salesNr === 1
      ? "Are you sure do you want to delete this NFTSale?"
      : `Are you sure do you want to delete these ${salesNr} NFTSales?`;

    const result = await SwalWithBootstrapButtons.fire({
      icon: "error",
      title: "Confirm deletion",
      text: textMessage,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {

      if (ids)
        deleteSale(ids)
      else {
        selectedSaleIds.map(id => deleteSale(id))
      }
    }
  };

  const deleteSale = (id) => {
    const headerPayload = {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "delete",
      url: globalSettings.baseApiUrl + globalSettings.nftApi + globalSettings.nft.sale + '/' + id,
      headers: headerPayload
    }).then((res) => {
      if (res) {
        const saleResult = res.data
        setRefresh(refresh + 1)
      } else {

      }
    }).catch((err) => {
      // handle err
      console.log(err)
    })
  }

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><HomeIcon className="icon icon-xs" /></Breadcrumb.Item>
            <Breadcrumb.Item>Habits</Breadcrumb.Item>
            <Breadcrumb.Item active>Sales List</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Sales</h4>
          <p className="mb-0">List of all Sales created for the NFT.</p>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button as={Link} to={{ pathname: Routes.NFTSale.path, state: { nftId: nftId } }} variant="gray-800" size="sm" className="d-inline-flex align-items-center">
            <PlusIcon className="icon icon-xs me-2" /> New Sale
          </Button>
        </div>
      </div>

      <div className="table-settings mb-4">
        <Row className="justify-content-between align-items-center">
          <Col xs={9} lg={8} className="d-md-flex">
            <InputGroup className="me-2 me-lg-3 fmxw-300">
              <InputGroup.Text>
                <SearchIcon className="icon icon-xs" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search Sales"
                value={searchValue}
                onChange={changeSearchValue}
              />
            </InputGroup>
          </Col>
          <Col xs={3} lg={4} className="d-flex justify-content-end">
            <ButtonGroup>
              <Dropdown>
                <Dropdown.Toggle split as={Button} variant="link" className="text-dark m-0 p-1">
                  <CogIcon className="icon icon-sm" />
                  <span className="visually-hidden">Toggle Dropdown</span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-xs dropdown-menu-end pb-0">
                  <span className="small ps-3 fw-bold text-dark">
                    Show
                  </span>
                  <Dropdown.Item onClick={() => setSelectedShowNumber(10)} className="d-flex align-items-center fw-bold">
                    10 {selectedShowNumber == 10 && <CheckIcon className="icon icon-xxs ms-auto" />}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedShowNumber(20)} className="fw-bold">
                    20 {selectedShowNumber == 20 && <CheckIcon className="icon icon-xxs ms-auto" />}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedShowNumber(30)} className="fw-bold rounded-bottom">
                    30 {selectedShowNumber == 30 && <CheckIcon className="icon icon-xxs ms-auto" />}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </ButtonGroup>
          </Col>
        </Row>
      </div>

      {sales &&
        <NFTSalesTable
          sales={sales}
          refresh={refresh}
          setRefresh={setRefresh}
          allSelected={allSelected}
          selectSale={selectSale}
          deleteSales={deleteSales}
          selectAllSales={selectAllSales}
          showNumber={selectedShowNumber}
        />
      }
    </>
  );
};

export default NFTSales