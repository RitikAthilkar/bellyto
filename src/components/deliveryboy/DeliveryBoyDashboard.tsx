import React from 'react'
import Nav from '../nav'
import DeliveryAssignment from "./DeliveryAssignment";
import ActiveAssignment from './ActiveAssignment';
const DeliveryBoyDashboard = () => {
  return (
    <>
      <Nav />
      <h1>deliver boyyy</h1>
      {/* <DeliveryAssignment /> */}
      <ActiveAssignment/>
    </>
  );
}

export default DeliveryBoyDashboard
