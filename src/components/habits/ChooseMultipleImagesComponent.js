
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Image, Row, Toast, ToastContainer } from 'react-bootstrap';
import { PaperClipIcon, UploadIcon, DotsHorizontalIcon, XIcon } from "@heroicons/react/solid";
import { XCircleIcon } from "@heroicons/react/outline";


export const ChooseMultipleImagesComponent = (props) => {
  const { id, 
          title, 
          firstLine, 
          secondLine, 
          photos, 
          onSavePressed, 
          onImageChange, 
          showToast = false, 
          toastMessage = "", 
          onToastClose=()=>{},
          onDelete=()=>{},
          onDeleteImage=()=>{},
          loading = false
        } = props;


  return (
    <Card border="0" className="shadow mb-4">
      <ToastContainer style={{zIndex: 100}} position="bottom-center" className="p-3">
        <Toast show={showToast} delay={3000} autohide className="bg-success my-3 ml-3" onClose={onToastClose}>
          <Toast.Header className="text-primary" closeButton={true}>
              <UploadIcon className="icon icon-xs text-gray-800" />
              <strong className="me-auto ms-2 text-gray-800">Success</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
              {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
      <Card.Body>
        <h5 className="mb-4">{title}</h5>
        <div className="d-flex align-items-center">
          <div style={{width:'70%'}} className="me-3">
            <Row>
            {photos && photos.length > 0 && photos.map((p, index) => {
              return (
                <Col key={index} style={{position: 'relative'}} xs={3} className="align-items-center text-center">
                  <div style={{position: 'relative'}} className="align-items-center text-center">
                      <XCircleIcon 
                        style={{position: 'absolute', backgroundColor:'red', top: 12, right: -12, width:24, height:24, borderRadius:20}}
                        className="icon icon-xs text-white" 
                        onClick={()=>onDeleteImage(p, index)}
                      />
                    <Image style={{width:'auto', height:'auto', borderRadius:20, margin:10}} fluid src={p.image} />
                  </div>
                </Col>
                )
              })    
            }
            </Row>
          </div>
          <Col style={{width:'30%'}} className="align-items-center text-right">
            <div className="mt-3">
              <div className="file-field">
                <div className="d-flex justify-content-xl-center ms-xl-3">
                  <div className="d-flex">
                    <PaperClipIcon className="icon text-gray-500 me-2" />
                    <input multiple id={id} type="file" accept=".png,.jpg,.jpeg,.gif" onChange={(e)=>onImageChange(e)}/>
                    <div className="d-md-block text-left">
                      <div className="fw-normal text-dark mb-1">{firstLine}</div>
                      <div className="text-gray small">{secondLine}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-right ms-xl-3 mt-4">
                <Col style={{width:'50%'}} className="align-items-right">
                  <Button style={{minWidth:100}} disabled={loading} type="submit" variant="gray-800" className="animate-up-2" onClick={onSavePressed} >
                    {loading ?
                      <DotsHorizontalIcon className="icon icon-xs text-white" />
                      :
                      'Save'
                    }
                  </Button>
                </Col>
                <Col style={{width:'50%'}} className="align-items-right">
                  <Button style={{minWidth:100}} disabled={loading} variant="danger" className="animate-up-2" onClick={onDelete} >
                    {loading ?
                      <DotsHorizontalIcon className="icon icon-xs text-white" />
                      :
                      'Clear All'
                    }
                  </Button>
                </Col>
              </div>
            </div>
          </Col>
        </div>
      </Card.Body>
    </Card>
  );
};