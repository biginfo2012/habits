
import React from "react";
import { LockClosedIcon } from "@heroicons/react/solid";
import { Col, Row, Form, Button, Container, InputGroup } from 'react-bootstrap';
import { useLogin } from "../../contexts/ApplicationContext";
import axios from "axios";
import { globalSettings } from "../../misc/globals";
import { toast } from 'react-toastify'

const InnerResetPassword = () => {

  const { userInfo } = useLogin()

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      currentPassword: e.target.oldpassword.value,
      newPassword: e.target.newpassword.value
    }
    const headerPayload = {
        "Access-Control-Allow-Origin" : "*",
        "Content-type": "Application/json",
        "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "post",
      data: data,
      url: globalSettings.baseApiUrl + globalSettings.authApi + globalSettings.auth.dashboardResetPassword,
      headers: headerPayload
    }).then((res) => {
      if (res ) {
          //const brandResult = res.data
          console.log("password cambiata")
          console.log(res)
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
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="bg-white shadow border-0 rounded p-4 p-lg-5 w-100 fmxw-500">
                <h3 className="mb-4">Reset password</h3>
                <Form onSubmit={handleSubmit}>
                  <Form.Group id="password" className="mb-4">
                    <Form.Label>Old Password</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <LockClosedIcon className="icon icon-xs text-gray-600" />
                      </InputGroup.Text>
                      <Form.Control required type="password" placeholder="Old Password" name="oldpassword" />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group id="confirmPassword" className="mb-4">
                    <Form.Label>New Password</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <LockClosedIcon className="icon icon-xs text-gray-600" />
                      </InputGroup.Text>
                      <Form.Control required type="password" placeholder="New Password" name="newpassword"/>
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

export default InnerResetPassword
