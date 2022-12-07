import React, { useEffect, useState } from "react";
import { HomeIcon } from "@heroicons/react/solid";
import { Row, Breadcrumb } from 'react-bootstrap';

import { useLogin } from "contexts/ApplicationContext";
import { globalSettings } from "misc/globals";
import axios from "axios";
import { AuctionForm } from "components/habits/AuctionForm";
import { useLocation } from "react-router-dom";

export default () => {
  let location = useLocation()
  let auctionFromProps = location != undefined && location.state != undefined ? location.state.auctionFromProps : ""
  let nftId = location != undefined && location.state != undefined && location.state.nftId != undefined ? location.state.nftId : auctionFromProps.nftId

  const { userInfo } = useLogin();

  const [isEditAuction, setIsEditAuction] = useState(auctionFromProps ? true : false)

  const [auction, setAuction] = useState(isEditAuction ? auctionFromProps : "")

  const [toastMessage, setToastMessage] = useState("");
  const [showInfoToast, setShowInfoToast] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);


  // #region Auction info methods

  const onSaveAuctionInfo = (e) => {
    if (!e)
      return

    setLoadingInfo(true)

    if (isEditAuction)
      patchAuctionInfo(e)
    else
      postAuctionInfo(e)
  }

  const postAuctionInfo = (data) => {
    const headerPayload = {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "post",
      data: data,
      url: globalSettings.baseApiUrl + globalSettings.nftApi + globalSettings.nft.createAuction,
      headers: headerPayload
    }).then((res) => {
      if (res && res.data) {
        setIsEditAuction(true)
        setAuction(res.data)
        setToastMessage("Auction information saved successfully")
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

  const patchAuctionInfo = (data) => {
    const headerPayload = {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "patch",
      data: data,
      url: globalSettings.baseApiUrl + globalSettings.nftApi + globalSettings.nft.auction + "/" + auction._id,
      headers: headerPayload
    }).then((res) => {
      if (res && res.data) {
        setAuction(res.data)
        setToastMessage("Auction information saved successfully")
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
            <Breadcrumb.Item active>Auction Info</Breadcrumb.Item>
          </Breadcrumb>
          <h4>{isEditAuction ? "Detail Auction" : "New Auction"}</h4>
          <p className="mb-0">Details of your Auction.</p>
        </div>
      </div>
      <Row>
        <div xs={12} xl={8}>
          <AuctionForm
            nftId={nftId}
            auction={auction}
            onSavePressed={onSaveAuctionInfo}
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
