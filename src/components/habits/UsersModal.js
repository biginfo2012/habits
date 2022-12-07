import React, { useEffect, useState } from "react";
import { CheckIcon, ChevronDownIcon, CogIcon, PlusIcon } from "@heroicons/react/solid";
import { Form, Modal, Button, Dropdown } from 'react-bootstrap';
import axios from "axios";
import { globalSettings } from "misc/globals";
import { useLogin } from "contexts/ApplicationContext";


export const NewUserModal = (props) => {
  const { modalTitle = "Create New User", type = "card", show = false, status } = props;
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [brand, setBrand] = useState("");
  const [password, setPassword] = useState("");

  const [brands, setBrands] = useState([]);

  const onUsernameChange = (e) => setUserName(e.target.value);
  const onEmailChange = (e) => setEmail(e.target.value);
  const onPasswordChange = (e) => setPassword(e.target.value);
  
  const onHide = () => props.onHide && props.onHide();

  const { userInfo } = useLogin()

  const onSubmit = () => {
    const payload = { userName, email, password, brand };
    return props.onSubmit && props.onSubmit(payload);
  };

  useEffect(() => {
    const headerPayload = {
        "Access-Control-Allow-Origin" : "*",
        "Content-type": "Application/json",
        "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
        method: "get",
        url: globalSettings.baseApiUrl + globalSettings.productsApi + globalSettings.product.brands,
        headers: headerPayload
    }).then((res) => {
        if (res ) {
            const brandsResult = res.data
            console.log(brandsResult)
            setBrands(brandsResult.map(u => ({ ...u, isSelected: false, show: true })))
        } else {
            
        }
    }).catch((err) => {
        // handle err
        console.log(err)
    })
  },[])

  const handleSelect = (e) => {
    setBrand(e.target.id)
  }


  return (
    <Modal as={Modal.Dialog} centered show={show} onHide={onHide}>
      <Form className="modal-content p-3">
        <Modal.Header className="pb-0 border-0">
          <h5 as={Modal.Title} className="fw-normal">
            {modalTitle}
          </h5>
          <Button variant="close" onClick={onHide} />
        </Modal.Header>
        <Modal.Body className="pb-0">
            <Form.Group id="userName" className="mb-3">
                <Form.Control
                required
                autoFocus
                type="text"
                value={userName}
                onChange={onUsernameChange}
                placeholder={`Enter userName`}
                />
            </Form.Group>
            <Form.Group id="brand" className="mb-3">
            <Dropdown>
              <Dropdown.Toggle variant="gray-100" className="text-light m-0 p-1" >
                <span className="text-dark m-0 p-1">{brand == "" ? "Select Brand" : brands.find(x => x._id == brand).name}</span>
                <ChevronDownIcon className="icon icon-xs ms-1" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-lg dropdown-menu-end pb-0">
                <span className="small ps-3 fw-bold text-dark">
                  Brands
                </span>
                { brands && brands.length > 0 && brands.map((item, index) => 
                  <Dropdown.Item 
                    key={item._id}
                    id={item._id}
                    as="button" 
                    onClick={handleSelect}
                    className={index == brands.length - 1 ? "fw-bold rounded-bottom" : "fw-bold" }
                  >
                      {item.name}
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
          <Form.Group id="email" className="mb-3">
              <Form.Control
              required
              autoFocus
              type="text"
              value={email}
              onChange={onEmailChange}
              placeholder={`Enter email`}
              />
          </Form.Group>
          <Form.Group id="password" className="mb-3">
              <Form.Control
              required
              autoFocus
              type="text"
              value={password}
              onChange={onPasswordChange}
              placeholder={`Enter password`}
              />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="justify-content-start border-0 pt-0">
          <Button variant="outline-gray-500" onClick={onHide}>
            Close
          </Button>
          <Button variant="secondary" className="d-inline-flex align-items-center" onClick={onSubmit}>
            <PlusIcon className="icon icon-xs me-2" />
            Add User
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

