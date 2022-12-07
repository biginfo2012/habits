import React, { useEffect, useState } from "react";
import { Row, Card, Form, Button, Toast, ToastContainer, Col } from 'react-bootstrap';

export const WalletAddressForm = (props) => {
  const { walletAddresses, onAddPressed, removeWalletAddress } = props;

  const [name, setName] = useState("")
  const [walletAddress, setWalletAddress] = useState("")

  useEffect(()=>{
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
    const info = {
      'name': name,
      'walletAddress': walletAddress
    }

    onAddPressed(info)
  }

  return (
    <Card border="0" className="shadow mb-4">
        
        <Card.Body>
            <h5 className="mb-4">Wallet Addresses</h5>
            {walletAddresses.map(u => 
                <Row className="mt-2">
                    <Col lg={2} xs={12}>
                        <Form.Control type="text" placeholder="" value={u.name} disabled />
                    </Col>
                    <Col lg={4} xs={12}>
                    <Form.Control type="text" placeholder="" value={u.walletAddress} disabled />
                    </Col>
                    <Col lg={2} xs={12}>
                        <Button type="button" className="animate-up-2 btn btn-danger" onClick={() => removeWalletAddress(u._id)}>Remove</Button>
                    </Col> 
                </Row>
            )}
            <Form onSubmit={onSubmit}>
                <Row className="mt-4">
                    <Col lg={2} xs={12}>
                        <Form.Control required type="text" placeholder="Enter new name" onChange={(e) => {setName(e.target.value)}} />
                    </Col>
                    <Col lg={4} xs={12}>
                        <Form.Control required type="text" placeholder="Enter new wallet address" onChange={(e) => {setWalletAddress(e.target.value)}} />
                    </Col>
                    <Col lg={2} xs={12}>
                        <Button type="submit" className="animate-up-2 btn btn-info">+Add address</Button>
                    </Col>                
                </Row>
            </Form>
        </Card.Body>
    </Card>
  );
};