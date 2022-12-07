import React, { useEffect, useState } from "react";
import { HomeIcon } from "@heroicons/react/solid";
import { Row, Breadcrumb } from 'react-bootstrap';

import { useLogin } from "contexts/ApplicationContext";
import { globalSettings } from "misc/globals";
import axios from "axios";
import { NFTSaleForm } from "components/habits/NFTSaleForm";
import { useLocation } from "react-router-dom";

export default () => {
  let location = useLocation()
  let saleFromProps = location != undefined && location.state != undefined ? location.state.saleFromProps : ""
  let nftId = location != undefined && location.state != undefined && location.state.nftId != undefined ? location.state.nftId : saleFromProps.nftId

  const { userInfo } = useLogin();

  const [isEditSale, setisEditSale] = useState(saleFromProps ? true : false)

  const [sale, setSale] = useState(isEditSale ? saleFromProps : "")

  const [toastMessage, setToastMessage] = useState("");
  const [showInfoToast, setShowInfoToast] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);


  // #region Sale info methods

  const onSaveSaleInfo = (e) => {
    if (!e)
      return

    setLoadingInfo(true)

    if (isEditSale)
      patchSaleInfo(e)
    else
      postSaleInfo(e)
  }

  const postSaleInfo = (data) => {
    const headerPayload = {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "post",
      data: data,
      url: globalSettings.baseApiUrl + globalSettings.nftApi + globalSettings.nft.createSale,
      headers: headerPayload
    }).then((res) => {
      if (res && res.data) {
        setisEditSale(true)
        setSale(res.data)
        setToastMessage("Sale information saved successfully")
        setShowInfoToast(true)
      } else {
        console.log(res)
        // display error
      }
      setLoadingInfo(false)
    }).catch((err) => {
      console.log(err)
      setLoadingInfo(false)
    })
  }

  const patchSaleInfo = (data) => {
    const headerPayload = {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "patch",
      data: data,
      url: globalSettings.baseApiUrl + globalSettings.nftApi + globalSettings.nft.sale + "/" + sale._id,
      headers: headerPayload
    }).then((res) => {
      if (res && res.data) {
        setSale(res.data)
        setToastMessage("Sale information saved successfully")
        setShowInfoToast(true)
      } else {
        console.log(res)
        // display error
      }
      setLoadingInfo(false)
    }).catch((err) => {
      console.log(err)
      setLoadingInfo(false)
    })
  }

  // #endregion


  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><HomeIcon className="icon icon-xs" /></Breadcrumb.Item>
            <Breadcrumb.Item>Habits</Breadcrumb.Item>
            <Breadcrumb.Item active>Sale Info</Breadcrumb.Item>
          </Breadcrumb>
          <h4>{isEditSale ? "Detail Sale" : "New Sale"}</h4>
          <p className="mb-0">Details of your Sale.</p>
        </div>
      </div>
      <Row>
        <div xs={12} xl={8}>
          <NFTSaleForm
            nftId={nftId}
            sale={sale}
            onSavePressed={onSaveSaleInfo}
            showToast={showInfoToast}
            toastMessage={toastMessage}
            onToastClose={() => { setShowInfoToast(false) }}
            loading={loadingInfo}
          />
        </div>
      </Row>
    </>
  );
};
