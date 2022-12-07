import { UploadIcon, DotsHorizontalIcon, PlusIcon } from "@heroicons/react/solid";
import { useLogin } from "contexts/ApplicationContext";
import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Card, Form, Button, Toast, ToastContainer, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Routes } from "routes";

export const NFTForm = (props) => {
  const {
    nft,
    onSavePressed,
    showToast = false,
    toastMessage = "",
    onToastClose = () => { },
    loading = false,
    isEditNFT = false,
    walletAddresses
  } = props;

  const { categories } = useLogin();

  const [name, setName] = useState("")
  const [imageName, setImageName] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [description, setDescription] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const inputRef = useRef(null);  

  useEffect(() => {
    if (!nft)
      return

    setName(nft.name ? nft.name : "")
    setImageName(nft.imageName ? nft.imageName : "")
    setWalletAddress(nft.walletAddress ? nft.walletAddress : "")
    setDescription(nft.description ? nft.description : "")
    setImagePreview(nft.urlAsset ? nft.urlAsset : "")

  }, [nft])

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleFileChange = event => {
    const fileObj = event.target.files && event.target.files[0] ? event.target.files[0] : null;    
    
    if (fileObj) {
      setImageName(fileObj.name)
      setSelectedImage(fileObj)
      setImagePreview(URL.createObjectURL(fileObj));
      return;
    }
  };

  const onSubmit = (e) => {
    e.preventDefault()

    const info = {
      'walletAddress': walletAddress,
      'name': name,
      'description': description,
      'image': selectedImage
    }
    
    onSavePressed(info)
  }

  return (
    <>
      <Card border="0" className="shadow mb-4">
        <ToastContainer style={{ zIndex: 100 }} position="bottom-center" className="p-3">
          <Toast show={showToast} delay={3000} autohide className="bg-success my-3 ml-3" onClose={onToastClose}>
            <Toast.Header className="text-primary" closeButton={true}>
              <UploadIcon className="icon icon-xs text-gray-800" />
              <strong className="me-auto ms-2 text-gray-800">Success</strong>
            </Toast.Header>
            <Toast.Body className="text-white">
              {toastMessage}
            </Toast.Body>
          </Toast>
        </ToastContainer>
        <Card.Body>
          <h5 className="mb-4">NFT information</h5>
          <Form onSubmit={onSubmit}>
            <Row>
              <Col lg={8} xs={12}>
                <Form.Group id="name" className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control required type="text" placeholder="Title" value={name} onChange={(e) => { setName(e.target.value) }} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={8} xs={12}>
                <Form.Group id="image" className="mb-3">
                  <Form.Label>Image</Form.Label>
                  <Form.Control accept=".png,.jpg,.jpeg,.gif" type="file" ref={inputRef} className="d-none" onChange={handleFileChange}/>
                  <div className="d-flex">
                    <Form.Control type="text" placeholder="Asset(input file)" value={imageName} disabled/>
                    <Button style={{ 'min-width':'170px' }} className="btn btn-info" onClick={handleClick} >Pick file from PC</Button>
                  </div>
                </Form.Group>
              </Col>
            </Row>
            {
              imagePreview ? <Row className="mb-3">
                <Col xs={6}>
                  <Image src={imagePreview} width="300" />
                </Col>
              </Row> : ""
            }
            <Row>
              <Col lg={8} xs={12}>
                <Form.Group id="walletAddressList" className="mb-3">
                  <Form.Label>Wallet Addresses</Form.Label>
                  <Form.Select required value={walletAddress} className="d-none d-md-inline" onChange={(e) => { setWalletAddress(e.target.value) }}>
                    <option value="" disabled>Select existing wallet address</option>
                    {
                      walletAddresses && walletAddresses.length > 0 &&
                      walletAddresses.map(c => {
                        return (<option key={c._id} value={c.walletAddress}>{c.walletAddress}</option>)
                      })
                    }
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={8} xs={12}>
                <Form.Group id="description" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control required as="textarea" type="text" value={description} placeholder="Enter your description" onChange={(e) => { setDescription(e.target.value) }} />
                </Form.Group>
              </Col>
            </Row>

            <div className="mt-3">
              <Button variant="gray-800" type="submit" className="animate-up-2 me-3" disabled={isEditNFT}>
                {loading ?
                  <DotsHorizontalIcon className="icon icon-xs text-white" />
                  :
                  'Save'
                }
              </Button>
              <Button as={Link} variant="secondary" to={Routes.NFTs.path} className="animate-up-2">
                Back
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};