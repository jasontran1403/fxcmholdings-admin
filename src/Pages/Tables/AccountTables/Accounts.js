import React, { useState, useEffect } from 'react';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import DataTable from 'react-data-table-component';

const Accounts = () => {
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

    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGVzIjpbIlJPTEVfQURNSU4iXSwiaXNzIjoiQURNSU5fTE9HSU4iLCJleHAiOjE3MDI2Njg3ODJ9.2uQJhG5z3Geh_ixW2h3vxdVEfWXU3P2yfODGOTX-Ju0");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://seashell-app-bbv6o.ondigitalocean.app/api/admin/listAccount", requestOptions)
            .then(response => response.json())
            .then(result => {
                setData(result);
                console.log(result);
            })
            .catch(error => console.log('error', error));

    }, []);

    const handleSearch = (text) => {
        setSearchText(text);
    };

    const filteredData = data.filter((item) =>
        item.username.toLowerCase().includes(searchText.toLowerCase()) ||
        item.email.toLowerCase().includes(searchText.toLowerCase()) ||
        item.rootUsername.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            name: <span className='font-weight-bold fs-13'>Username</span>,
            selector: row => row.username,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Email</span>,
            selector: row => row.email,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Fullname</span>,
            selector: row => row.name,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Phone Number</span>,
            selector: row => row.phoneNumber,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Sponsor</span>,
            selector: row => row.rootUsername,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Status</span>,
            sortable: true,
            selector: (cell) => {
                switch (cell.locked) {
                    case false:
                        return <span className="badge badge-soft-success"> {cell.locked !== true ? "Available" : "Locked"} </span>;
                    case true:
                        return <span className="badge badge-soft-danger"> {cell.locked  !== true ? "Available" : "Locked"} </span>;
                    default:
                        return <span className="badge badge-soft-success"> {cell.locked ? "Available" : "Locked"} </span>;
                }
            },
        },
        {
            name: <span className='font-weight-bold fs-13'>Action</span>,
            sortable: true,

            cell: () => {
                return (
                    <UncontrolledDropdown className="dropdown d-inline-block">
                        <DropdownToggle className="btn btn-soft-secondary btn-sm" tag="button">
                            <i className="ri-more-fill align-middle"></i>
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-end">
                            <DropdownItem href="#!"><i className="ri-eye-fill align-bottom me-2 text-muted"></i>View</DropdownItem>
                            <DropdownItem className='edit-item-btn'><i className="ri-pencil-fill align-bottom me-2 text-muted"></i>Edit</DropdownItem>
                            <DropdownItem className='remove-item-btn'> <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Delete </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                );
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

export default Accounts;
