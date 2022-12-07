
import React from "react";
import { ArrowNarrowLeftIcon } from "@heroicons/react/solid";
import { Col, Row, Form, Card, Button, Container, InputGroup } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';

import { Routes } from "routes";
import { StatusCodes } from "http-status-codes";
import axios from "axios";
import { globalSettings } from "../../misc/globals";
import { toast } from 'react-toastify'


const ForgotPassword = (props) => {
  let history = useHistory()
  const handleSubmit = (e) => {
    e.preventDefault();
    
    axios({
      method: "get",
      url: globalSettings.baseApiUrl + globalSettings.authApi + globalSettings.auth.forgotPassword + e.target.email.value.toLowerCase(),
    }).then((res) => {
      if (res && res.status === StatusCodes.OK) {
        history.push('/reset-password')
        //navigation.navigate('ConfirmEmail', {from: 'ForgotPassword', email: email})
        console.log( "email inviata")
      } else {
        toast.error('Error while sending the mail', {
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
      toast.error('Error while sending the mail', {
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
              <div className="signin-inner my-3 my-lg-0 bg-white shadow border-0 rounded p-4 p-lg-5 w-100 fmxw-500">
                <h3>Forgot your password?</h3>
                <p className="mb-4">Don't fret! Just type in your email and we will send you a code to reset your password!</p>
                <Form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <Form.Label htmlFor="email">Your Email</Form.Label>
                    <InputGroup id="email">
                      <Form.Control required autoFocus type="email" placeholder="john@company.com" name="email" />
                    </InputGroup>
                  </div>
                  <div className="d-grid">
                    <Button variant="gray-800" type="submit">
                      Recover password
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

export default ForgotPassword
