import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination'
import Autocomplete from 'react-autocomplete';

import './Shipments.css';

export class Shipments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shipments: [],
      pageNo: 1,
      hasRecords: true,
      hasFilter: false,
      autocompleteData: [],
      value: '',
      limit: 20,
      sortParams: ''
    };
    this.oderBy = ['asc', 'desc'];
    this.SURL = 'http://localhost:3001';
  }

  getAutoCompleteData() {
    let url = `${this.SURL}/shipments`;
    fetch(url).then(resp => resp.json()).then(data => {
      let autocompleteArr = [];
      if (data) {
        data.forEach(shipment => {
          autocompleteArr.push({ id: shipment.id, name: shipment.name });
        });
      }
      this.setState({ autocompleteData: autocompleteArr });

    });
  }

  matchShipments(state, value) {
    return (
      state.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
      state.id.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  loadShipments() {
    let url = `${this.SURL}/shipments?_page=${this.state.pageNo}&_limit=${this.state.limit}`;
    if (this.state.value !== '') {
      url = `${this.SURL}/shipments?id=${this.state.value}`;
    }
    if (this.state.sortParams !== '') {
      url = url + this.state.sortParams;
    }

    fetch(url).then(resp => resp.json()).then(data => {
      let shipments = data.map((shipment, index) => {
        return (
          <tr title="Click to view Details" key={index} onClick={this.handleClick.bind(this, shipment.id)}>
            <td>{shipment.id}</td>
            <td>{shipment.name}</td>
            <td>{shipment.mode}</td>
            <td>{shipment.type}</td>
            <td>{shipment.destination}</td>
            <td>{shipment.origin}</td>
            <td>{shipment.total}</td>
            <td>{shipment.status}</td>
            <td>{shipment.userId}</td>
          </tr>

        )
      })
      this.setState({ shipments: shipments, hasRecords: shipments.length > 0, pageNo: this.state.pageNo });
    });
  }

  sortData(data) {
    if (this.state.sortParams.indexOf(data.order) >= 0) {
      data.order = this.oderBy.filter((x) => {
        return x !== data.order;
      })[0];
    }

    this.setState({ sortParams: `&_sort=${data.field}&_order=${data.order}`, value: '' });
  }

  handleClick(id) {
    this.props.history.push("/shipment-details/" + id)
  };

  goToNext() {
    if (this.state.shipments.length > 0) {
      this.setState({ pageNo: this.state.pageNo + 1 });
    }
  }

  goToPrevious() {
    if (this.state.pageNo > 1) {
      this.setState({ pageNo: this.state.pageNo - 1 });
    }
  }

  componentDidMount() {
    this.setState({ pageNo: this.state.pageNo });
    this.loadShipments();
    this.getAutoCompleteData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.pageNo !== this.state.pageNo
      || prevState.value !== this.state.value ||
      prevState.sortParams !== this.state.sortParams) {
      this.loadShipments();
    }
  }

  render() {
    return (
      <div className="Shipments">
        <h1>Shipments</h1>

        <div style={{ marginTop: 40, marginLeft: 50, marginBottom: 40 }}>
          <span>Shipment ID: </span>
          <Autocomplete
            value={this.state.value}
            inputProps={{ id: 'states-autocomplete' }}
            wrapperStyle={{ position: 'relative', display: 'inline-block' }}
            items={this.state.autocompleteData}
            getItemValue={item => item.id}
            shouldItemRender={this.matchShipments}
            onChange={(event, value) => this.setState({ value })}
            onSelect={value => this.setState({ value })}
            renderMenu={children => (
              <div className="menu">
                {children}
              </div>
            )}
            renderItem={(item, isHighlighted) => (
              <div
                className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
                key={item.id} >
                {item.name}
              </div>
            )}
          />
        </div>
        <Table className="shipment-table" responsive>
          <thead>
            <tr>
              <th onClick={this.sortData.bind(this, { field: 'id', order: 'desc' })}>Shipment ID</th>
              <th onClick={this.sortData.bind(this, { field: 'name', order: 'desc' })}>Name</th>
              <th onClick={this.sortData.bind(this, { field: 'mode', order: 'desc' })}>Mode</th>
              <th onClick={this.sortData.bind(this, { field: 'type', order: 'desc' })}>Type</th>
              <th onClick={this.sortData.bind(this, { field: 'destination', order: 'desc' })}>Destination</th>
              <th onClick={this.sortData.bind(this, { field: 'origin', order: 'desc' })}>Origin</th>
              <th onClick={this.sortData.bind(this, { field: 'total', order: 'desc' })}>Total</th>
              <th onClick={this.sortData.bind(this, { field: 'status', order: 'desc' })}>Status</th>
              <th onClick={this.sortData.bind(this, { field: 'userId', order: 'desc' })}>UserId</th>
            </tr>
          </thead>
          <tbody>
            {this.state.shipments}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="9">
                <div className="d-flex justify-content-center">
                  <Pagination>
                    <Pagination.Prev onClick={this.goToPrevious.bind(this)} />
                    <span className="mr-1 mt-1 ml-1">{this.state.pageNo}</span>
                    <Pagination.Next onClick={this.goToNext.bind(this)} />
                  </Pagination>
                </div>
              </td>
            </tr>
          </tfoot>
        </Table>

      </div>
    )
  }
}
