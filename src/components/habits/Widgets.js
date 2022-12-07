import React, { useState, useEffect } from "react";
import { Col, Row, Card, Image, ListGroup } from 'react-bootstrap';
import { ArchiveIcon, ClipboardListIcon, CollectionIcon, UserIcon } from "@heroicons/react/solid";
import axios from "axios";
import { globalSettings } from "../../misc/globals";

export const BrandsOverviewWidget = (props) => {
  const { title, brands, userInfo } = props;

  const BrandItem = (props) => {
    const { _id, name, logo } = props;
    const [counter, setCounter] = useState(0);
    
    useEffect(() => {
      const headerPayload = {
          "Access-Control-Allow-Origin" : "*",
          "Content-type": "Application/json",
          "Authorization": `Bearer ${userInfo.token}`,
      }
      axios({
          method: "get",
          url: globalSettings.baseApiUrl + globalSettings.productsApi + globalSettings.product.brand + _id,
          headers: headerPayload
      }).then((res) => {
          if (res ) {
              const productsResult = res.data
              //setProducts(productsResult.map(u => ({ ...u, isSelected: false, show: true })))
              setCounter(productsResult.length)
          } else {
              
          }
      }).catch((err) => {
          // handle err
          console.log(err)
      })
  },[])


    return (
      <ListGroup.Item className="bg-transparent border-bottom py-3 px-0">
        <Row className="align-items-center">
          <Col xs="auto">
              <Image rounded src={logo} className="avatar-md m-0" />
          </Col>
          <Col xs="auto" className="px-0">
            <h4 className="fs-6 text-dark mb-0">
                {name}
            </h4>
          </Col>
          <Col className="text-end">
            <span className="fs-6 fw-bolder text-dark">
              #{counter}
            </span>
          </Col>
        </Row>
      </ListGroup.Item>
    );
  }

  return (
    <Card border="0" className="shadow">
      <Card.Header className="border-bottom">
        <h2 className="fs-5 fw-bold mb-0">
          {title}
        </h2>
      </Card.Header>
      <Card.Body className="py-0">
        <ListGroup className="list-group-flush">
          {brands.map((brand,index) => <BrandItem key={`brand-${index}`} {...brand} />)}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export const InfoWidget = (props) => {
    const { userInfo, categories } = props;
    const [userCount, setUserCount] = useState(0);
    const [brandCount, setBrandCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    
    useEffect(() => {
      const headerPayload = {
          "Access-Control-Allow-Origin" : "*",
          "Content-type": "Application/json",
          "Authorization": `Bearer ${userInfo.token}`,
      }
      axios({
          method: "get",
          url: globalSettings.baseApiUrl + globalSettings.userApi,
          headers: headerPayload
      }).then((res) => {
          if (res ) {
              const theResult = res.data
              setUserCount(theResult.length)
          } else {
              
          }
      }).catch((err) => {
          // handle err
          console.log(err)
      })

      axios({
          method: "get",
          url: globalSettings.baseApiUrl + globalSettings.productsApi + globalSettings.product.brands,
          headers: headerPayload
      }).then((res) => {
          if (res ) {
              const theResult = res.data
              //setProducts(productsResult.map(u => ({ ...u, isSelected: false, show: true })))
              setBrandCount(theResult.length)
          } else {
              
          }
      }).catch((err) => {
          // handle err
          console.log(err)
      })

      axios({
          method: "get",
          url: globalSettings.baseApiUrl + globalSettings.productsApi,
          headers: headerPayload
      }).then((res) => {
          if (res ) {
              const theResult = res.data
              //setProducts(productsResult.map(u => ({ ...u, isSelected: false, show: true })))
              setProductCount(theResult.length)
          } else {
              
          }
      }).catch((err) => {
          // handle err
          console.log(err)
      })
  },[])

  return (
    <Card border="0" className="shadow">
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between border-bottom pb-3">
          <div className="d-flex align-items-center h6 mb-0">
            <UserIcon className="icon icon-xs text-gray-500 me-2" />
            Total Users
          </div>
          <div>
            <div className="d-flex align-items-center fw-bold">{userCount}</div>
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between border-bottom py-3">
          <div>
            <div className="d-flex align-items-center h6 mb-0">
              <CollectionIcon className="icon icon-xs text-gray-500 me-2" />
              Total Brands
            </div>
          </div>
          <div>
                <div className="d-flex align-items-center fw-bold">{brandCount}</div>
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between border-bottom py-3">
          <div>
            <div className="d-flex align-items-center h6 mb-0">
              <ClipboardListIcon className="icon icon-xs text-gray-500 me-2" />
              Total Categories
            </div>
          </div>
          <div>
            <div className="d-flex align-items-center fw-bold">{categories.length}</div>
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between pt-3">
          <div>
            <div className="d-flex align-items-center h6 mb-0">
              <ArchiveIcon className="icon icon-xs text-gray-500 me-2" />
              Total Products
            </div>
          </div>
          <div>
            <div className="d-flex align-items-center fw-bold">{productCount}</div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};