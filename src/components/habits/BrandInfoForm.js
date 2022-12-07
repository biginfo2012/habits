import { UploadIcon, DotsHorizontalIcon } from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
import { Row, Card, Form, Button, Toast, ToastContainer } from 'react-bootstrap';

export const BrandInfoForm = (props) => {
  const { brand, onSavePressed, showToast = false, toastMessage = "", onToastClose=()=>{}, loading=false } = props;

  const [name, setName] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  useEffect(()=>{
    setName(brand && brand.name ? brand.name : "")
    setTitle(brand && brand.title ? brand.title : "")
    setDescription(brand && brand.description ? brand.description : "")
  }, [brand])

  const onSubmit = (e) => {
    e.preventDefault()
    const info = {
      'name': name,
      'title': title,
      'description': description
    }
    onSavePressed(info)
  }

  

  return (
    <Card border="0" className="shadow mb-4">
      <ToastContainer style={{zIndex: 100}} position="bottom-center" className="p-3">
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
        <h5 className="mb-4">General brand information</h5>
        <Form onSubmit={onSubmit}>
          <Row>
            <Form.Group id="brandName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control required type="text" placeholder="Enter your brand name" value={name} onChange={(e) => {setName(e.target.value)}} />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group id="brandTitle" className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control required as="textarea" type="text" placeholder="Enter your brand title" value={title} onChange={(e) => {setTitle(e.target.value)}} />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group id="brandDescription" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control required as="textarea" type="text" placeholder="Enter your brand description" value={description} onChange={(e) => {setDescription(e.target.value)}} />
            </Form.Group>
          </Row>
          
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
  );
};