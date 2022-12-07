import { UploadIcon, DotsHorizontalIcon, PlusIcon } from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Form, Button, Toast, ToastContainer, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Routes } from "routes";
import Datetime from "react-datetime";
import moment from "moment-timezone";

export const AuctionForm = (props) => {
  const {
    nftId,
    auction,
    onSavePressed,
    showToast = false,
    toastMessage = "",
    onToastClose = () => { },
    loading = false
  } = props;

  const [name, setName] = useState("")
  const [basePrice, setBasePrice] = useState("")
  const [description, setDescription] = useState("")
  const [expiry, setExpiry] = useState("")

  useEffect(() => {
    if (!auction)
      return

    setName(auction.name ? auction.name : "")
    setBasePrice(auction.basePrice ? auction.basePrice : "")
    setDescription(auction.description ? auction.description : "")
    setExpiry(auction.expiry ? auction.expiry : "")
  }, [auction])

  const onSubmit = (e) => {
    e.preventDefault()
    const info = {
      'name': name,
      'basePrice': basePrice,
      'description': description,
      'expiry': expiry,
      'nftId': nftId
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
          <h5 className="mb-4">Auction information</h5>
          <Form onSubmit={onSubmit}>
            <Row>
              <Col xs={4}>
                <Form.Group id="name" className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control required type="text" placeholder="Enter the auction name" value={name} onChange={(e) => { setName(e.target.value) }} />
                </Form.Group>
              </Col>
              <Col xs={4}>
                <Form.Group id="basePrice" className="mb-3">
                  <Form.Label>Base Price</Form.Label>
                  <Form.Control required type="number" placeholder="Enter the base price" value={basePrice} onChange={(e) => { setBasePrice(e.target.value) }} />
                </Form.Group>
              </Col>
              <Col xs={4}>
                <Form.Group id="expiry" className="mb-3">
                  <Form.Label>Expiration Date</Form.Label>
                  <Datetime
                    timeFormat={true}
                    closeOnSelect={false}
                    onChange={setExpiry}
                    renderInput={(props, openCalendar) => (
                      <Form.Control required type="text" placeholder="Enter the expiration date" value={expiry ? moment(expiry).format("DD/MM/YYYY HH:mm") : ""}
                        onFocus={openCalendar}
                        onChange={() => { }} />
                    )}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Form.Group id="description" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control required as="textarea" type="text" placeholder="Enter the description" value={description} onChange={(e) => { setDescription(e.target.value) }} />
                </Form.Group>
              </Col>
            </Row>

            <div className="mt-3">
              <Button variant="gray-800" type="submit" className="animate-up-2 me-3">
                {loading ?
                  <DotsHorizontalIcon className="icon icon-xs text-white" />
                  :
                  'Save'
                }
              </Button>
              <Button as={Link} variant="secondary" to={{ pathname: Routes.Auctions.path, state: { nftId: nftId } }} className="animate-up-2">
                Back
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};