import { UploadIcon, DotsHorizontalIcon, PlusIcon } from "@heroicons/react/solid";
import { useLogin } from "contexts/ApplicationContext";
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Form, Button, Toast, ToastContainer } from 'react-bootstrap';
import { NewSizeModal } from "./NewSizeModal";
import { SizesTable } from "./SizesTable";

export const ProductInfoForm = (props) => {
  const { 
    product, 
    onSavePressed, 
    showToast = false, 
    toastMessage = "", 
    onToastClose=()=>{}, 
    loading=false,
    isNewVariant=false 
  } = props;

  const [refresh, setRefresh] = useState(0)

  const { categories } = useLogin();

  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [attributeName, setAttributeName] = useState("")
  const [attributeValue, setAttributeValue] = useState("")
  const [cloneImages, setCloneImages] = useState(false)

  const [sizes, setSizes] = useState([])

  useEffect(()=>{
    if(!product)
      return

    setName(product.title ? product.title : "")
    setCode(product.code ? product.code : "")
    setPrice(product.price ? product.price : "")
    setDescription(product.description ? product.description : "")
    setCategory(product.categoryId ? product.categoryId : "")
    setAttributeName(product.attributeName ? product.attributeName : "")
    setAttributeValue(product.attributeValue ? product.attributeValue : "")
    setSizes(product.sizes ? product.sizes : "")
  }, [product])

  const onSubmit = () => {
    const info = {
      'title': name,
      'code': code,
      'price': price,
      'description': description,
      'categoryId': category,
      'attributeName': attributeName,
      'attributeValue': attributeValue,
      'sizes': sizes,
    }
    if(isNewVariant)
      info.cloneImages = cloneImages
      
    onSavePressed(info)
  }

  const [showNewSizeModal, setShowNewSizeModal] = useState(false);

  const toggleNewSizeModal = () => {
    setShowNewSizeModal(!showNewSizeModal);
  };
  
  const handleNewSize = (size) => {
    let s = sizes;
    s.push(size)
    setSizes(s)
    toggleNewSizeModal()
  };

  const deleteSize = (sizeLabel) => {
    sizes.splice(sizes.findIndex(x => x.size == sizeLabel), 1)
    setRefresh(refresh+1)
  }
  

  return (
    <>
    {showNewSizeModal && (
      <NewSizeModal
        show={showNewSizeModal}
        onHide={toggleNewSizeModal}
        onSubmit={handleNewSize}
      />
    )}
    <Card border="0" className="shadow mb-4">
      <ToastContainer style={{zIndex:100}} position="bottom-center" className="p-3">
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
        <h5 className="mb-4">Product information</h5>
        <Form onSubmit={onSubmit}>
          <Row>
            <Col xs={4}>
              <Form.Group id="name" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control required type="text" placeholder="Enter your product name" value={name} onChange={(e) => {setName(e.target.value)}} />
              </Form.Group> 
            </Col>
            <Col xs={4}>
              <Form.Group id="code" className="mb-3">
                <Form.Label>Code</Form.Label>
                <Form.Control required type="text" placeholder="Enter your product code" value={code} onChange={(e) => {setCode(e.target.value)}} />
              </Form.Group>
            </Col>
            <Col xs={4}>
              <Form.Group id="price" className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control required type="text" placeholder="Enter your product price" value={price} onChange={(e) => {setPrice(e.target.value)}} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Form.Group id="description" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control required as="textarea" type="text" placeholder="Enter your product description" value={description} onChange={(e) => {setDescription(e.target.value)}} />
            </Form.Group>
          </Row>
          <Row>
            <Col xs={6}>
              <Form.Group id="attributeName" className="mb-3">
                <Form.Label>Variant Name</Form.Label>
                <Form.Control required type="text" placeholder="Enter variant name" value={attributeName} onChange={(e) => {setAttributeName(e.target.value)}} />
              </Form.Group> 
            </Col>
            <Col xs={6}>
              <Form.Group id="attributeValue" className="mb-4">
                <Form.Label>Variant HEX Color</Form.Label>
                <Form.Control required type="text" placeholder="#FFFFFF" value={attributeValue} onChange={(e) => {setAttributeValue(e.target.value)}} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <Form.Group id="category" className="mb-3">
                <Form.Label>Category</Form.Label>
                  <Form.Select value={category} className="ms-3 fmxw-200 d-none d-md-inline" onChange={(e) => {setCategory(e.target.value)}}>
                    {
                      categories && categories.length > 0 &&
                      categories.map(c => {
                        return (<option key={c._id} value={c._id}>{c.name}</option>)
                      })
                    }
                  </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group id="sizes" className="mb-3">
                <Row className="mb-3">
                  <Col xs={4}>
                    <Form.Label>Sizes</Form.Label>
                  </Col>
                  <Col xs={8}>
                  <Button variant="gray-800" size="sm" className="d-inline-flex align-items-center float-end" onClick={() => toggleNewSizeModal()}>
                    <PlusIcon className="icon icon-xs me-2" /> New Size
                  </Button>
                  </Col>
                </Row>
                { sizes && sizes.length > 0 && <SizesTable sizes={sizes} deleteSize={(sizeLabel) => deleteSize(sizeLabel)} /> }
              </Form.Group>
            </Col>
          </Row>
          {isNewVariant && 
            <Row>
              <Col xs={12}>
                <Form.Check 
                  type={"checkbox"}
                  id={'cloneImages'}
                  label={"Clone base product images"}
                  checked={cloneImages}
                  onChange={() => setCloneImages(!cloneImages)}
                />
              </Col>
            </Row>
          }
          <div className="mt-3">
            <Button variant="gray-800" type="submit" className="mt-2 animate-up-2">
              {loading ?
                <DotsHorizontalIcon className="icon icon-xs text-white" />
                :
                'Save'
              }
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
    </>
  );
};