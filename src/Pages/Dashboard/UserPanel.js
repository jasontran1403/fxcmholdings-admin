import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import { formatToCurrency } from "../../helpers";

import RadialChart1 from "./userpanelChart1";
import RadialChart2 from "./userpanelChart2";
import RadialChart3 from "./userpanelChart3";

const UserPanel = () => {
  const [bnbBalance, setBnbBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${JSON.parse(localStorage.getItem("authUser")).access_token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("https://seashell-app-bbv6o.ondigitalocean.app/api/admin/static", requestOptions)
      .then(response => response.json())
      .then(result => {
        setBnbBalance(result.bnbWallet);
        setDepositAmount(result.totalDeposit);
        setWithdrawAmount(result.totalWithdraw);
        setTotalRevenue(result.totalInvestment);
      })
      .catch(error => console.log('error', error));
  }, []);

  return (
    <React.Fragment>
      <Row>
        <Col xl={3} sm={6}>
          <Card>
            <CardBody>
              <div className="d-flex text-muted">
                <div className="flex-shrink-0 me-3 align-self-center">
                  <div id="radialchart-1" className="apex-charts" dir="ltr">
                    <RadialChart1 />
                  </div>
                </div>

                <div className="flex-grow-1 overflow-hidden">
                  <p className="mb-1">Total revenue</p>
                  <h5 className="mb-3">{formatToCurrency(totalRevenue)}</h5>
                  <p className="text-truncate mb-0">
                    <span className="text-success me-2">
                      {" "}
                      <i className="ri-arrow-right-up-line align-bottom ms-1"></i>
                    </span>{" "}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col xl={3} sm={6}>
          <Card>
            <CardBody>
              <div className="d-flex">
                <div className="flex-shrink-0 me-3 align-self-center">
                  <RadialChart2
                    id="radialchart-2"
                    className="apex-charts"
                    dir="ltr"
                  />
                </div>

                <div className="flex-grow-1 overflow-hidden">
                  <p className="mb-1">Total deposit</p>
                  <h5 className="mb-3">{formatToCurrency(depositAmount)}</h5>
                  <p className="text-truncate mb-0">
                    <span className="text-success me-2">
                      {" "}
                      <i className="ri-arrow-right-up-line align-bottom ms-1"></i>
                    </span>{" "}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col xl={3} sm={6}>
          <Card>
            <CardBody>
              <div className="d-flex text-muted">
                <div className="flex-shrink-0 me-3 align-self-center">
                  <RadialChart3
                    id="radialchart-3"
                    className="apex-charts"
                    dir="ltr"
                  />
                </div>

                <div className="flex-grow-1 overflow-hidden">
                  <p className="mb-1">Total Withdraw</p>
                  <h5 className="mb-3">{formatToCurrency(withdrawAmount)}</h5>
                  <p className="text-truncate mb-0">
                    <span className="text-success me-2">
                      {" "}
                      <i className="ri-arrow-right-up-line align-bottom ms-1"></i>
                    </span>{" "}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col xl={3} sm={6}>
          <Card>
            <CardBody>
              <div className="d-flex text-muted">
                <div className="flex-shrink-0 me-3 align-self-center">
                  <div className="avatar-sm">
                    <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                      <i className="ri-group-line"></i>
                    </div>
                  </div>
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <p className="mb-1">BNB Balance</p>
                  <h5 className="mb-3">{`${bnbBalance} BNB`}</h5>
                  <p className="text-truncate mb-0">
                    <span className="text-success me-2">
                      {" "}
                      <i className="ri-arrow-right-up-line align-bottom ms-1"></i>
                    </span>{" "}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default UserPanel;
