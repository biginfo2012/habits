
import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { CheckIcon, CogIcon, HomeIcon, PlusIcon, SearchIcon } from "@heroicons/react/solid";
import { Col, Row, Form, Button, ButtonGroup, Breadcrumb, InputGroup, Dropdown } from 'react-bootstrap';

import { BrandsTable } from "components/habits/BrandsTable";

import axios from "axios";
import { globalSettings } from "../../misc/globals";
import { useLogin } from "../../contexts/ApplicationContext";
import { NewBrandModal } from "components/habits/BrandModal";
import { StatusCodes } from "http-status-codes";

const SwalWithBootstrapButtons = withReactContent(Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary me-3',
    cancelButton: 'btn btn-gray'
  },
  buttonsStyling: false
}));

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [refresh, setRefresh] = useState(0)
  const [searchValue, setSearchValue] = useState("");
  const [selectedShowNumber, setSelectedShowNumber] = useState(10);
  const selectedBrandsIds = brands.filter(u => u.isSelected).map(u => u._id);
  const totalBrands = brands.length;
  const allSelected = selectedBrandsIds.length === totalBrands;

  /* Per la creazione di un nuovo Brand */
  const [showCreateBrandModal, setShowCreateBrandModal] = useState(false);

  const toggleCreateBrandModal = (props = {}) => {
    //setCreateCardProps({ ...createCardDefaultProps, ...props });
    setShowCreateBrandModal(!showCreateBrandModal);
  };

  const handleCreateBrand = (props = {}) => {
    const data = {...props
    }
    const headerPayload = {
        "Access-Control-Allow-Origin" : "*",
        "Content-type": "Application/json",
        "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "post",
      data: data,
      url: globalSettings.baseApiUrl + globalSettings.productsApi + globalSettings.product.createBrand,
      headers: headerPayload
    }).then((res) => {
      console.log(res)
      setRefresh(refresh+1)
      if (res && res.status === StatusCodes.CREATED) {
      } else {
        console.log("ERR 2")
        // display error
      }
    }).catch((err) => {
      console.log(err)
    })

    toggleCreateBrandModal();
  };

  const { userInfo } = useLogin()
   
  useEffect(() => {
      const headerPayload = {
          "Access-Control-Allow-Origin" : "*",
          "Content-type": "Application/json",
          "Authorization": `Bearer ${userInfo.token}`,
      }
      axios({
          method: "get",
          url: globalSettings.baseApiUrl + globalSettings.productsApi + globalSettings.product.brands,
          headers: headerPayload
      }).then((res) => {
          if (res ) {
              const brandsResult = res.data
              console.log(brandsResult)
              setBrands(brandsResult.map(u => ({ ...u, isSelected: false, show: true })))
          } else {
              
          }
      }).catch((err) => {
          // handle err
          console.log(err)
      })
  },[refresh, userInfo.token])

  const changeSearchValue = (e) => {
    const newSearchValue = e.target.value;
    const newBrand = brands.map(u => ({ ...u, show: u.name.toLowerCase().includes(newSearchValue.toLowerCase()) }));

    setSearchValue(newSearchValue);
    setBrands(newBrand);
  };

  const selectAllBrands = () => {
    const newBrand = selectedBrandsIds.length === totalBrands ?
      brands.map(u => ({ ...u, isSelected: false })) :
      brands.map(u => ({ ...u, isSelected: true }));

    setBrands(newBrand);
  };

  const selectBrand = (id) => {
    const newBrand = brands.map(u => u._id === id ? ({ ...u, isSelected: !u.isSelected }) : u);
    setBrands(newBrand);
  };

  const deleteBrands = async (ids) => {
    const brandsToBeDeleted = ids ? ids : selectedBrandsIds;
    const brandsNr = brandsToBeDeleted.length;
    const textMessage = brandsNr === 1
      ? "Are you sure do you want to delete this brand?"
      : `Are you sure do you want to delete these ${brandsNr} brands?`;

    const result = await SwalWithBootstrapButtons.fire({
      icon: "error",
      title: "Confirm deletion",
      text: textMessage,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {

      if ( ids )
        deleteBrand( ids )
      else {
        selectedBrandsIds.map(id => deleteBrand(id))
      }
    }
  };

  const deleteBrand = (id) => {
    const headerPayload = {
          "Access-Control-Allow-Origin" : "*",
          "Content-type": "Application/json",
          "Authorization": `Bearer ${userInfo.token}`,
      }
      axios({
          method: "delete",
          url: globalSettings.baseApiUrl + globalSettings.productsApi + globalSettings.product.brand + id,
          headers: headerPayload
      }).then((res) => {
          if (res ) {
              const brandResult = res.data
              console.log(brandResult)
              //setBrands(brandResult.map(u => ({ ...u, isSelected: false, show: true })))
              setRefresh(refresh+1)
          } else {
              
          }
      }).catch((err) => {
          // handle err
          console.log(err)
      })
  }

  return (
    <>
      {showCreateBrandModal && (
        <NewBrandModal
          show={showCreateBrandModal}
          onHide={toggleCreateBrandModal}
          onSubmit={handleCreateBrand}
        />
      )}
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><HomeIcon className="icon icon-xs" /></Breadcrumb.Item>
            <Breadcrumb.Item>Habits</Breadcrumb.Item>
            <Breadcrumb.Item active>Brands List</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Brands List</h4>
          <p className="mb-0">List of all the brands created and their status.</p>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button variant="gray-800" size="sm" className="d-inline-flex align-items-center" onClick={() => toggleCreateBrandModal()}>
            <PlusIcon className="icon icon-xs me-2" /> New Brand
          </Button>
          {/*<ButtonGroup className="ms-2 ms-lg-3">
            <Button variant="outline-gray-600" size="sm">Share</Button>
            <Button variant="outline-gray-600" size="sm">Export</Button>
          </ButtonGroup>*/}
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
                placeholder="Search brands"
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
                    10 {selectedShowNumber === 10 && <CheckIcon className="icon icon-xxs ms-auto" />}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedShowNumber(20)} className="fw-bold">
                    20 {selectedShowNumber === 20 && <CheckIcon className="icon icon-xxs ms-auto" />}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedShowNumber(30)} className="fw-bold rounded-bottom">
                    30 {selectedShowNumber === 30 && <CheckIcon className="icon icon-xxs ms-auto" />}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </ButtonGroup>
          </Col>
        </Row>
      </div>

    {brands &&
      <BrandsTable
        brands={brands.filter(u => u.show)}
        refresh={refresh}
        setRefresh={setRefresh}
        allSelected={allSelected}
        selectBrand={selectBrand}
        deleteBrands={deleteBrands}
        selectAllBrands={selectAllBrands}
        showNumber={selectedShowNumber}
      />
    }
    </>
  );
};

export default Brands