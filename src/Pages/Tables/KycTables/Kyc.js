import React, { useState, useEffect } from 'react';
import { Card, CardBody, Col, Container, Row, Toast, ToastHeader, ToastBody, UncontrolledDropdown, DropdownToggle, Modal } from 'reactstrap';
import DataTable from 'react-data-table-component';
import Slidewithfade from "../../UiElements/CarouselTypes/slidewithfade";
import logo from "../../../assets/images/logo-sm.png";

const Kyc = () => {
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
    const [modal_backdrop1, setmodal_backdrop1] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [message, setMessage] = useState();
    const [status, setStatus] = useState(0);
    const [usernameKyc, setUsernameKyc] = useState("");
    const [image1, setImage1] = useState("");
    const [image2, setImage2] = useState("");
    const [image3, setImage3] = useState("");
    const [image4, setImage4] = useState("");
    const [toast1, settoast1] = useState(false);
    const [messageContent, setMessageContent] = useState("");

    const handleStatusChange = (event) => {
        const selectedValue = event.target.value;
        setStatus(parseInt(selectedValue, 10)); // Chuyển đổi giá trị sang số nguyên
    };

    const clodeModal = () => {
        setmodal_backdrop1(!modal_backdrop1);
    }

    const toggleToast1 = content => {
        settoast1(!toast1);
        setMessageContent(content);

        setTimeout(() => {
            settoast1(!toast1);
            window.location.reload();
        }, 1500);
    };

    const tog_backdrop1 = username => {
        setUsernameKyc(username);
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
            alert("Vui lòng nhập lý do từ chối KYC");
            return;
        }

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${JSON.parse(localStorage.getItem("authUser")).access_token}`);

        var raw = JSON.stringify({
            "username": usernameKyc,
            "message": message,
            "status": status
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://seashell-app-bbv6o.ondigitalocean.app/api/admin/kyc", requestOptions)
            .then(response => response.text())
            .then(result => {
                if (result === "declined" || result === "approved") {
                    toggleToast1("Cập nhật KYC thành công!");
                    clodeModal();
                }
            })
            .catch(error => console.log('error', error));
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
                    <UncontrolledDropdown className="dropdown d-inline-block" onClick={() => {
                        tog_backdrop1(cell.username);
                    }} >
                        <DropdownToggle className="btn btn-soft-secondary btn-sm" tag="button">
                            <i className="ri-eye-fill align-bottom me-2 text-muted"></i>
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
                            </div>
                        </CardBody>

                    </Card>

                </Col>

            </Row>
            <div
                className="position-fixed top-0 end-0 p-3"
                style={{ zIndex: "1005" }}
            >
                <Toast isOpen={toast1}>
                    <ToastHeader>
                        <img
                            src={logo}
                            alt=""
                            className="me-2"
                            height="18"
                        />
                        FXCM Holdings
                    </ToastHeader>
                    <ToastBody color="success">
                        {messageContent}
                    </ToastBody>
                </Toast>
            </div>
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
