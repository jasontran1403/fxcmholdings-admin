import React, { useState, useEffect } from 'react';
import { Card, CardBody, Col, Container, Row, Modal, CardSubtitle } from 'reactstrap';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import DataTable from 'react-data-table-component';
import Slidewithfade from "../../UiElements/CarouselTypes/slidewithfade";

const Kyc = () => {
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
    const [modal_backdrop1, setmodal_backdrop1] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [message, setMessage] = useState();
    const [status, setStatus] = useState(0);
    const [image1, setImage1] = useState("");
    const [image2, setImage2] = useState("");
    const [image3, setImage3] = useState("");
    const [image4, setImage4] = useState("");

    const handleStatusChange = (event) => {
        const selectedValue = event.target.value;
        console.log(selectedValue);
        setStatus(parseInt(selectedValue, 10)); // Chuyển đổi giá trị sang số nguyên
      };

    const tog_backdrop1 = username => {
        if (username !== "") {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${JSON.parse(localStorage.getItem("authUser")).access_token}`);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(`https://seashell-app-bbv6o.ondigitalocean.app/api/admin/getKycImage/${username}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    setImage1(result[0]);
                    setImage2(result[1]);
                    setImage3(result[2]);
                    setImage4(result[3]);
                })
                .catch(error => console.log('error', error));
        }
        setmodal_backdrop1(!modal_backdrop1);
    }


    const handleSearch = (text) => {
        setSearchText(text);
    };

    const handleKyc = () => {
        if (status === 2 && message === "") {
            alert("Vui lòng nhập thông tin lời nhắn");
            return;
        }
        if (status === 0) {
            return;
        }

        console.log({ message, status });
    };

    const filteredData = data.filter((item) =>
        (item.username && item.username.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.email && item.email.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.identityNumber && item.identityNumber.toLowerCase().includes(searchText.toLowerCase()))
    );

    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${JSON.parse(localStorage.getItem("authUser")).access_token}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://seashell-app-bbv6o.ondigitalocean.app/api/admin/listKyc", requestOptions)
            .then(response => response.json())
            .then(result => {
                setData(result);
            })
            .catch(error => console.log('error', error));

    }, []);

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
            name: <span className='font-weight-bold fs-13'>Identity Number</span>,
            selector: row => row.identityNumber,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Status</span>,
            sortable: true,
            selector: (cell) => {
                switch (cell.kycStatus) {
                    case 0:
                        return <span className="badge badge-soft-warning"> {cell.kycStatus === 0 ? "Pending" : cell.kycStatus === 1 ? "Success" : "Declined"} </span>;
                    case 1:
                        return <span className="badge badge-soft-success"> {cell.kycStatus === 0 ? "Pending" : cell.kycStatus === 1 ? "Success" : "Declined"} </span>;
                    case 2:
                        return <span className="badge badge-soft-danger"> {cell.kycStatus === 0 ? "Pending" : cell.kycStatus === 1 ? "Success" : "Declined"} </span>;
                    default:
                        return <span className="badge badge-soft-warning"> {cell.kycStatus === 0 ? "Pending" : cell.kycStatus === 1 ? "Success" : "Declined"} </span>;
                }
            },
        },
        {
            name: <span className='font-weight-bold fs-13'>Action</span>,
            sortable: true,

            cell: (cell) => {
                return (
                    <UncontrolledDropdown className="dropdown d-inline-block">
                        <DropdownToggle className="btn btn-soft-secondary btn-sm" tag="button">
                            <i onClick={() => {
                                tog_backdrop1(cell.username);
                            }} className="ri-eye-fill align-bottom me-2 text-muted"></i>
                        </DropdownToggle>
                    </UncontrolledDropdown>
                );
            },
        },
    ];

    return (
        <>
            <Row>
                <Col lg={12}>
                    <Card>
                        <CardBody>
                            <div>
                                <div className="d-flex flex-wrap gap-3">
                                    <Modal
                                        isOpen={modal_backdrop1}
                                        toggle={() => {
                                            tog_backdrop1();
                                        }}

                                    >
                                        <div className="modal-header">
                                            <button
                                                type="button"
                                                className="btn-close"
                                                onClick={() => {
                                                    setmodal_backdrop1(false);
                                                }}
                                                aria-label="Close"
                                            ></button>
                                        </div>
                                        <div className="modal-body">
                                            <form>
                                                <div className="mb-3">
                                                    <Slidewithfade image1={image1} image2={image2} image3={image3} image4={image4} />
                                                </div>
                                                <div className="mb-3">
                                                    <label
                                                        htmlFor="message-text"
                                                        className="col-form-label"
                                                    >
                                                        Message:
                                                    </label>
                                                    <textarea
                                                        className="form-control"
                                                        id="message-text"
                                                        onChange={(e) => { setMessage(e.target.value) }}
                                                        required
                                                    ></textarea>
                                                </div>
                                                <Row className="mb-3">
                                                    <label className="col-md-2 col-form-label">Trạng thái</label>
                                                    <div className="col-md-10">
                                                        <select className="form-control" onChange={handleStatusChange} value={status}>
                                                            <option value={0}>Chờ</option>
                                                            <option value={1}>Duyệt</option>
                                                            <option value={2}>Không duyệt</option>
                                                        </select>
                                                    </div>
                                                </Row>
                                            </form>
                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                data-bs-dismiss="modal"
                                                onClick={() => {
                                                    setmodal_backdrop1(false);
                                                }}
                                            >
                                                Close
                                            </button>
                                            <button onClick={handleKyc} type="button" className="btn btn-primary">
                                                Cập nhật
                                            </button>
                                        </div>
                                    </Modal>
                                </div>

                                <div
                                    className="modal fade"
                                    id="exampleModal"
                                    tabIndex="-1"
                                    aria-labelledby="exampleModalLabel"
                                    aria-hidden="true"
                                >
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLabel">
                                                    New message
                                                </h5>
                                                <button
                                                    type="button"
                                                    className="btn-close"
                                                    data-bs-dismiss="modal"
                                                    aria-label="Close"
                                                ></button>
                                            </div>
                                            <div className="modal-body">
                                                <form>
                                                    <div className="mb-3">
                                                        <label
                                                            htmlFor="recipient-name"
                                                            className="col-form-label"
                                                        >
                                                            Recipient:
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="recipient-name"
                                                        />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label
                                                            htmlFor="message-text"
                                                            className="col-form-label"
                                                        >
                                                            Message:
                                                        </label>
                                                        <textarea
                                                            className="form-control"
                                                            id="message-text"
                                                        ></textarea>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="modal-footer">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    data-bs-dismiss="modal"
                                                >
                                                    Close
                                                </button>
                                                <button type="button" className="btn btn-primary">
                                                    Send message
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardBody>

                    </Card>

                </Col>

            </Row>
            <DataTable
                columns={columns}
                data={filteredData}
                pagination
                subHeader
                subHeaderComponent={
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo username hoặc email hoặc số CMND/CCCD..."
                        value={searchText}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="form-control form-control-sm"
                    />
                }
            />
        </>
    );
};

export default Kyc;
