import React, { useState, useEffect } from 'react';

import { Row, Col } from 'reactstrap';
import { formatToCurrency } from "../../helpers";

const LatestTransation = () => {
    const [latestInvestment, setLatestInvestment] = useState([]);

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
            .then(result => setLatestInvestment(result.listInvestments))
            .catch(error => console.log('error', error));
    }, []);

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title mb-4">Latest Transaction</h4>

                            <div className="table-responsive">
                                <table className="table table-centered table-nowrap mb-0">

                                    <thead>
                                        <tr>
                                            <th scope="col">Username</th>
                                            <th scope="col">Time</th>
                                            <th scope="col">Investment code</th>
                                            <th scope="col">Price</th>
                                            <th scope="col">Period</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {latestInvestment?.map((item, key) => (<tr key={key}>
                                            <td>{item.username}</td>
                                            <td>{item.time}</td>
                                            <td>{item.code}</td>
                                            <td>{formatToCurrency(item.capital)}</td>
                                            <td>{item.timeEnd}</td>
                                        </tr>))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default LatestTransation;