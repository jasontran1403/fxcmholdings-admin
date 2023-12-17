import React, { useState, useEffect } from 'react';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import DataTable from 'react-data-table-component';
import { formatToCurrency } from "../../../helpers";

const Withdraw = () => {
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
        item.hash.toLowerCase().includes(searchText.toLowerCase())
    );

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000); // Convert seconds to milliseconds

        const options = {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
        };

        return new Intl.DateTimeFormat('en-GB', options).format(date);
    };

    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${JSON.parse(localStorage.getItem("authUser")).access_token}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://seashell-app-bbv6o.ondigitalocean.app/api/admin/listWithdraw", requestOptions)
            .then(response => response.json())
            .then(result => {
                setData(result);
            })
            .catch(error => console.log('error', error));

    }, []);

    const columns = [
        {
            name: <span className='font-weight-bold fs-13'>Time</span>,
            selector: row => row.time,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Amount</span>,
            selector: row => formatToCurrency(row.amount),
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Status</span>,
            sortable: true,
            selector: (cell) => {
                switch (cell.status) {
                    case false:
                        return <span className="badge badge-soft-warning"> {cell.status ? "Success" : "Pending"} </span>;
                    case true:
                        return <span className="badge badge-soft-success"> {cell.status ? "Success" : "Pending"} </span>;
                    default:
                        return <span className="badge badge-soft-warning"> {cell.status ? "Success" : "Pending"} </span>;
                }
            },
        },
        {
            name: <span className='font-weight-bold fs-13'>Hash</span>,
            selector: row => { if (row.hash) return <a target="_blank" rel="noreferrer" href={`https://bscscan.com/tx/${row.hash}`}>Hash</a> },
            sortable: true
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
                    placeholder="Tìm kiếm theo hash giao dịch..."
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="form-control form-control-sm"
                />
            }
        />
    );
};

export default Withdraw;
