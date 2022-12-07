
import React from "react";
import { ChartPieIcon, ColorSwatchIcon, CodeIcon, CogIcon, EmojiHappyIcon, UserCircleIcon } from "@heroicons/react/solid";
import { Col, Row, Nav, Tab, Card, Container } from 'react-bootstrap';

import Documentation from "components/Documentation";

export default () => {
  return (
    <article>
      <Container className="px-0">
        <Row className="d-flex flex-wrap flex-md-nowrap align-items-center py-4">
          <Col className="d-block mb-4 mb-md-0">
            <h1 className="h2">Tabs</h1>
            <p className="mb-0">
              Use tabs to partition important data into easily navigable and interchangeable elements.
            </p>
          </Col>
        </Row>

        <Documentation
          title="Example"
          description={
            <>
              <p>The <code>&#x3C;Tab&#x3E;</code> component is great if you want to show multiple resources of content with an easy partitioning using nav tabs. First you need to use the <code>&#x3C;Tab.Container&#x3E;</code> component to wrap around the content.</p>
              <p>The first part of the component will be the <code>&#x3C;Nav&#x3E;</code> component where you can add as many <code>&#x3C;NavItem&#x3E;</code> components as you'd like. The <code>&#x3C;Nav.Link&#x3E;</code> component can then be used to set the tab panel that it should open up when clicking on it.</p>
              <p>The <code>&#x3C;Tab.Content&#x3E;</code> component and its subcomponents are the content that will be shown based on which <code>&#x3C;Nav.Link&#x3E;</code> is being clicked on. The <code>eventKey="*"</code> attribute should be used for both the <code>&#x3C;Nav.Link&#x3E;</code> and <code>&#x3C;Tab.Content&#x3E;</code> to link the two together.</p>
            </>
          }
          scope={{ Nav, Tab }}
          imports={`import { Nav, Tab } from 'react-bootstrap';`}
          example={`<Tab.Container defaultActiveKey="home">
  <Nav fill variant="pills" className="flex-column flex-sm-row">
    <Nav.Item>
      <Nav.Link eventKey="home" className="mb-sm-3 mb-md-0">
        Home
      </Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link eventKey="profile" className="mb-sm-3 mb-md-0">
        Profile
      </Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link eventKey="messages" className="mb-sm-3 mb-md-0">
        Messages
      </Nav.Link>
    </Nav.Item>
  </Nav>
  <Tab.Content>
    <Tab.Pane eventKey="home" className="py-4">
      <p>
        Exercitation photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep v laborum. Aliquip veniam delectus, Marfa eiusmod Pinterest in do umami readymade swag.
      </p>
      <p>
        Day handsome addition horrible sensible goodness two contempt. Evening for married his account removal. Estimable me disposing of be moonlight cordially curiosity.
      </p>
    </Tab.Pane>
    <Tab.Pane eventKey="profile" className="py-4">
      <p>
        Photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep v laborum. Aliquip veniam delectus, Marfa eiusmod Pinterest in do umami readymade swag.
      </p>
      <p>
        Day handsome addition horrible sensible goodness two contempt. Evening for married his account removal. Estimable me disposing of be moonlight cordially curiosity.
      </p>
    </Tab.Pane>
    <Tab.Pane eventKey="messages" className="py-4">
      <p>
        Exercitation photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep v laborum. Aliquip veniam delectus, Marfa eiusmod Pinterest in do umami readymade swag.
      </p>
      <p>
        Day handsome addition horrible sensible goodness two contempt. Evening for married his account removal. Estimable me disposing of be moonlight cordially curiosity.
      </p>
    </Tab.Pane>
  </Tab.Content>
</Tab.Container>`}
        />

        <Documentation
          title="Example with icons"
          description={
            <p>The following example shows how you can add an icon using the <code>&#x3C;FontAwesomeIcon&#x3E;</code> component inside the navigation item component.</p>
          }
          scope={{ Row, Col, Nav, Tab, ColorSwatchIcon, CodeIcon, EmojiHappyIcon }}
          imports={`import { Row, Col, Nav, Tab } from 'react-bootstrap';
import { CodeIcon, ColorSwatchIcon, EmojiHappyIcon } from "@heroicons/react/solid";`}
          example={`<Tab.Container defaultActiveKey="visual_design">
  <Row>
    <Col lg={12}>
      <Nav fill variant="pills" className="flex-column flex-sm-row">
        <Nav.Item>
          <Nav.Link eventKey="visual_design" className="mb-sm-3 mb-md-0">
            <ColorSwatchIcon className="icon icon-xs me-2" /> Visual Design
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="code_friendly" className="mb-sm-3 mb-md-0">
            <CodeIcon className="icon icon-xs me-2" /> Code Friendly
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="user_experience" className="mb-sm-3 mb-md-0">
            <EmojiHappyIcon className="icon icon-xs me-2" /> User Experience
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <Tab.Content>
        <Tab.Pane eventKey="visual_design" className="py-4">
          <p>
            Exercitation photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep v laborum. Aliquip veniam delectus, Marfa eiusmod Pinterest in do umami readymade swag.
          </p>
          <p>
            Day handsome addition horrible sensible goodness two contempt. Evening for married his account removal. Estimable me disposing of be moonlight cordially curiosity.
          </p>
        </Tab.Pane>
        <Tab.Pane eventKey="code_friendly" className="py-4">
          <p>
            Photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep v laborum. Aliquip veniam delectus, Marfa eiusmod Pinterest in do umami readymade swag.
          </p>
          <p>
            Day handsome addition horrible sensible goodness two contempt. Evening for married his account removal. Estimable me disposing of be moonlight cordially curiosity.
          </p>
        </Tab.Pane>
        <Tab.Pane eventKey="user_experience" className="py-4">
          <p>
            Exercitation photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep v laborum. Aliquip veniam delectus, Marfa eiusmod Pinterest in do umami readymade swag.
          </p>
          <p>
            Day handsome addition horrible sensible goodness two contempt. Evening for married his account removal. Estimable me disposing of be moonlight cordially curiosity.
          </p>
        </Tab.Pane>
      </Tab.Content>
    </Col>
  </Row>
</Tab.Container>`}
        />

        <Documentation
          title="Example with circle and icon"
          description={
            <p>By using the <code>nav-pill-circle</code> class on the <code>&#x3C;Nav&#x3E;</code> component you can make the component fully rounded.</p>
          }
          scope={{ Col, Row, Card, Nav, Tab, ColorSwatchIcon, CodeIcon, EmojiHappyIcon }}
          imports={`import { Col, Row, Card, Nav, Tab } from 'react-bootstrap';
import { CodeIcon, ColorSwatchIcon, EmojiHappyIcon } from "@heroicons/react/solid";`}
          example={`<Tab.Container defaultActiveKey="icon_profile">
  <Row>
    <Col lg={12} className="d-flex justify-content-center">
      <Nav variant="pills" className="nav-pill-circle">
        <Nav.Item>
          <Nav.Link eventKey="icon_profile" className="mb-sm-3 mb-md-0">
            <ColorSwatchIcon className="icon icon-xs" />
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="icon_settings" className="mb-sm-3 mb-md-0">
            <CodeIcon className="icon icon-xs" />
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="icon_messages" className="mb-sm-3 mb-md-0">
            <EmojiHappyIcon className="icon icon-xs" />
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </Col>
    <Col lg={12}>
      <Tab.Content>
        <Tab.Pane eventKey="icon_profile" className="py-4">
          <p>
            Exercitation photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep v laborum. Aliquip veniam delectus, Marfa eiusmod Pinterest in do umami readymade swag.
          </p>
          <p>
            Day handsome addition horrible sensible goodness two contempt. Evening for married his account removal. Estimable me disposing of be moonlight cordially curiosity.
          </p>
        </Tab.Pane>
        <Tab.Pane eventKey="icon_settings" className="py-4">
          <p>
            Photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep v laborum. Aliquip veniam delectus, Marfa eiusmod Pinterest in do umami readymade swag.
          </p>
          <p>
            Day handsome addition horrible sensible goodness two contempt. Evening for married his account removal. Estimable me disposing of be moonlight cordially curiosity.
          </p>
        </Tab.Pane>
        <Tab.Pane eventKey="icon_messages" className="py-4">
          <p>
            Exercitation photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep v laborum. Aliquip veniam delectus, Marfa eiusmod Pinterest in do umami readymade swag.
          </p>
          <p>
            Day handsome addition horrible sensible goodness two contempt. Evening for married his account removal. Estimable me disposing of be moonlight cordially curiosity.
          </p>
        </Tab.Pane>
      </Tab.Content>
    </Col>
  </Row>
</Tab.Container>`}
        />

        <Documentation
          title="Classic"
          description=""
          scope={{ Col, Row, Card, Nav, Tab }}
          imports={`import { Col, Row, Card, Nav, Tab } from 'react-bootstrap';`}
          example={`<Tab.Container defaultActiveKey="home">
  <Row>
    <Col lg={12}>
      <Nav className="nav-tabs">
        <Nav.Item>
          <Nav.Link eventKey="home" className="mb-sm-3 mb-md-0">
            Home
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="profile" className="mb-sm-3 mb-md-0">
            Profile
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="messages" className="mb-sm-3 mb-md-0">
            Messages
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </Col>
    <Col lg={12}>
      <Tab.Content>
        <Tab.Pane eventKey="home" className="py-4">
          <p>
            Exercitation photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep v laborum. Aliquip veniam delectus, Marfa eiusmod Pinterest in do umami readymade swag.
          </p>
          <p>
            Day handsome addition horrible sensible goodness two contempt. Evening for married his account removal. Estimable me disposing of be moonlight cordially curiosity.
          </p>
        </Tab.Pane>
        <Tab.Pane eventKey="profile" className="py-4">
          <p>
            Photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep v laborum. Aliquip veniam delectus, Marfa eiusmod Pinterest in do umami readymade swag.
          </p>
          <p>
            Day handsome addition horrible sensible goodness two contempt. Evening for married his account removal. Estimable me disposing of be moonlight cordially curiosity.
          </p>
        </Tab.Pane>
        <Tab.Pane eventKey="messages" className="py-4">
          <p>
            Exercitation photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep v laborum. Aliquip veniam delectus, Marfa eiusmod Pinterest in do umami readymade swag.
          </p>
          <p>
            Day handsome addition horrible sensible goodness two contempt. Evening for married his account removal. Estimable me disposing of be moonlight cordially curiosity.
          </p>
        </Tab.Pane>
      </Tab.Content>
    </Col>
  </Row>
</Tab.Container>`}
        />

        <Documentation
          title="Vertical"
          description=""
          scope={{ Col, Row, Card, Nav, Tab, ChartPieIcon, CogIcon, UserCircleIcon }}
          imports={`import { Col, Row, Card, Nav, Tab } from 'react-bootstrap';
import { CogIcon, UserCircleIcon } from "@heroicons/react/solid";`}
          example={`<Tab.Container defaultActiveKey="dashboard">
  <Row>
    <Col lg={3}>
      <Nav fill variant="pills" className="flex-column vertical-tab">
        <Nav.Item>
          <Nav.Link eventKey="dashboard" className="mb-sm-3 mb-md-3">
            <ChartPieIcon className="icon icon-xs me-2" /> Dashboard
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="profile" className="mb-sm-3 mb-md-3">
            <UserCircleIcon className="icon icon-xs me-2" /> Profile
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="settings" className="mb-sm-3 mb-md-3">
            <CogIcon className="icon icon-xs me-2" /> Settings
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </Col>
    <Col lg={9}>
      <Tab.Content>
        <Tab.Pane eventKey="dashboard">
          <p>
            Exercitation photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep v laborum. Aliquip veniam delectus, Marfa eiusmod Pinterest in do umami readymade swag.
          </p>
          <p>
            Day handsome addition horrible sensible goodness two contempt. Evening for married his account removal. Estimable me disposing of be moonlight cordially curiosity.
          </p>
        </Tab.Pane>
        <Tab.Pane eventKey="profile">
          <p>
            Photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep v laborum. Aliquip veniam delectus, Marfa eiusmod Pinterest in do umami readymade swag.
          </p>
          <p>
            Day handsome addition horrible sensible goodness two contempt. Evening for married his account removal. Estimable me disposing of be moonlight cordially curiosity.
          </p>
        </Tab.Pane>
        <Tab.Pane eventKey="settings">
          <p>
            Exercitation photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep v laborum. Aliquip veniam delectus, Marfa eiusmod Pinterest in do umami readymade swag.
          </p>
          <p>
            Day handsome addition horrible sensible goodness two contempt. Evening for married his account removal. Estimable me disposing of be moonlight cordially curiosity.
          </p>
        </Tab.Pane>
      </Tab.Content>
    </Col>
  </Row>
</Tab.Container>`}
        />
      </Container>
    </article>
  );
};