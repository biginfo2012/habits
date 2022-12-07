import React, { useEffect, useState } from "react";
import { HomeIcon } from "@heroicons/react/solid";
import { Col, Row, Breadcrumb } from 'react-bootstrap';

import { BrandInfoForm } from "components/habits/BrandInfoForm";
import { ChooseImageComponent } from "components/habits/ChooseImageComponent";
import { useLogin } from "contexts/ApplicationContext";
import { globalSettings } from "misc/globals";
import axios from "axios";
import { WalletAddressForm } from "components/habits/WalletAddressForm";


export default (props) => {
  // const { isAdmin, brandId } = props

  const { userInfo } = useLogin();
  const [ brand, setBrand ] = useState(null)
  
  const [ selectedLogo, setSelectedLogo ] = useState(null)
  const [ selectedLogoFile, setSelectedLogoFile ] = useState(null)
  const [ selectedBrand, setSelectedBrand ] = useState(null)
  const [ selectedBrandFile, setSelectedBrandFile ] = useState(null)
  const [ selectedFrame, setSelectedFrame ] = useState(null)
  const [ selectedFrameFile, setSelectedFrameFile ] = useState(null)

  const [toastMessage, setToastMessage] = useState("");
  const [showInfoToast, setShowInfoToast] = useState(false);
  const [showBrandToast, setShowBrandToast] = useState(false);
  const [showLogoToast, setShowLogoToast] = useState(false);
  const [showFrameToast, setShowFrameToast] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [loadingBrand, setLoadingBrand] = useState(false);
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [loadingFrame, setLoadingFrame] = useState(false);
  const [walletAddresses, setWalletAddresses] = useState([])


  
  useEffect(() => {
    const headerPayload = {
        "Access-Control-Allow-Origin" : "*",
        "Content-type": "Application/json",
        "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
        method: "get",
        url: globalSettings.baseApiUrl + globalSettings.productsApi + globalSettings.product.getBrand,
        headers: headerPayload
    }).then((res) => {
        if (res ) {
            const brandResult = res.data
            console.log(brandResult)
            setBrand(brandResult)
        } else {
            
        }
    }).catch((err) => {
        // handle err
        console.log(err)
    })
  },[])

  useEffect(() => {
    if(brand)
    {
      setSelectedLogo(brand.logo)
      setSelectedBrand(brand.brand)
      setSelectedFrame(brand.frame)
    }
    getWalletAddress()
  },[brand])

  const onSaveBrandInfo = (e) => {
    if(!e)
      return

    setLoadingInfo(true)
    const headerPayload = {
        "Access-Control-Allow-Origin" : "*",
        "Content-type": "Application/json",
        "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "patch",
      data: e,
      url: globalSettings.baseApiUrl + globalSettings.productsApi + globalSettings.product.getBrand,
      headers: headerPayload
    }).then((res) => {
      if (res && res.data) {
        setBrand(res.data)
        setToastMessage("General brand information saved successfully")
        setShowInfoToast(true)
      } else {
        console.log("ERR PATCH BRAND")
        // display error
      }
      setLoadingInfo(false)
    }).catch((err) => {
      console.log(err)
      setLoadingInfo(false)
    })
  }

  const onLogoChange = (e) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      setSelectedLogo(URL.createObjectURL(e.currentTarget.files[0]));
      setSelectedLogoFile(e.currentTarget.files[0]);
    }
  }

  const onLogoSave = () => {
    if(!selectedLogoFile)
      return

    setLoadingLogo(true)

    const formData = new FormData();
    formData.append('file', selectedLogoFile)

    const headerPayload = {
      "Access-Control-Allow-Origin" : "*",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios.post(
      globalSettings.baseApiUrl + globalSettings.productsApi + globalSettings.product.brand + 'logo', 
      formData, 
      {headers: headerPayload}
    ).then((res) => {
      if (res && res.data) {
        setBrand(res.data)
        setToastMessage("Logo image saved successfully")
        setShowLogoToast(true)
      } else {
        console.log("ERR SAVE LOGO")
        // display error
      }
      setLoadingLogo(false)
    }).catch((err) => {
      console.log(err)
      setLoadingLogo(false)
    })
  }

  const onLogoDelete = () => {
    if(!brand.logo)
      return

    setLoadingLogo(true)

    const data = {file: brand.logo}

    const headerPayload = {
      "Access-Control-Allow-Origin" : "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "delete",
      data: data,
      url: globalSettings.baseApiUrl + globalSettings.productsApi + globalSettings.product.brand + 'logo',
      headers: headerPayload
    }).then((res) => {
      if (res && res.data) {
        setBrand(res.data)
        setToastMessage("Logo image deleted successfully")
        setShowLogoToast(true)
      } else {
        console.log("ERR SAVE LOGO")
        // display error
      }
      setLoadingLogo(false)
    }).catch((err) => {
      console.log(err)
      setLoadingLogo(false)
    })
  }

  const onBrandChange = (e) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      setSelectedBrand(URL.createObjectURL(e.currentTarget.files[0]));
      setSelectedBrandFile(e.currentTarget.files[0]);
    }
  }

  const onBrandSave = () => {
    if(!selectedBrandFile)
      return

    setLoadingBrand(true)

    const formData = new FormData();
    formData.append('file', selectedBrandFile)

    const headerPayload = {
      "Access-Control-Allow-Origin" : "*",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios.post(
      globalSettings.baseApiUrl + globalSettings.productsApi + globalSettings.product.brand + 'brand', 
      formData, 
      {headers: headerPayload}
    ).then((res) => {
      if (res && res.data) {
        setBrand(res.data)
        setToastMessage("Card image saved successfully")
        setShowBrandToast(true)
      } else {
        console.log("ERR SAVE BRAND")
        // display error
      }
      setLoadingBrand(false)
    }).catch((err) => {
      console.log(err)
      setLoadingBrand(false)
    })
  }

  const onBrandDelete = () => {
    if(!brand.brand)
      return

    setLoadingBrand(true)

    const data = {file: brand.brand}

    const headerPayload = {
      "Access-Control-Allow-Origin" : "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "delete",
      data: data,
      url: globalSettings.baseApiUrl + globalSettings.productsApi + globalSettings.product.brand + 'brand',
      headers: headerPayload
    }).then((res) => {
      if (res && res.data) {
        setBrand(res.data)
        setToastMessage("Brand image deleted successfully")
        setShowBrandToast(true)
      } else {
        console.log("ERR SAVE LOGO")
        // display error
      }
      setLoadingBrand(false)
    }).catch((err) => {
      console.log(err)
      setLoadingBrand(false)
    })
  }

  const onFrameChange = (e) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      setSelectedFrame(URL.createObjectURL(e.currentTarget.files[0]));
      setSelectedFrameFile(e.currentTarget.files[0]);
    }
  }

  const onFrameSave = () => {
    if(!selectedFrameFile)
      return

    setLoadingFrame(true)

    const formData = new FormData();
    formData.append('file', selectedFrameFile)

    const headerPayload = {
      "Access-Control-Allow-Origin" : "*",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios.post(
      globalSettings.baseApiUrl + globalSettings.productsApi + globalSettings.product.brand + 'frame', 
      formData, 
      {headers: headerPayload}
    ).then((res) => {
      if (res && res.data) {
        setBrand(res.data)
        setToastMessage("Detail image saved successfully")
        setShowFrameToast(true)
      } else {
        console.log("ERR SAVE FRAME")
        // display error
      }
      setLoadingFrame(false)
    }).catch((err) => {
      console.log(err)
      setLoadingFrame(false)
    })
  }

  const onFrameDelete = () => {
    if(!brand.frame)
      return

    setLoadingFrame(true)

    const data = {
      file: brand.frame
    }

    const headerPayload = {
      "Access-Control-Allow-Origin" : "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "delete",
      data: data,
      url: globalSettings.baseApiUrl + globalSettings.productsApi + globalSettings.product.brand + 'frame',
      headers: headerPayload
    }).then((res) => {
      if (res && res.data) {
        setBrand(res.data)
        setToastMessage("Logo image deleted successfully")
        setShowFrameToast(true)
      } else {
        console.log("ERR SAVE LOGO")
        // display error
      }
      setLoadingFrame(false)
    }).catch((err) => {
      console.log(err)
      setLoadingFrame(false)
    })
  }

  const getWalletAddress = () => {
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

  const onSaveWalletAddress = (e) => {
    if(!e)
      return

    const headerPayload = {
        "Access-Control-Allow-Origin" : "*",
        "Content-type": "Application/json",
        "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "post",
      data: e,
      url: globalSettings.baseApiUrl + globalSettings.productsApi + globalSettings.product.createWallet,
      headers: headerPayload
    }).then((res) => {
      if (res && res.data) {
        getWalletAddress()
      } else {
        console.log("ERR ADD WALLET ADDRESS")
        // display error
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  const onDeleteWalletAddress = (e) => {
    if(!e)
      return

    const headerPayload = {
        "Access-Control-Allow-Origin" : "*",
        "Content-type": "Application/json",
        "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "delete",
      data: {'walletid': e},
      url: globalSettings.baseApiUrl + globalSettings.productsApi + globalSettings.product.wallet + e,
      headers: headerPayload
    }).then((res) => {
      if (res && res.data) {
        getWalletAddress()
      } else {
        console.log("ERR DELETE WALLET ADDRESS")
        // display error
      }
    }).catch((err) => {
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
            <Breadcrumb.Item active>Brand Info</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Brand Info</h4>
          <p className="mb-0">Details of your brand.</p>
        </div>
      </div>

      <Row>
        <div xs={12} xl={8}>
          <BrandInfoForm 
            brand={brand} 
            onSavePressed={onSaveBrandInfo} 
            showToast={showInfoToast} 
            toastMessage={toastMessage} 
            onToastClose={() => {setShowInfoToast(false)}}
            loading={loadingInfo}
          />
        </div>
        <div xs={12} xl={8}>
          <WalletAddressForm 
            walletAddresses={walletAddresses}
            onAddPressed={onSaveWalletAddress}
            removeWalletAddress={onDeleteWalletAddress}
          />
        </div>
        <div xs={12} xl={4}>
          <Row>
            <Col xs={12}>
              <ChooseImageComponent
                id="logo"
                title="Select logo image"
                firstLine="Upload your brand's logo"
                secondLine="JPG, GIF or PNG. Max size of 2 MB"
                photo={selectedLogo}
                onSavePressed={onLogoSave}
                onImageChange={onLogoChange}
                showToast={showLogoToast} 
                toastMessage={toastMessage} 
                onToastClose={() => {setShowLogoToast(false)}}
                onDelete={onLogoDelete}
                loading={loadingLogo}
              />
            </Col>
            <Col xs={12}>
              <ChooseImageComponent
                id="brand"
                title="Select card image"
                firstLine="Upload your brand's card image"
                secondLine="JPG, GIF or PNG. Max size of 2 MB"
                photo={selectedBrand}
                onSavePressed={onBrandSave}
                onImageChange={onBrandChange}
                showToast={showBrandToast} 
                toastMessage={toastMessage} 
                onToastClose={() => {setShowBrandToast(false)}}
                onDelete={onBrandDelete}
                loading={loadingBrand}
              />
            </Col>
            <Col xs={12}>
              <ChooseImageComponent
                id="frame"
                title="Select detail image"
                firstLine="Upload your brand's detail image"
                secondLine="JPG, GIF or PNG. Max size of 2 MB"
                photo={selectedFrame}
                onSavePressed={onFrameSave}
                onImageChange={onFrameChange}
                showToast={showFrameToast} 
                toastMessage={toastMessage} 
                onToastClose={() => {setShowFrameToast(false)}}
                onDelete={onFrameDelete}
                loading={loadingFrame}
              />
            </Col>
          </Row>
        </div>
      </Row>
    </>
  );
};
