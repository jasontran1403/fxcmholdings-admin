import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import DataTable from 'react-data-table-component';
import { formatToCurrency } from "../../../helpers";

const Investments = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <FixedHeaderDatatables />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

const FixedHeaderDatatables = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGVzIjpbIlJPTEVfQURNSU4iXSwiaXNzIjoiQURNSU5fTE9HSU4iLCJleHAiOjE3MDI2Njg3ODJ9.2uQJhG5z3Geh_ixW2h3vxdVEfWXU3P2yfODGOTX-Ju0");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("http://localhost:8080/api/admin/listInvestment", requestOptions)
            .then(response => response.json())
            .then(result => {
                setData(result);
                console.log(result);
            })
            .catch(error => console.log('error', error));

    }, []);

    const columns = [
        {
            name: <span className='font-weight-bold fs-13'>ID</span>,
            selector: row => row.id,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Time</span>,
            selector: row => row.time,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Investment Code</span>,
            selector: row => row.code,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Price</span>,
            selector: row => formatToCurrency(row.capital),
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Countdown</span>,
            selector: row => row.timeEnd === "6 tháng" ? `${row.count}/6` : `${row.count}/12`,
            sortable: true
        },
    ];

    return (
        <DataTable
            columns={columns}
            data={data}
            pagination
        />
    );
};

export default Investments;