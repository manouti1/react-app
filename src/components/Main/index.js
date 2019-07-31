import React from 'react';
import {Switch,Route} from 'react-router-dom';
import {Shipments} from '../Shipments/Shipments';
import {ShipmentDetails} from '../ShipmentDetails/ShipmentDetails';
const Main=props=>(
    <Switch>
        <Route  exact path="/" component={Shipments} />
        <Route path="/shipment-details/:id" component={ShipmentDetails} /> 
    </Switch>
);

export default Main;