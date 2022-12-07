import React, { useEffect, useState } from "react";
import { CheckCircleIcon, DotsHorizontalIcon, EmojiHappyIcon, EmojiSadIcon, InformationCircleIcon, ShieldExclamationIcon, UserAddIcon, UserRemoveIcon, XCircleIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from "@heroicons/react/solid";
import { Nav, Card, Form, Image, Button, Table, Dropdown, Tooltip, FormCheck, ButtonGroup, OverlayTrigger, InputGroup } from 'react-bootstrap';

import { useLogin } from "contexts/ApplicationContext";


export const SizesTable = (props) => {
  const { sizes = [] } = props;

  const { userInfo } = useLogin()

  const deleteSize = (label) => {
    props.deleteSize && props.deleteSize(label)
  }

  const TableRow = (props) => {
    const { size, qty } = props;

    return (
      <tr className="border-bottom">
        <td><span className="fw-normal">{size}</span></td>
        <td><span className="fw-normal">{qty}</span></td>
        <td>
          <OverlayTrigger placement="top" overlay={<Tooltip className="m-0">Delete</Tooltip>}>
              <Card.Link className="ms-2" onClick={() => deleteSize(size)}>
                <XCircleIcon className="icon icon-xs text-danger" />
              </Card.Link>
            </OverlayTrigger>
        </td>
      </tr>
    );
  };

  return (
    <Card border="0" className="table-wrapper table-responsive shadow">
      <Card.Body>
        <Table hover className="user-table align-items-center">
          <thead>
            <tr>
              <th className="border-bottom">Size Label</th>
              <th className="border-bottom">Quantity</th>
              <th className="border-bottom"></th>
            </tr>
          </thead>
          <tbody className="border-0">
          {sizes.map(s => <TableRow key={`size-${s.size}`} {...s} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};