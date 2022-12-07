
import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { CheckIcon, CogIcon, HomeIcon, PlusIcon, SearchIcon } from "@heroicons/react/solid";
import { Col, Row, Form, Button, ButtonGroup, Breadcrumb, InputGroup, Dropdown } from 'react-bootstrap';

import { UsersTable } from "components/Tables";

import axios from "axios";
import { globalSettings } from "../misc/globals";
import { useLogin } from "../contexts/ApplicationContext";
import { NewUserModal } from "components/habits/UsersModal";
import { StatusCodes } from "http-status-codes";

const SwalWithBootstrapButtons = withReactContent(Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary me-3',
    cancelButton: 'btn btn-gray'
  },
  buttonsStyling: false
}));

const Users = () => {
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(0)
  const [searchValue, setSearchValue] = useState("");
  const selectedUsersIds = users.filter(u => u.isSelected).map(u => u._id);
  const totalUsers = users.length;
  const allSelected = selectedUsersIds.length === totalUsers;

  /* Per la creazione di un nuovo utente */
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

  const toggleCreateUserModal = (props = {}) => {
    //setCreateCardProps({ ...createCardDefaultProps, ...props });
    setShowCreateUserModal(!showCreateUserModal);
  };

  const handleCreateUser = (props = {}) => {
    const data = {...props,
      status: false,
      fromDashboard: true
    }
    const headerPayload = {
        "Access-Control-Allow-Origin" : "*",
        "Content-type": "Application/json",
        "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "post",
      data: data,
      url: globalSettings.baseApiUrl + globalSettings.authApi + globalSettings.user.register,
      headers: headerPayload
    }).then((res) => {
      console.log(res)
      setRefresh(refresh+1)
      if (res && res.status === StatusCodes.CREATED) {
      } else {
        console.log("ERR 2")
        // display error
      }
    }).catch((err) => {
      console.log(err)
    })

    console.log(props)

    toggleCreateUserModal();
    //setKanbanLists(listsUpdated);
  };

  const { userInfo } = useLogin()
  //  const [users, setUsers] = useState([])
   
  useEffect(() => {
      const headerPayload = {
          "Access-Control-Allow-Origin" : "*",
          "Content-type": "Application/json",
          "Authorization": `Bearer ${userInfo.token}`,
      }
      axios({
          method: "get",
          url: globalSettings.baseApiUrl + globalSettings.userApi,
          headers: headerPayload
      }).then((res) => {
          if (res ) {
              const userResult = res.data
              console.log(userResult)
              setUsers(userResult.map(u => ({ ...u, isSelected: false, show: true })))
          } else {
              
          }
      }).catch((err) => {
          // handle err
          console.log(err)
      })
  },[refresh])

  const changeSearchValue = (e) => {
    const newSearchValue = e.target.value;
    const newUsers = users.map(u => ({ ...u, show: u.userName.toLowerCase().includes(newSearchValue.toLowerCase()) }));

    setSearchValue(newSearchValue);
    setUsers(newUsers);
  };

  const selectAllUsers = () => {
    const newUsers = selectedUsersIds.length === totalUsers ?
      users.map(u => ({ ...u, isSelected: false })) :
      users.map(u => ({ ...u, isSelected: true }));

    setUsers(newUsers);
  };

  const selectUser = (id) => {
    console.log(id)
    const newUsers = users.map(u => u._id === id ? ({ ...u, isSelected: !u.isSelected }) : u);
    setUsers(newUsers);
  };

  const deleteUsers = async (ids) => {
    console.log("dentro delete")
    const usersToBeDeleted = ids ? ids : selectedUsersIds;
    const usersNr = usersToBeDeleted.length;
    const textMessage = usersNr === 1
      ? "Are you sure do you want to delete this user?"
      : `Are you sure do you want to delete these ${usersNr} users?`;

    const result = await SwalWithBootstrapButtons.fire({
      icon: "error",
      title: "Confirm deletion",
      text: textMessage,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {

      if ( ids )
        deleteUser( ids )
      else {
        selectedUsersIds.map(id => deleteUser(id))
      }
/*

      const newUsers = users.filter(f => !usersToBeDeleted.includes(f.id));
      const confirmMessage = usersNr === 1 ? "The user has been deleted." : "The users have been deleted.";

      setUsers(newUsers);
      await SwalWithBootstrapButtons.fire('Deleted', confirmMessage, 'success');*/
    }
  };

  const deleteUser = (id) => {
    const headerPayload = {
          "Access-Control-Allow-Origin" : "*",
          "Content-type": "Application/json",
          "Authorization": `Bearer ${userInfo.token}`,
      }
      axios({
          method: "delete",
          url: globalSettings.baseApiUrl + globalSettings.userApi + "/" + id,
          headers: headerPayload
      }).then((res) => {
          if (res ) {
              const userResult = res.data
              console.log(userResult)
              //setUsers(userResult.map(u => ({ ...u, isSelected: false, show: true })))
              setRefresh(refresh+1)
          } else {
              
          }
      }).catch((err) => {
          // handle err
          console.log(err)
      })
  }

  return (
    <>
      {showCreateUserModal && (
        <NewUserModal
          show={showCreateUserModal}
          onHide={toggleCreateUserModal}
          onSubmit={handleCreateUser}
        />
      )}
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><HomeIcon className="icon icon-xs" /></Breadcrumb.Item>
            <Breadcrumb.Item>Habits</Breadcrumb.Item>
            <Breadcrumb.Item active>Users List</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Users List</h4>
          <p className="mb-0">List of registered users and status.</p>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button variant="gray-800" size="sm" className="d-inline-flex align-items-center" onClick={() => toggleCreateUserModal()}>
            <PlusIcon className="icon icon-xs me-2" /> New User
          </Button>
          {/*<ButtonGroup className="ms-2 ms-lg-3">
            <Button variant="outline-gray-600" size="sm">Share</Button>
            <Button variant="outline-gray-600" size="sm">Export</Button>
          </ButtonGroup>*/}
        </div>
      </div>

      <div className="table-settings mb-4">
        <Row className="justify-content-between align-items-center">
          <Col xs={9} lg={8} className="d-md-flex">
            <InputGroup className="me-2 me-lg-3 fmxw-300">
              <InputGroup.Text>
                <SearchIcon className="icon icon-xs" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search users"
                value={searchValue}
                onChange={changeSearchValue}
              />
            </InputGroup>
          </Col>
          <Col xs={3} lg={4} className="d-flex justify-content-end">
            <ButtonGroup>
              <Dropdown>
                <Dropdown.Toggle split as={Button} variant="link" className="text-dark m-0 p-1">
                  <CogIcon className="icon icon-sm" />
                  <span className="visually-hidden">Toggle Dropdown</span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-xs dropdown-menu-end pb-0">
                  <span className="small ps-3 fw-bold text-dark">
                    Show
                  </span>
                  <Dropdown.Item className="d-flex align-items-center fw-bold">
                    10 <CheckIcon className="icon icon-xxs ms-auto" />
                  </Dropdown.Item>
                  <Dropdown.Item className="fw-bold">20</Dropdown.Item>
                  <Dropdown.Item className="fw-bold rounded-bottom">30</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </ButtonGroup>
          </Col>
        </Row>
      </div>

    {users &&
      <UsersTable
        users={users.filter(u => u.show)}
        refresh={refresh}
        setRefresh={setRefresh}
        allSelected={allSelected}
        selectUser={selectUser}
        deleteUsers={deleteUsers}
        selectAllUsers={selectAllUsers}
      />
    }
    </>
  );
};

export default Users
