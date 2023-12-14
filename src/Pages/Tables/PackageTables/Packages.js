import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import DataTable from 'react-data-table-component';
import { formatToCurrency } from "../../../helpers";

const Packages = () => {
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

        fetch("https://seashell-app-bbv6o.ondigitalocean.app/api/admin/listPackage", requestOptions)
            .then(response => response.json())
            .then(result => setData(result))
            .catch(error => console.log('error', error));

    }, []);

    const columns = [
        {
            name: <span className='font-weight-bold fs-13'>Tên gói</span>,
            selector: row => row.name,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Giá</span>,
            selector: row => formatToCurrency(row.price),
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Lãi tháng</span>,
            selector: row => `${row.daily}%`,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Hoa hồng trực tiếp</span>,
            selector: row => `${row.directCommission}%`,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Status</span>,
            sortable: true,
            selector: (cell) => {
                switch (cell.status) {
                    case 0:
                        return <span className="badge badge-soft-info"> {cell.status === 0 ? "Running" : "Stopped"} </span>;
                    case 1:
                        return <span className="badge badge-soft-danger"> {cell.status === 0 ? "Running" : "Stopped"} </span>;
                    default:
                        return <span className="badge badge-soft-info"> {cell.status === 0 ? "Running" : "Stopped"} </span>;
                }
            },
        },
        {
            name: <span className='font-weight-bold fs-13'>Action</span>,
            sortable: false,
            cell: () => {
                return (
                    <UncontrolledDropdown className="dropdown d-inline-block">
                        <DropdownToggle className="btn btn-soft-secondary btn-sm" tag="button">
                            <i className="bx bx-toggle-right"></i>
                        </DropdownToggle>
                    </UncontrolledDropdown>
                );
            },
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

export default Packages;
