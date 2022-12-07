
import React from "react";
import { ArrowNarrowLeftIcon, LockClosedIcon } from "@heroicons/react/solid";
import { Col, Row, Form, Card, Button, Container, InputGroup } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import axios from "axios";
import { globalSettings } from "../../misc/globals";
import { toast } from 'react-toastify'

import { Routes } from "routes";

const ResetPassword = () => {
  let history = useHistory()
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      email: e.target.email.value.toLowerCase(),
      newPassword: e.target.password.value,
      newPasswordToken: e.target.code.value
    }
    
    axios({
      method: "post",
      data: data,
      url: globalSettings.baseApiUrl + globalSettings.authApi + globalSettings.auth.resetPassword
    }).then((res) => {
      if (res ) {
          //const brandResult = res.data
          //setBrands(brandResult.map(u => ({ ...u, isSelected: false, show: true })))
          //setRefresh(refresh+1)
          toast.success('Password changed successfully', {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
          history.push('/login')
      } else {
              toast.error('Error when changing password', {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
          }
    }).catch((err) => {
      toast.error('Error when changing password', {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
    })
  }

  return (
    <main>
      <section className="vh-lg-100 mt-5 mt-lg-0 bg-soft d-flex align-items-center">
        <Container>
          <Row className="justify-content-center">
            <p className="text-center">
              <Card.Link as={Link} to={Routes.Signin.path} className="d-flex align-items-center justify-content-center">
                <ArrowNarrowLeftIcon className="icon icon-xs me-2" /> Back to sign in
              </Card.Link>
            </p>
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="bg-white shadow border-0 rounded p-4 p-lg-5 w-100 fmxw-500">
                <h3 className="mb-4">Reset password</h3>
                <Form onSubmit={handleSubmit}>
                  <Form.Group id="email" className="mb-4">
                    <Form.Label>Your Email</Form.Label>
                    <InputGroup>
                      <Form.Control required type="email" placeholder="example@company.com" name="email"/>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group id="code" className="mb-4">
                    <Form.Label>OTP code</Form.Label>
                    <InputGroup>
                      <Form.Control required type="text" placeholder="code" name="code"/>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group id="password" className="mb-4">
                    <Form.Label>Your New Password</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <LockClosedIcon className="icon icon-xs text-gray-600" />
                      </InputGroup.Text>
                      <Form.Control required type="password" placeholder="Password" name="password"/>
                    </InputGroup>
                  </Form.Group>
                  <div className="d-grid">
                    <Button variant="primary" type="submit">
                      Reset password
                    </Button>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default ResetPassword