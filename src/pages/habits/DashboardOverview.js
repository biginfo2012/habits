
import React, { useState, useEffect } from "react";
import { Col, Row } from 'react-bootstrap';

import { BrandsOverviewWidget, InfoWidget } from "components/habits/Widgets";
import axios from "axios";
import { globalSettings } from "../../misc/globals";
import { useLogin } from "../../contexts/ApplicationContext";
import Routez from "routes/Routez";
import { Redirect } from "react-router-dom";
import { Routes } from "routes";

export default () => {
  const [refresh, setRefresh] = useState(0)
  const [brands, setBrands] = useState([]);
  const { userInfo, categories } = useLogin()
   
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
              setBrands(brandsResult)
          } else {
              
          }
      }).catch((err) => {
          // handle err
          console.log(err)
      })
  },[refresh, userInfo.token])

  return (
    <>
      <div className="py-4">
        
      </div>

      <Row>
        { userInfo.role === 'admin' && 
          <Col xs={12} md={6} xxl={4} className="mb-4">
            <BrandsOverviewWidget title="Brands Overview / Num Products" brands={brands} userInfo={userInfo}/>
          </Col>
        }
        { userInfo.role === 'admin' && 
          <Col xs={12} xxl={4} className="mb-4">
              <InfoWidget  userInfo={userInfo} categories={categories}/>
            </Col>
        }
        {userInfo.role === 'brand' && 
          <Redirect to={Routes.Brand.path} />
        }
        
      </Row>
    </>
  );
};
