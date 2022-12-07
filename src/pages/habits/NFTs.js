
import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { CheckIcon, CogIcon, HomeIcon, PlusIcon, SearchIcon } from "@heroicons/react/solid";
import { Col, Row, Form, Button, ButtonGroup, Breadcrumb, InputGroup, Dropdown } from 'react-bootstrap';

import { NFTsTable } from "components/habits/NFTsTable";

import axios from "axios";
import { globalSettings } from "../../misc/globals";
import { useLogin } from "../../contexts/ApplicationContext";
import { Routes } from "routes";
import { Link } from 'react-router-dom';

const SwalWithBootstrapButtons = withReactContent(Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary me-3',
    cancelButton: 'btn btn-gray'
  },
  buttonsStyling: false
}));

const NFTs = () => {
  const [nfts, setNFTs] = useState([]);
  const [refresh, setRefresh] = useState(0)
  const [searchValue, setSearchValue] = useState("");
  const [selectedShowNumber, setSelectedShowNumber] = useState(10);
  const selectedNFTIds = nfts.filter(u => u.isSelected).map(u => u._id);
  const totalNFTs = nfts.length;
  const allSelected = selectedNFTIds.length === totalNFTs;

  const { userInfo } = useLogin()


  useEffect(() => {
    const headerPayload = {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "get",
      url: globalSettings.baseApiUrl + globalSettings.nftApi,
      headers: headerPayload
    }).then((res) => {
      if (res) {
        const nftsResult = res.data
        setNFTs(nftsResult.map(u => ({ ...u, isSelected: false, show: true })))
      } else {

      }
    }).catch((err) => {
      // handle err
      console.log(err)
    })
  }, [refresh])

  const changeSearchValue = (e) => {
    const newSearchValue = e.target.value;
    const newNFT = nfts.map(u => ({ ...u, show: u.name.toLowerCase().includes(newSearchValue.toLowerCase()) }));

    setSearchValue(newSearchValue);
    setNFTs(newNFT);
  };

  const selectAllNFTs = () => {
    if (selectedNFTIds && nfts) {
      const newNFT = selectedNFTIds.length === totalNFTs ?
        nfts.map(u => ({ ...u, isSelected: false })) :
        nfts.map(u => ({ ...u, isSelected: true }));

      setNFTs(newNFT);
    }
  };

  const selectNFT = (id) => {
    const newNFT = nfts.map(u => u._id === id ? ({ ...u, isSelected: !u.isSelected }) : u);
    setNFTs(newNFT);
  };

  const deleteNFTs = async (ids) => {
    const nftsToBeDeleted = ids ? ids : selectedNFTIds;
    const nftsNr = nftsToBeDeleted.length;
    const textMessage = nftsNr === 1
      ? "Are you sure do you want to delete this NFT?"
      : `Are you sure do you want to delete these ${nftsNr} NFTs?`;

    const result = await SwalWithBootstrapButtons.fire({
      icon: "error",
      title: "Confirm deletion",
      text: textMessage,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {

      if (ids)
        deleteNFT(ids)
      else {
        selectedNFTIds.map(id => deleteNFT(id))
      }
    }
  };

  const deleteNFT = (id) => {
    const headerPayload = {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "Application/json",
      "Authorization": `Bearer ${userInfo.token}`,
    }
    axios({
      method: "delete",
      url: globalSettings.baseApiUrl + globalSettings.nftApi + '/' + id,
      headers: headerPayload
    }).then((res) => {
      if (res) {
        const nftResult = res.data
        setRefresh(refresh + 1)
      } else {

      }
    }).catch((err) => {
      // handle err
      console.log(err)
    })
  }

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><HomeIcon className="icon icon-xs" /></Breadcrumb.Item>
            <Breadcrumb.Item>Habits</Breadcrumb.Item>
            <Breadcrumb.Item active>NFTs List</Breadcrumb.Item>
          </Breadcrumb>
          <h4>NFTs</h4>
          <p className="mb-0">List of all NFTs created for the brand.</p>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button as={Link} to={Routes.NFT.path} variant="gray-800" size="sm" className="d-inline-flex align-items-center">
            <PlusIcon className="icon icon-xs me-2" /> New NFT
          </Button>
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
                placeholder="Search NFTs"
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
                  <Dropdown.Item onClick={() => setSelectedShowNumber(10)} className="d-flex align-items-center fw-bold">
                    10 {selectedShowNumber == 10 && <CheckIcon className="icon icon-xxs ms-auto" />}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedShowNumber(20)} className="fw-bold">
                    20 {selectedShowNumber == 20 && <CheckIcon className="icon icon-xxs ms-auto" />}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedShowNumber(30)} className="fw-bold rounded-bottom">
                    30 {selectedShowNumber == 30 && <CheckIcon className="icon icon-xxs ms-auto" />}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </ButtonGroup>
          </Col>
        </Row>
      </div>

      {nfts &&
        <NFTsTable
          nfts={nfts}
          refresh={refresh}
          setRefresh={setRefresh}
          allSelected={allSelected}
          selectNFT={selectNFT}
          deleteNFTs={deleteNFTs}
          selectAllNFTs={selectAllNFTs}
          showNumber={selectedShowNumber}
        />
      }
    </>
  );
};

export default NFTs