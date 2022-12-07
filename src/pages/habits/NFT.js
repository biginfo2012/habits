import React, { useEffect, useState } from "react";
import { HomeIcon } from "@heroicons/react/solid";
import { Row, Breadcrumb } from 'react-bootstrap';

import { useLogin } from "contexts/ApplicationContext";
import { globalSettings } from "misc/globals";
import axios from "axios";
import { NFTForm } from "components/habits/NFTForm";
import { useLocation } from "react-router-dom";
import { Routes } from "routes";
import { useHistory } from "react-router-dom";

export default () => {
  let location = useLocation()
  let nftFromProps = location != undefined && location.state != undefined ? location.state.nftFromProps : ""

  const { userInfo } = useLogin();

  const [isEditNFT, setIsEditNFT] = useState(nftFromProps ? true : false)

  const [nft, setNFT] = useState(isEditNFT ? nftFromProps : "")

  const [toastMessage, setToastMessage] = useState("");
  const [showInfoToast, setShowInfoToast] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [walletAddresses, setWalletAddresses] = useState([])

  const history = useHistory()

  useEffect(() => {
    getWalletAddresses()
  }, [])

  // #region NFT info methods

  const onSaveNFTInfo = (e) => {    
    if (!e)
      return

    setLoadingInfo(true)

    if (isEditNFT)
      patchNFTInfo(e)
    else {
      postNFTImage(e)
      return
    }      
  }

  const postNFTImage = (e) => {
    if(!e.image)
      return

    const formData = new FormData();
    formData.append('file', e.image)

    const headerPayload = {
      "Access-Control-Allow-Origin" : "*",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios.post(
      globalSettings.baseApiUrl + globalSettings.nftApi + globalSettings.nft.image, 
      formData, 
      {headers: headerPayload}
    ).then((res) => {
      if (res && res.data) {
        var info = {
          'urlAsset': res.data.urlAsset,
          'imageName': res.data.imageName,
          'walletAddress': e.walletAddress,
          'name': e.name,
          'description': e.description,
          'md5': res.data.md5
        }
        postNFTInfo(info)
      } else {        
        console.log("ERR SAVE NFT IMAGE")
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  const deleteNFTImage = (e) => {
    if(!e)
      return

    const headerPayload = {
      "Access-Control-Allow-Origin" : "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "delete",
      data: e,
      url: globalSettings.baseApiUrl + globalSettings.nftApi + globalSettings.nft.image,
      headers: headerPayload
    }).then((res) => {
      if (res && res.data) {
        console.log(res)
      } else {
        console.log("ERR DELETE NFT IMAGE")
        // display error
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  const postNFTInfo = (data) => {
    const headerPayload = {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "post",
      data: data,
      url: globalSettings.baseApiUrl + globalSettings.nftApi,
      headers: headerPayload
    }).then((res) => {
      if (res && res.data) {
        setIsEditNFT(true)
        setNFT(res.data)
        setToastMessage("NFT information saved successfully")
        setShowInfoToast(true)
        history.push(Routes.NFTs.path)
      } else {
        console.log(res)
        deleteNFTImage()
        // display error
      }
      setLoadingInfo(false)
    }).catch((err) => {
      console.log(err)
      setLoadingInfo(false)
    })
  }

  const patchNFTInfo = (data) => {
    const headerPayload = {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "patch",
      data: data,
      url: globalSettings.baseApiUrl + globalSettings.nftApi + '/' + nft._id,
      headers: headerPayload
    }).then((res) => {
      if (res && res.data) {
        setNFT(res.data)
        setToastMessage("NFT information saved successfully")
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

  const getWalletAddresses = () => {
    const headerPayload = {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "get",
      url: globalSettings.baseApiUrl + globalSettings.productsApi + globalSettings.product.wallets,
      headers: headerPayload
    }).then((res) => {
      if (res) {
        setWalletAddresses(res.data)
      } else {

      }
    }).catch((err) => {
      // handle err
      console.log(err)
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
            <Breadcrumb.Item active>NFT Info</Breadcrumb.Item>
          </Breadcrumb>
          <h4>{isEditNFT ? "Detail NFT" : "New NFT"}</h4>
          <p className="mb-0">Details of your NFT.</p>
        </div>
      </div>
      <Row>
        <div xs={12} xl={8}>
          <NFTForm
            nft={nft}
            onSavePressed={onSaveNFTInfo}
            showToast={showInfoToast}
            toastMessage={toastMessage}
            onToastClose={() => { setShowInfoToast(false) }}
            loading={loadingInfo}
            isEditNFT={isEditNFT}
            walletAddresses={walletAddresses}
          />
        </div>
      </Row>
    </>
  );
};
