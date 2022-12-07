import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/solid";
import { Form, Modal, Button } from 'react-bootstrap';


export const NewBrandModal = (props) => {
  const { modalTitle = "Create New Brand", type = "card", show = false, status } = props;
  const [name, setName] = useState("");
  
  const onNameChange = (e) => setName(e.target.value);
  
  const onHide = () => props.onHide && props.onHide();

  const onSubmit = () => {
    const payload = { name };
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
            <Form.Group id="name" className="mb-3">
                <Form.Control
                required
                autoFocus
                type="text"
                value={name}
                onChange={onNameChange}
                placeholder={`Enter Brand Name`}
                />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer className="justify-content-start border-0 pt-0">
          <Button variant="outline-gray-500" onClick={onHide}>
            Close
          </Button>
          <Button variant="secondary" className="d-inline-flex align-items-center" onClick={onSubmit}>
            <PlusIcon className="icon icon-xs me-2" />
            Add Brand
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

