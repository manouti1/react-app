import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';

export class ShipmentDetails extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
    this.SURL = 'http://localhost:3001';
    this.state = {
      shipmentDetails: null,
      services: [],
      cargo: [],
      show: false,
      hasError: false
    }
    this.id = this.props.match.params.id;
  }

  goBack() {
    this.props.history.goBack();
  }

  loadShipmentDetails() {
    let url = `${this.SURL}/shipments/${this.id}`;
    fetch(url).then(resp => resp.json()).then(data => {
      try {
        let services = data.services.map((service, index) => {
          return (
            <tr key={index}><td>{service.type}</td></tr>
          )
        });

        let cargo = data.cargo.map((cargo, index) => {
          return (
            <tr key={index}>
              <td> {cargo.type}</td>
              <td>{cargo.description}</td>
              <td>{cargo.volume}</td>
            </tr>
          )
        });
        this.setState({ shipmentDetails: data, services: services, cargo: cargo });
      } catch (e) {
        this.setState({ hasError: true });
      }
    });


  }

  updateShipmentName(event) {
    event.preventDefault();
    let options = {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: event.target.elements.formShipmentName.value })
    }
    let baseUrl = `${this.SURL}/shipments/${this.id}`;

    fetch(baseUrl, options).then(data => {
      this.setState({ show: true });
    });

  }

  componentDidMount() {
    this.loadShipmentDetails();
  }

  render() {
    const { shipmentDetails } = this.state;
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (<div>
        <h1>Something went wrong.</h1>
        <div>
          <Button onClick={this.goBack.bind(this)} variant="outline-dark">Go Back</Button>
        </div>
      </div>);
    }
    return (
      <div className="ShipmentDetails">

        {
          shipmentDetails !== null &&
          <Container>
            <Row>
              <Col sm><h4>{shipmentDetails.id}</h4></Col>
            </Row>
            <Row>
              <Col sm><h5 className="text-info">Shipment Name: </h5>
                <Form noValidate onSubmit={(e) => this.updateShipmentName(e)}>
                  <Form.Group controlId="formShipmentName"  >
                    <Form.Control type="text" placeholder="Enter shipment name" defaultValue={shipmentDetails.name} />
                  </Form.Group>
                  <Button variant="primary" type="submit" >
                    Update
                </Button>
                </Form>
                <div
                  aria-live="polite"
                  aria-atomic="true"
                  style={{
                    position: 'relative',
                    minHeight: '100px',
                  }}
                >
                  <Toast style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                  }} onClose={() => this.setState({ show: false })} show={this.state.show} delay={3000} autohide>
                    <Toast.Header>
                      <img
                        src="holder.js/20x20?text=%20"
                        className="rounded mr-2"
                        alt=""
                      />
                      <strong className="mr-auto">{shipmentDetails.id}</strong>
                    </Toast.Header>
                    <Toast.Body>Name updated Successfully!</Toast.Body>
                  </Toast>
                </div>
              </Col>
              <Col sm><h5 className="text-info">UserId: </h5>{shipmentDetails.userId}</Col>
              <Col sm><h5 className="text-info">Status: </h5>{shipmentDetails.status}</Col>
            </Row>
            <Row className="mt-3">
              <Col sm><h5 className="text-info">Origin: </h5>{shipmentDetails.origin}</Col>
              <Col sm><h5 className="text-info">Destination: </h5>{shipmentDetails.destination}</Col>
              <Col sm><h5 className="text-info">Mode: </h5>{shipmentDetails.mode}</Col>
            </Row>
            <Row className="mt-3">
              <Col sm>
                <h5 className="text-info">Services: </h5>
                <Table className="shipment-table" responsive>
                  <thead>
                    <tr>
                      <th>
                        Type
                  </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.services}
                  </tbody>
                </Table>
              </Col>
            </Row>
            <Row>
              <Col sm>
                <h5 className="text-info">Cargo: </h5>
                <Table className="shipment-table" responsive>
                  <thead>
                    <tr>
                      <th>
                        Type
                    </th>
                      <th>
                        Description
                    </th>
                      <th>
                        Volume
                    </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.cargo}
                  </tbody>
                </Table>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col sm>
                <Button onClick={this.goBack.bind(this)} variant="outline-dark">Go Back</Button>
              </Col>
            </Row>
          </Container>
        }
      </div>
    )
  }
}
