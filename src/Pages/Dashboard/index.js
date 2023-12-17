import React from "react";
import UsePanel from "./UserPanel";
import OrderStatus from "./OrderStatus";
import Notifications from "./Notifications";
import SocialSource from "./SocialSource";
import OverView from "./OverView";
import RevenueByLocation from "./RevenueByLocation";
import LatestTransation from "./LatestTransation";

import { Row, Container } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const Dashboard = () => {
  document.title = "Dashboard | FXCM Holdings - Admin Dashboard";

  var body = document.body;
  body.classList.remove("sidebar-enable");

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          {/* User Panel Charts */}
          <UsePanel />

          <OverView />
          <Row>
            {/* Overview Chart */}

            {/* Social Source Chart */}
            {/* <SocialSource /> */}
          </Row>

          {/* <Row>
            <OrderStatus />
            <Notifications />
            <RevenueByLocation />
          </Row> */}

          {/* Latest Transaction Table */}
          <LatestTransation />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
