
import React from "react";
import { LockClosedIcon, MailIcon } from "@heroicons/react/solid";
import { Col, Row, Form, Card, Button, FormCheck, Container, InputGroup } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios'; 
import { globalSettings } from '../../misc/globals';
import jwt_decode from "jwt-decode";
import { StatusCodes } from 'http-status-codes';

import { Routes } from "routes";
import BgImage from "assets/img/illustrations/signin.svg";

import { toast } from 'react-toastify'
import { useLogin } from "../../contexts/ApplicationContext";

const Signin = () => {

  let history = useHistory();
  const { setUserInfo, setUser } = useLogin()

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      email: e.target.email.value,
      password: e.target.password.value
    }

    axios({
      method: "post",
      data: data,
      url: globalSettings.baseApiUrl + globalSettings.authApi + globalSettings.user.login
    }).then((res) => {
      if (res && res.status === StatusCodes.CREATED) {
        if (res.data && res.data.accessToken) {
          const token = res.data.accessToken
          localStorage.setItem('token', token)

          var decoded = jwt_decode(token);

          const newUserInfo = { 
            name: decoded.name,
            email: decoded.email,
            role: decoded.role,
            token: token
          }
          setUserInfo(newUserInfo)
          localStorage.setItem("username", decoded.name)
          localStorage.setItem("email", decoded.email)
          localStorage.setItem("role", decoded.role)

          const headerPayload = {
            "Access-Control-Allow-Origin" : "*",
            "Content-type": "Application/json",
            "Authorization": `Bearer ${token}`,
            }
            axios({
                method: "get",
                url: globalSettings.baseApiUrl + globalSettings.userApi + "/" + newUserInfo.email,
                headers: headerPayload
            }).then((res) => {
                if (res ) {
                    const userResult = res.data
                    setUser(userResult)
                    console.log(userResult)
                } else {
                    
                }
            }).catch((err) => {
                // handle err
                console.log(err)
            })


          //setUpdateTournament(true);
          history.push({
            pathname: "/home"
          });
        } else {
          console.log("ERR 1");
          // no token, display error
        }
      } else {
        console.log("ERR 2")
        // display error
      }
    }).catch((err) => {
      // handle err
      toast.error('Login failed wrong user credentials', {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
      
      console.log("ERR 3")
      console.log(err)
    })
  }

  return (
    <main>
      <section className="d-flex align-items-center vh-lg-100 mt-5 mt-lg-0 bg-soft">
        <Container>
          <Row className="justify-content-center form-bg-image" style={{ backgroundImage: `url(${BgImage})` }}>
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="bg-white shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">Sign in to Habits Dashboard</h3>
                </div>
                <Form className="mt-4" onSubmit={handleSubmit}>
                  <Form.Group id="email" className="mb-4">
                    <Form.Label>Your Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <MailIcon className="icon icon-xs text-gray-600" />
                      </InputGroup.Text>
                      <Form.Control autoFocus required type="email" placeholder="example@company.com" name="email" />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Group id="password" className="mb-4">
                      <Form.Label>Your Password</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <LockClosedIcon className="icon icon-xs text-gray-600" />
                        </InputGroup.Text>
                        <Form.Control required type="password" placeholder="Password"  name="password"/>
                      </InputGroup>
                    </Form.Group>
                    <div className="d-flex justify-content-between align-items-top mb-4">
                      <Form.Check type="checkbox">
                        <FormCheck.Input id="defaultCheck5" className="me-2" />
                        <FormCheck.Label htmlFor="defaultCheck5" className="mb-0">Remember me</FormCheck.Label>
                      </Form.Check>
                      <Card.Link as={Link} to={Routes.ForgotPassword.path} className="small text-end">Lost password?</Card.Link>
                    </div>
                  </Form.Group>
                  <div className="d-grid">
                    <Button variant="gray-800" type="submit">
                      Sign in
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

export default Signin