import React, { useState } from 'react';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import DataTable from 'react-data-table-component';
import { formatToCurrency } from "../../../helpers";

const Transaction = () => {
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
    const [searchText, setSearchText] = useState('');

    const handleSearch = (text) => {
        setSearchText(text);
    };

    const data = [
        {
            code: "e36cc880-e710-4791-99f6-292d73ee17c3",
            time: "18:02:31 10/12/2023",
            investmentCode: "4b7a71d1ec7d",
            amount: "500",
            type: "Monthly Commission",
            status: "success"
        },
        {
            code: "e36cc880-e710-4791-99f6-292d73ee17c3",
            time: "18:02:31 10/12/2023",
            investmentCode: "4b7a71d1ec7d",
            amount: "500",
            type: "Monthly Commission",
            status: "success"
        },
        {
            code: "e36cc880-e710-4791-99f6-292d73ee17c3",
            time: "18:02:31 10/12/2023",
            investmentCode: "4b7a71d1ec7d",
            amount: "500",
            type: "Monthly Commission",
            status: "success"
        },
        {
            code: "e36cc880-e710-4791-99f6-292d73ee17c3",
            time: "18:02:31 10/12/2023",
            investmentCode: "4b7a71d1ec7d",
            amount: "500",
            type: "Monthly Commission",
            status: "success"
        },
        {
            code: "e36cc880-e710-4791-99f6-292d73ee17c3",
            time: "18:02:31 10/12/2023",
            investmentCode: "4b7a71d1ec7d",
            amount: "500",
            type: "Monthly Commission",
            status: "success"
        },
    ];

    const filteredData = data.filter((item) =>
        item.code.toLowerCase().includes(searchText.toLowerCase()) || 
        item.investmentCode.toLowerCase().includes(searchText.toLowerCase())
    );

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
            selector: row => row.investmentCode,
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
