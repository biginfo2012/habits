import React, { useEffect, useState } from "react";
import { HomeIcon, PlusIcon } from "@heroicons/react/solid";
import { Col, Row, Breadcrumb, Button } from 'react-bootstrap';

import { ChooseImageComponent } from "components/habits/ChooseImageComponent";
import { useLogin } from "contexts/ApplicationContext";
import { globalSettings } from "misc/globals";
import axios from "axios";
import { ProductInfoForm } from "components/habits/ProductInfoForm";
import { ChooseMultipleImagesComponent } from "components/habits/ChooseMultipleImagesComponent";
import { Link, useLocation, withRouter } from "react-router-dom";
import { ChooseEffectComponent } from "components/habits/ChooseEffectComponent";
import { Routes } from "routes";


export default () => {
  let location = useLocation()
  let { productFromProps, isNewVariantFromProps } = location != undefined && location.state != undefined ? location.state : ""

  const { user, userInfo } = useLogin();

  const [ refresh, setRefresh ] = useState(0)

  const [ isEditProduct, setIsEditProduct ] = useState(productFromProps ? true : false)
  const [ isNewVariant, setIsNewVariant ] = useState(isNewVariantFromProps ? true : false)

  const [ product, setProduct ] = useState(isEditProduct ? productFromProps : "")

  const [ selectedMainImage, setSelectedMainImage ] = useState(null)
  const [ selectedMainImageFile, setSelectedMainImageFile ] = useState(null)
  const [ selectedImages, setSelectedImages ] = useState([])
  const [ selectedImagesFiles, setSelectedImagesFiles ] = useState([])
  const [ selectedEffect, setSelectedEffect ] = useState(null)
  const [ selectedEffectFile, setSelectedEffectFile ] = useState(null)

  const [toastMessage, setToastMessage] = useState("");
  const [showInfoToast, setShowInfoToast] = useState(false);
  const [showMainImageToast, setShowMainImageToast] = useState(false);
  const [showImagesToast, setShowImagesToast] = useState(false);
  const [showEffectToast, setShowEffectToast] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [loadingMainImage, setLoadingMainImage] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [loadingEffect, setLoadingEffect] = useState(false);

  const [ imagesToDelete, setImagesToDelete ] = useState([])

  useEffect(() => {
    console.log(product)
    if(product)
    {
      setSelectedMainImage(product.image)
      setSelectedImages([...product.imageList])
      const files = []
      product.imageList.map(i => files.push(new File([], i.name)))
      setSelectedImagesFiles(files)
      setSelectedEffect(product.effectUrl)
    }
  },[product])

  // #region Product info methods

  const onSaveProductInfo = (e) => {
    if(!e)
      return

    e.brandId = user.brand

    setLoadingInfo(true)

    if(isNewVariant)
      postNewVariant(e)
    else if(isEditProduct)
      patchProductInfo(e)
    else
      postProductInfo(e)
  }

  const postProductInfo = (data) => {
    const headerPayload = {
      "Access-Control-Allow-Origin" : "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "post",
      data: data,
      url: globalSettings.baseApiUrl + globalSettings.productsApi,
      headers: headerPayload
    }).then((res) => {
      if (res && res.data) {
        setIsEditProduct(true)
        setProduct(res.data)
        setToastMessage("Product information saved successfully")
        setShowInfoToast(true)
      } else {
        console.log("ERR POST BRAND")
        console.log(res)
        // display error
      }
      setLoadingInfo(false)
    }).catch((err) => {
      console.log(err)
      setLoadingInfo(false)
    })
  }

  const patchProductInfo = (data) => {
    const headerPayload = {
      "Access-Control-Allow-Origin" : "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "patch",
      data: data,
      url: globalSettings.baseApiUrl + globalSettings.productsApi + '/' + product._id,
      headers: headerPayload
    }).then((res) => {
      if (res && res.data) {
        setProduct(res.data)
        setToastMessage("Product information saved successfully")
        setShowInfoToast(true)
      } else {
        console.log("ERR PATCH BRAND")
        console.log(res)
        // display error
      }
      setLoadingInfo(false)
    }).catch((err) => {
      console.log(err)
      setLoadingInfo(false)
    })
  }

  const postNewVariant = (data) => {
    const headerPayload = {
      "Access-Control-Allow-Origin" : "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "post",
      data: data,
      url: globalSettings.baseApiUrl + globalSettings.productsApi + globalSettings.product.createVariant + product._id,
      headers: headerPayload
    }).then((res) => {
      if (res && res.data) {
        setIsEditProduct(true)
        setProduct(res.data)
        setIsNewVariant(false)
        setToastMessage("Product variant created successfully")
        setShowInfoToast(true)
      } else {
        console.log("ERR POST BRAND")
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

  // #region Image list methods

  const onImagesChange = (e) => {
    if (e.currentTarget.files && e.currentTarget.files.length > 0) {
      let filesUrl = selectedImages;
      let files = selectedImagesFiles;
      Array.from(e.currentTarget.files).forEach(
        f => {
          filesUrl.push({name: f.name, image: URL.createObjectURL(f)})
          files.push(f)
        })
      setSelectedImages(filesUrl)
      setSelectedImagesFiles(files);
      setRefresh(refresh+1)
    }
  }

  const onImagesSave = async () => {
    if(!selectedImagesFiles || selectedImagesFiles.length < 0 )
      return

    setLoadingImages(true)

    if(imagesToDelete.length > 0 ) {
      deleteDBImages()
    }

    saveImagesOnDB()
  }

  const deleteDBImages = () => {
    if(!imagesToDelete || imagesToDelete.length <= 0)
      return

    setLoadingImages(true)

    const headerPayload = {
      "Access-Control-Allow-Origin" : "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    const imageNames = imagesToDelete.map(x => x.name)
    const data = {file: imageNames}
    console.log("data")
    console.log(data)
    axios({
      method: "delete",
      data: data,
      url: globalSettings.baseApiUrl + globalSettings.productsApi + globalSettings.product.imageList + product._id,
      headers: headerPayload
    }).then((res) => {
      if (res && res.data) {
        console.log("res")
        console.log(res)
        setProduct(res.data)
        setToastMessage("Image(s) deleted successfully from list")
        setShowImagesToast(true)
      } else {
        console.log("ERR DELETE FILELIST")
        // display error
      }
      setLoadingImages(false)
    }).catch((err) => {
      console.log("err")
      console.log(err)
      setLoadingImages(false)
    })
  }

  const saveImagesOnDB = async () => {
    const filesToSave = []
    selectedImagesFiles.map(
      x => {
        if(x.size > 0) 
          filesToSave.push(x)
      }
    )

    const headerPayload = {
      "Access-Control-Allow-Origin" : "*",
      "Authorization": `Bearer ${userInfo.token}`,
    }

    let i = 0
    let success = true
    let latestProd = null
    while (i < filesToSave.length && success) {
      const formData = new FormData();
      formData.append('file', filesToSave[i])
      let res = await axios.post(
        globalSettings.baseApiUrl + globalSettings.productsApi + globalSettings.product.imageList + product._id, 
        formData, 
        {headers: headerPayload}
      )
      if(res) {
        console.log(res)
        if (res && res.data) {
          latestProd = res.data
          i++
        } else {
          console.log("ERR SAVE IMAGE")
          success = false
          // display error
        }
      } else {
        console.log("Response error")
        success = false
      }
    }

    if(success){
      setProduct(latestProd)
      setToastMessage("Image(s) uploaded successfully")
      setShowImagesToast(true)
    } else {
      console.log("ERROR SAVING IMAGE LIST")
    }

    setLoadingImages(false)
  }

  const onImagesClearAll = () => {
    if(loadingImages)
      return

    setSelectedImages([])
    setSelectedImagesFiles([])
    if(isEditProduct && product.imageList)
      setImagesToDelete([...product.imageList])
  }

  const onDeleteSingleImage = (imageObj, index) => {
    if(loadingImages)
      return

    if(isEditProduct && product.imageList && product.imageList.find(x => x.name === imageObj.name) !== undefined) {
      let imgs = imagesToDelete
      imgs.push(imageObj)
      setImagesToDelete(imgs)
    }

    const images = selectedImages
    images.splice(index, 1)
    setSelectedImages(images)

    const files = selectedImagesFiles
    files.splice(index, 1)
    setSelectedImagesFiles(files)

    setRefresh(refresh+1)
  }

  // #endregion

  // #region Main image methods

  const onMainImageChange = (e) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      setSelectedMainImage(URL.createObjectURL(e.currentTarget.files[0]));
      setSelectedMainImageFile(e.currentTarget.files[0]);
    }
  }

  const onMainImageSave = () => {
    if(!selectedMainImageFile)
      return

    setLoadingMainImage(true)

    const formData = new FormData();
    formData.append('file', selectedMainImageFile)

    const headerPayload = {
      "Access-Control-Allow-Origin" : "*",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios.post(
      globalSettings.baseApiUrl + globalSettings.productsApi + globalSettings.product.image + product._id, 
      formData, 
      {headers: headerPayload}
    ).then((res) => {
      if (res && res.data) {
        setProduct(res.data)
        setToastMessage("Logo image saved successfully")
        setShowMainImageToast(true)
      } else {
        console.log("ERR SAVE LOGO")
        // display error
      }
      setLoadingMainImage(false)
    }).catch((err) => {
      console.log(err)
      setLoadingMainImage(false)
    })
  }

  const onMainImageDelete = () => {
    if(!selectedMainImage)
      return

    setLoadingMainImage(true)

    const data = {file: product.imageName}

    const headerPayload = {
      "Access-Control-Allow-Origin" : "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "delete",
      data: data,
      url: globalSettings.baseApiUrl + globalSettings.productsApi + globalSettings.product.image + product._id,
      headers: headerPayload
    }).then((res) => {
      if (res && res.data) {
        setProduct(res.data)
        setToastMessage("Logo image deleted successfully")
        setShowMainImageToast(true)
      } else {
        console.log("ERR SAVE LOGO")
        // display error
      }
      setLoadingMainImage(false)
    }).catch((err) => {
      console.log(err)
      setLoadingMainImage(false)
    })
  }

  // #endregion

  // #region Effects methods

  const onEffectChange = (e) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      setSelectedEffect(URL.createObjectURL(e.currentTarget.files[0]));
      setSelectedEffectFile(e.currentTarget.files[0]);
    }
  }

  const onEffectSave = () => {
    if(!selectedEffectFile)
      return

    setLoadingEffect(true)

    const formData = new FormData();
    formData.append('file', selectedEffectFile)

    const headerPayload = {
      "Access-Control-Allow-Origin" : "*",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios.post(
      globalSettings.baseApiUrl + globalSettings.productsApi + globalSettings.product.effect + product._id, 
      formData, 
      {headers: headerPayload}
    ).then((res) => {
      if (res && res.data) {
        setProduct(res.data)
        setToastMessage("3D model saved successfully")
        setShowEffectToast(true)
      } else {
        console.log("ERR SAVE 3D MODEL")
        // display error
      }
      setLoadingEffect(false)
    }).catch((err) => {
      console.log(err)
      setLoadingEffect(false)
    })
  }

  const onEffectDelete = () => {
    if(!selectedEffect)
      return

    setLoadingEffect(true)

    const data = {file: product.effectName}

    const headerPayload = {
      "Access-Control-Allow-Origin" : "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "delete",
      data: data,
      url: globalSettings.baseApiUrl + globalSettings.productsApi + globalSettings.product.effect + product._id,
      headers: headerPayload
    }).then((res) => {
      if (res && res.data) {
        setProduct(res.data)
        setToastMessage("3D model deleted successfully")
        setShowEffectToast(true)
      } else {
        console.log("ERR DELETE 3D MODEL")
        // display error
      }
      setLoadingEffect(false)
    }).catch((err) => {
      console.log(err)
      setLoadingEffect(false)
    })
  }

  // #endregion
  
  const onNewVariantClick = () => {
    setIsNewVariant(true)
    setRefresh(refresh+1)
  }

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><HomeIcon className="icon icon-xs" /></Breadcrumb.Item>
            <Breadcrumb.Item>Habits</Breadcrumb.Item>
            <Breadcrumb.Item active>Product Info</Breadcrumb.Item>
          </Breadcrumb>
          <h4>{isNewVariant ? "New Product Variant" : (isEditProduct ? "Edit Product" : "New Product")}</h4>
          <p className="mb-0">Details of your product.</p>
        </div>
        { !isNewVariant && isEditProduct &&
          <div className="btn-toolbar mb-2 mb-md-0">
            {/* <Button as={Link} variant="gray-800" size="sm" className="d-inline-flex align-items-center" to={{pathname: Routes.Product.path, state: {productFromProps: product, isNewVariantFromProps: true}}}> */}
            <Button onClick={() => onNewVariantClick()} variant="gray-800" size="sm" className="d-inline-flex align-items-center" >
              <PlusIcon className="icon icon-xs me-2" /> New Variant
            </Button>
          </div>
        }
      </div>
      <Row>
        <div xs={12} xl={8}>
          <ProductInfoForm 
            product={product} 
            onSavePressed={onSaveProductInfo} 
            showToast={showInfoToast} 
            toastMessage={toastMessage} 
            onToastClose={() => {setShowInfoToast(false)}}
            loading={loadingInfo}
            isNewVariant={isNewVariant}
          />
        </div>
        {product && !isNewVariant && <div xs={12} xl={4}>
          <Row>
            <Col xs={12}>
              <ChooseImageComponent
                id="mainImage"
                title="Select product's main image"
                firstLine="Upload your product's main image"
                secondLine="JPG, GIF or PNG. Max size of 2 MB"
                photo={selectedMainImage}
                onSavePressed={onMainImageSave}
                onImageChange={onMainImageChange}
                showToast={showMainImageToast} 
                toastMessage={toastMessage} 
                onToastClose={() => {setShowMainImageToast(false)}}
                onDelete={onMainImageDelete}
                loading={loadingMainImage}
              />
              <ChooseMultipleImagesComponent
                id="images"
                title="Select product's other images"
                firstLine="Upload your product's other images"
                secondLine="JPG, GIF or PNG. Max size of 2 MB"
                photos={selectedImages}
                onSavePressed={onImagesSave}
                onImageChange={onImagesChange}
                showToast={showImagesToast} 
                toastMessage={toastMessage} 
                onToastClose={() => {setShowImagesToast(false)}}
                onDelete={() => onImagesClearAll()}
                onDeleteImage={onDeleteSingleImage}
                loading={loadingImages}
              />
              <ChooseEffectComponent
                id="effect"
                title="Select product's try on 3D model"
                firstLine="Upload your product's 3D model"
                secondLine="FBX or OBJ. Max size of 2 MB"
                fileUrl={selectedEffect}
                onSavePressed={onEffectSave}
                onEffectChange={onEffectChange}
                showToast={showEffectToast} 
                toastMessage={toastMessage} 
                onToastClose={() => {setShowEffectToast(false)}}
                onDelete={onEffectDelete}
                loading={loadingEffect}
              />
            </Col>
          </Row>
        </div>}
      </Row>
    </>
  );
};
