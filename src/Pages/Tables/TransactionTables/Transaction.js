import React, { useState, useEffect } from 'react';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import DataTable from 'react-data-table-component';
import { formatToCurrency } from "../../../helpers";

const Transaction = () => {
    var body = document.body;
    body.classList.remove("sidebar-enable");

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

    const [searchText, setSearchText] = useState('');

    const handleSearch = (text) => {
        setSearchText(text);
    };

    const filteredData = data.filter((item) =>
        (item.username && item.username.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.frominvestment && item.frominvestment.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.code && item.code.toLowerCase().includes(searchText.toLowerCase()))
    );

    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${JSON.parse(localStorage.getItem("authUser")).access_token}`);

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
            name: <span className='font-weight-bold fs-13'>Code</span>,
            selector: row => row.code,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Time</span>,
            selector: row => row.time,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Investment Code</span>,
            selector: row => row.frominvestment,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Username</span>,
            selector: row => row.username,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Amount</span>,
            selector: row => formatToCurrency(row.amount),
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Type</span>,
            selector: row => row.type,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Status</span>,
            sortable: true,
            selector: (cell) => {
                switch (cell.status) {
                    case "success":
                        return <span className="badge badge-soft-success"> {cell.status} </span>;
                    default:
                        return <span className="badge badge-soft-warning"> {cell.status} </span>;
                }
            },
        },
    ];



    return (
        <DataTable
            columns={columns}
            data={filteredData}
            pagination
            subHeader
            subHeaderComponent={
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên hoặc email hoặc người giới thiệu..."
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="form-control form-control-sm"
                />
            }
        />
    );
};

export default Transaction;
