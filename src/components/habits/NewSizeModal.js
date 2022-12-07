import React, { useEffect, useState } from "react";
import { CheckIcon, ChevronDownIcon, CogIcon, PlusIcon } from "@heroicons/react/solid";
import { Form, Modal, Button, Dropdown } from 'react-bootstrap';
import axios from "axios";
import { globalSettings } from "misc/globals";
import { useLogin } from "contexts/ApplicationContext";


export const NewSizeModal = (props) => {
  const { modalTitle = "Create New Size", type = "card", show = false } = props;
  const [size, setSize] = useState("");
  const [qty, setQty] = useState("");

  const onLabelChange = (e) => setSize(e.target.value);
  const onQuantityChange = (e) => setQty(e.target.value);
  
  const onHide = () => props.onHide && props.onHide();

  const { userInfo } = useLogin()

  const onSubmit = () => {
    const payload = { size, qty: parseInt(qty) };
    return props.onSubmit && props.onSubmit(payload);
  };

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
            <Form.Group id="sizeLabel" className="mb-3">
                <Form.Control
                required
                autoFocus
                type="text"
                value={size}
                onChange={onLabelChange}
                placeholder={`Enter size label`}
                />
            </Form.Group>
            <Form.Group id="sizeQuantity" className="mb-3">
                <Form.Control
                required
                autoFocus
                type="text"
                value={qty}
                onChange={onQuantityChange}
                placeholder={`Enter quantity`}
                />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer className="justify-content-start border-0 pt-0">
          <Button variant="outline-gray-500" onClick={onHide}>
            Close
          </Button>
          <Button variant="secondary" className="d-inline-flex align-items-center" onClick={onSubmit}>
            <PlusIcon className="icon icon-xs me-2" />
            Add Size
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

