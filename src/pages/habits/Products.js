
import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { CheckIcon, CogIcon, HomeIcon, PlusIcon, SearchIcon } from "@heroicons/react/solid";
import { Col, Row, Form, Button, ButtonGroup, Breadcrumb, InputGroup, Dropdown } from 'react-bootstrap';

import { ProductsTable } from "components/habits/ProductsTable";

import axios from "axios";
import { globalSettings } from "../../misc/globals";
import { useLogin } from "../../contexts/ApplicationContext";
import { StatusCodes } from "http-status-codes";
import { Routes } from "routes";
import { Link } from 'react-router-dom';

const SwalWithBootstrapButtons = withReactContent(Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary me-3',
    cancelButton: 'btn btn-gray'
  },
  buttonsStyling: false
}));

const Products = () => {
  const [products, setProducts] = useState([]);
  const [orderedProducts, setOrderedProducts] = useState([]);
  const [refresh, setRefresh] = useState(0)
  const [searchValue, setSearchValue] = useState("");
  const [selectedShowNumber, setSelectedShowNumber] = useState(10);
  const selectedProductIds = products.filter(u => u.isSelected).map(u => u._id);
  const totalProducts = products.length;
  const allSelected = selectedProductIds.length === totalProducts;

  const { userInfo } = useLogin()

  /* Per la creazione di un nuovo Product */
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);

  const toggleCreateProductModal = (props = {}) => {
    //setCreateCardProps({ ...createCardDefaultProps, ...props });
    setShowCreateProductModal(!showCreateProductModal);
  };

  const handleCreateProduct = (props = {}) => {
    const data = {
      ...props
    }
    const headerPayload = {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "post",
      data: data,
      url: globalSettings.baseApiUrl + globalSettings.productsApi + globalSettings.product.createProduct,
      headers: headerPayload
    }).then((res) => {
      console.log(res)
      setRefresh(refresh + 1)
      if (res && res.status === StatusCodes.CREATED) {
      } else {
        console.log("ERR 2")
        // display error
      }
    }).catch((err) => {
      console.log(err)
    })

    toggleCreateProductModal();
  };

  useEffect(() => {
    const headerPayload = {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "get",
      url: globalSettings.baseApiUrl + globalSettings.productsApi,
      headers: headerPayload
    }).then((res) => {
      if (res) {
        const productsResult = res.data
        setProducts(productsResult.map(u => ({ ...u, isSelected: false, show: true })))
      } else {

      }
    }).catch((err) => {
      // handle err
      console.log(err)
    })
  }, [refresh])

  useEffect(() => {
    let tmpOrderedProducts = []
    let i = 0
    for (i = 0; i < products.length; i++) {
      const product = products[i]
      // if product not inserted yet, push it
      if (tmpOrderedProducts.findIndex(tmpProd => tmpProd._id === product._id) < 0) {
        tmpOrderedProducts.push(product)
        // find all variants and push them into prods
        let j = 0
        for (j = 0; j < product.attributes.length; j++) {
          const attribute = product.attributes[j]
          if (tmpOrderedProducts.findIndex(tmpProd => tmpProd._id === attribute.productId) < 0) {
            const found = products.find(x => x._id === attribute.productId)
            tmpOrderedProducts.push(found)
          }
        }
      }
    }
    setOrderedProducts(tmpOrderedProducts)
  }, [products])

  const changeSearchValue = (e) => {
    const newSearchValue = e.target.value;
    const newProduct = products.map(u => ({ ...u, show: u.title.toLowerCase().includes(newSearchValue.toLowerCase()) }));

    setSearchValue(newSearchValue);
    setProducts(newProduct);
  };

  const createProduct = () => {
    console.log("createProduct")
  }

  const selectAllProducts = () => {
    if (selectedProductIds && products) {
      const newProduct = selectedProductIds.length === totalProducts ?
        products.map(u => ({ ...u, isSelected: false })) :
        products.map(u => ({ ...u, isSelected: true }));

      setProducts(newProduct);
    }
  };

  const selectProduct = (id) => {
    console.log(id)
    const newProduct = products.map(u => u._id === id ? ({ ...u, isSelected: !u.isSelected }) : u);
    setProducts(newProduct);
  };

  const deleteProducts = async (ids) => {
    const productsToBeDeleted = ids ? ids : selectedProductIds;
    const productsNr = productsToBeDeleted.length;
    const textMessage = productsNr === 1
      ? "Are you sure do you want to delete this product?"
      : `Are you sure do you want to delete these ${productsNr} products?`;

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
        deleteProduct(ids)
      else {
        selectedProductIds.map(id => deleteProduct(id))
      }
    }
  };

  const deleteProduct = (id) => {
    const headerPayload = {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "delete",
      url: globalSettings.baseApiUrl + globalSettings.productsApi + '/' + id,
      headers: headerPayload
    }).then((res) => {
      if (res) {
        const productResult = res.data
        console.log(productResult)
        //setProducts(productResult.map(u => ({ ...u, isSelected: false, show: true })))
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
            <Breadcrumb.Item active>Products List</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Products</h4>
          <p className="mb-0">List of all products created for the brand.</p>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button as={Link} to={Routes.Product.path} variant="gray-800" size="sm" className="d-inline-flex align-items-center">
            <PlusIcon className="icon icon-xs me-2" /> New Product
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
                placeholder="Search products"
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

      {products &&
        <ProductsTable
          products={orderedProducts.filter(u => u.show)}
          refresh={refresh}
          setRefresh={setRefresh}
          allSelected={allSelected}
          selectProduct={selectProduct}
          deleteProducts={deleteProducts}
          selectAllProducts={selectAllProducts}
          showNumber={selectedShowNumber}
        />
      }
    </>
  );
};

export default Products