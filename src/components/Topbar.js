
import React, { useState } from "react";
import moment from "moment-timezone";
import { BellIcon, CogIcon, InboxIcon, MenuAlt1Icon, SupportIcon, UserCircleIcon } from "@heroicons/react/solid";
import { LogoutIcon } from "@heroicons/react/outline";
import { Row, Col, Nav, Image, Button, Navbar, Dropdown, Container, ListGroup } from 'react-bootstrap';

import { userNotifications } from "data/notifications";
import { useLogin } from "contexts/ApplicationContext";
import { Routes } from "routes";
import { Link } from "react-router-dom";


export default (props) => {
  const [notifications, setNotifications] = useState(userNotifications);
  const allNotificationsRead = notifications.reduce((acc, notif) => acc && notif.read, true);
  const bellIconClasses = !allNotificationsRead ? "unread" : "";

  const { user, setUser, setIsLoggedIn, setUserInfo } = useLogin()

  const markNotificationsAsRead = () => {
    setTimeout(() => {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    }, 400);
  };

  const onLogout = () => {
    console.log("logout")
    localStorage.removeItem('token')
    setUser({})
    setIsLoggedIn(false);
    setUserInfo({
        name: "",
        email: "",
        role: "",
        token: ""
    })
    localStorage.removeItem("username")
    localStorage.removeItem("email")
    localStorage.removeItem("role")
    window.location.reload();
  }

  const toggleContracted = () => props.toggleContracted && props.toggleContracted();

  const Notification = (props) => {
    const { link, sender, image, time, message, read = false } = props;
    const readClassName = read ? "" : "text-danger";
    const receiveTime = moment(time).fromNow();

    return (
      <ListGroup.Item action href={link} className="list-group-item-action border-bottom">
        <Row className="align-items-center">
          <Col xs="auto">
            <Image src={image} className="avatar-md rounded" />
          </Col>
          <Col className="ps-0 ms-2">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="h6 mb-0 text-small">{sender}</h4>
              </div>
              <div className="text-end">
                <small className={readClassName}>
                  {receiveTime}
                </small>
              </div>
            </div>
            <p className="font-small mt-1 mb-0">{message}</p>
          </Col>
        </Row>
      </ListGroup.Item>
    );
  };

  return (
    <Navbar expand variant="dark" className="navbar-top navbar-dashboard ps-0 pe-2 pb-0">
      <Container fluid className="px-0">
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex align-items-center">
            <Button
              size="lg"
              id="sidebar-toggle"
              variant="icon-only"
              className="sidebar-toggle d-none d-lg-inline-block align-items-center justify-content-center me-3"
              onClick={toggleContracted}
            >
              <MenuAlt1Icon className="toggle-icon" />
            </Button>
          </div>
          <Nav className="align-items-center">
            <Dropdown as={Nav.Item} className="ms-lg-3">
              <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                <div className="media d-flex align-items-center">
                  <Image src={user.avatar} className="avatar rounded-circle" />
                  <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                    <span className="mb-0 font-small fw-bold text-gray-900">{user.userName}</span>
                  </div>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="dashboard-dropdown dropdown-menu-end mt-2 py-1">
                <Dropdown.Item as={Link} to={Routes.InnerResetPassword.path} className="d-flex align-items-center">
                  <UserCircleIcon className="dropdown-icon text-gray-400 me-2" /> Reset Password
                </Dropdown.Item>
                <Dropdown.Item className="d-flex align-items-center">
                  <SupportIcon className="dropdown-icon text-gray-400 me-2" /> Support
                </Dropdown.Item>

                <Dropdown.Divider as="div" className="my-1" />

                <Dropdown.Item className="d-flex align-items-center" onClick={()=>onLogout()}>
                  <LogoutIcon className="dropdown-icon text-danger me-2"/> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
};
