import React, { useEffect, useState } from "react";
import { CheckCircleIcon, DotsHorizontalIcon, EmojiHappyIcon, EmojiSadIcon, InformationCircleIcon, ShieldExclamationIcon, UserAddIcon, UserRemoveIcon, XCircleIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from "@heroicons/react/solid";
import { Nav, Card, Form, Image, Button, Table, Dropdown, Tooltip, FormCheck, ButtonGroup, OverlayTrigger } from 'react-bootstrap';

import { useLogin } from "contexts/ApplicationContext";

import axios from "axios";
import { globalSettings } from "misc/globals";
import { StatusCodes } from "http-status-codes";
import { TablePagination } from "./TablePagination";

const getFirstLetterOfEachWord = (text) => (
  text ? text.match(/\b\w/g).join('') : ''
);

export const UsersTable = (props) => {
  const { users = [], allSelected, refresh, setRefresh, showNumber } = props;
  const [bulkOption, setBulkOption] = useState(0);
  const disabledBulkMenu = users.filter(u => u.isSelected).length === 0;

  const { userInfo } = useLogin()

  // #region Pagination

  const increment = (users.length % showNumber > 0 ? 1 : 0)
  const pagesNumber = parseInt(Math.floor(users.length / showNumber)) + increment

  const [activePaginationItem, setActivePaginationItem] = useState(1);

  const onPrevItem = () => {
    const prevActiveItem = activePaginationItem === 1 ? activePaginationItem : activePaginationItem - 1;
    setActivePaginationItem(prevActiveItem);
  };

  const onNextItem = (totalPages) => {
    const nextActiveItem = activePaginationItem === totalPages ? activePaginationItem : activePaginationItem + 1;
    setActivePaginationItem(nextActiveItem);
  };

  const handlePaginationChange = (event) => {
    setActivePaginationItem(parseInt(event.target.id));
  };

  useEffect(() => {
    setActivePaginationItem(1)
  }, [refresh])

  // #endregion

  const selectUser = (id) => {
    props.selectUser && props.selectUser(id);
  };

  const selectAllUsers = () => {
    props.selectAllUsers && props.selectAllUsers();
  };

  const bulkActionChange = (e) => {
    const newOption = e.target.value;
    setBulkOption(newOption);
  }

  const applyBulkAction = () => {
    if (bulkOption === "delete_user") deleteUsers();
  }

  const deleteUsers = (ids) => {
    props.deleteUsers && props.deleteUsers(ids)
  }

  const activateUser = (active, id) => {
    const data = {
      user: id,
      status: active
    }
    const headerPayload = {
          "Access-Control-Allow-Origin" : "*",
          "Content-type": "Application/json",
          "Authorization": `Bearer ${userInfo.token}`,
      }
    axios({
      method: "post",
      data: data,
      url: globalSettings.baseApiUrl + globalSettings.userApi + globalSettings.user.activate,
      headers: headerPayload
    }).then((res) => {
      setRefresh(refresh+1)
      if (res && res.status === StatusCodes.CREATED) {
      } else {
        console.log("ERR 2")
        // display error
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  const changeRole = (role, id) => {
    const data = {
      user: id,
      role: role
    }
    const headerPayload = {
          "Access-Control-Allow-Origin" : "*",
          "Content-type": "Application/json",
          "Authorization": `Bearer ${userInfo.token}`,
      }
    axios({
      method: "post",
      data: data,
      url: globalSettings.baseApiUrl + globalSettings.userApi + globalSettings.user.changeRole,
      headers: headerPayload
    }).then((res) => {
      setRefresh(refresh+1)
      if (res && res.status === StatusCodes.CREATED) {
      } else {
        console.log("ERR 2")
        // display error
      }
    }).catch((err) => {
      console.log(err)
    })
  }  

  const TableRow = (props) => {
    const { _id, verified, role, auth, image, userName, email, creationDate, isSelected, brandName, avatar } = props;
    const VerifiedIcon = verified ? CheckCircleIcon : InformationCircleIcon;

    const status = auth.email.valid

    /*const statusVariant = status === "active" ? "success"
      : status === "inactive" ? "warning"
        : status === "pending" ? "purple"
          : status === "suspended" ? "danger" : "primary";
    */
    const statusVariant = status ? "success": "warning"

    return (
      <tr className="border-bottom">
        <td>
          <FormCheck type="checkbox" className="dashboard-check">
            <FormCheck.Input id={`user-${_id}`} checked={isSelected} onChange={() => selectUser(_id)} />
            <FormCheck.Label htmlFor={`user-${_id}`} />
          </FormCheck>
        </td>
        <td>
          <Card.Link className="d-flex align-items-center">
            {image
              ? (
                <Image
                  src={avatar}
                  className="avatar rounded-circle me-3"
                />
              ) : (
                <div className="avatar d-flex align-items-center justify-content-center fw-bold rounded bg-secondary me-3">
                  <span>{getFirstLetterOfEachWord(userName)}</span>
                </div>
              )}
            <div className="d-block">
              <span className="fw-bold">{userName}</span>
              <div className="small text-gray">{email}</div>
            </div>
          </Card.Link>
        </td>
        <td><span className="fw-normal">{brandName}</span></td>
        <td><span className="fw-normal">{creationDate}</span></td>
        <td>
          <span className="fw-normal d-flex align-items-center">
            <VerifiedIcon className={`icon icon-xxs text-${statusVariant} me-1`} />
            Email
          </span>
        </td>
        <td>
          <span className={`fw-normal text-${statusVariant}`}>
            {role}
          </span>
        </td>
        <td>
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle as={Button} split variant="link" className="text-dark m-0 p-0">
              <DotsHorizontalIcon className="icon icon-xs" />
            </Dropdown.Toggle>
            <Dropdown.Menu className="dashboard-dropdown dropdown-menu-start mt-2 py-1">
              <Dropdown.Item className="d-flex align-items-center">
                <ShieldExclamationIcon className="dropdown-icon text-gray-400 me-2" />
                Reset Pass
              </Dropdown.Item>
              { status ? (
                  <Dropdown.Item className="d-flex align-items-center" onClick={()=>activateUser(false, _id)}>
                    <UserRemoveIcon className="dropdown-icon text-danger me-2" />
                    Suspend 
                  </Dropdown.Item>
                ) : (
                  <Dropdown.Item className="d-flex align-items-center" onClick={()=>activateUser(true, _id)}>
                    <UserAddIcon className="dropdown-icon text-success me-2" />
                    Active
                  </Dropdown.Item>
                )
              }
              { role==='admin' ? (
                  <Dropdown.Item className="d-flex align-items-center" onClick={()=>changeRole('brand', _id)}>
                    <EmojiSadIcon className="dropdown-icon text-danger me-2" />
                    Downgrade to brand
                  </Dropdown.Item>
                ) : (
                  <Dropdown.Item className="d-flex align-items-center" onClick={()=>changeRole('admin', _id)}>
                    <EmojiHappyIcon className="dropdown-icon text-success me-2" />
                    Promote to Admin
                  </Dropdown.Item>
                )
              }
            </Dropdown.Menu>
          </Dropdown>

          <OverlayTrigger placement="top" overlay={<Tooltip className="m-0">Delete</Tooltip>}>
            <Card.Link className="ms-2" onClick={() => deleteUsers([_id])}>
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
        <div className="d-flex mb-3">
          <Form.Select className="fmxw-200" disabled={disabledBulkMenu} value={bulkOption} onChange={bulkActionChange}>
            <option value="bulk_action">Bulk Action</option>
            <option value="delete_user">Delete User</option>
          </Form.Select>
          <Button variant="secondary" size="sm" className="ms-3" disabled={disabledBulkMenu} onClick={applyBulkAction}>
            Apply
          </Button>
        </div>
        <Table hover className="user-table align-items-center">
          <thead>
            <tr>
              <th className="border-bottom">
                <FormCheck type="checkbox" className="dashboard-check">
                  <FormCheck.Input id="userCheckAll" checked={allSelected} onChange={selectAllUsers} />
                  <FormCheck.Label htmlFor="userCheckAll" />
                </FormCheck>
              </th>
              <th className="border-bottom">Name</th>
              <th className="border-bottom">Brand</th>
              <th className="border-bottom">Date Created</th>
              <th className="border-bottom">Verified</th>
              <th className="border-bottom">Role</th>
              <th className="border-bottom">Action</th>
            </tr>
          </thead>
          <tbody className="border-0">
          {/* {users.map(u => <TableRow key={`user-${u._id}`} {...u} />)} */}
          {users.slice((activePaginationItem-1)*showNumber, activePaginationItem*showNumber).map(u => <TableRow key={`user-${u._id}`} {...u} />)}
          </tbody>
        </Table>
        <Card.Footer className="px-3 border-0 d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <Nav>
            <TablePagination
              onNextItem={onNextItem} 
              onPrevItem={onPrevItem} 
              handlePaginationChange={handlePaginationChange}
              activeItem={activePaginationItem} 
              totalPages={pagesNumber} 
              withIcons 
            />
          </Nav>
          <small className="fw-normal small mt-4 mt-lg-0">
            Showing entries from <b>{1+(activePaginationItem-1)*showNumber}</b> to <b>{activePaginationItem*showNumber > users.length ? users.length : activePaginationItem*showNumber}</b> out of <b>{users.length}</b>.
          </small>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};