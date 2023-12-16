import React, { useState, useEffect } from 'react';
import { Card, CardBody, Col, Container, Row, CardTitle } from 'reactstrap';
import DataTable from 'react-data-table-component';
import { formatToCurrency } from "../../../helpers";

const Transfer = () => {
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
    const [username, setUsername] = useState("");
    const [amount, setAmount] = useState(0);

    const handleTransfer = () => {
        if (username === "") {
            alert("Vui lòng nhập thông tin để chuyển điểm nội bộ!");
            return;
        }
        if (typeof amount !== 'number' || isNaN(amount)) {
            alert("Số điểm phải là số hợp lệ!");
            return;
        } else if (amount <= 0) {
            alert("Vui lòng nhập số điểm > 0!");
            return;
        }

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${JSON.parse(localStorage.getItem("authUser")).access_token}`);

        var formdata = new FormData();
        formdata.append("username", username);
        formdata.append("amount", amount);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch("https://seashell-app-bbv6o.ondigitalocean.app/api/admin/getPoint", requestOptions)
            .then(response => response.text())
            .then(result => {
                if (result === "success") {
                    alert("Chuyển điểm nội bộ thành công!");
                } else if (result === "not existed") {
                    alert("username không tồn tại!");
                } else if (result === "amount not valid") {
                    alert("số điểm không hợp lệ!");
                }
            })
            .catch(error => console.log('error', error));
    }

    const [searchText, setSearchText] = useState('');

    const handleSearch = (text) => {
        setSearchText(text);
    };

    const filteredData = data.filter((item) =>
        (item.username && item.username.toLowerCase().includes(searchText.toLowerCase()))
    );

    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${JSON.parse(localStorage.getItem("authUser")).access_token}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://seashell-app-bbv6o.ondigitalocean.app/api/admin/getTransfer", requestOptions)
            .then(response => response.json())
            .then(result => setData(result))
            .catch(error => console.log('error', error));

    }, []);

    const columns = [
        {
            name: <span className='font-weight-bold fs-13'>Thời gian</span>,
            selector: row => row.time,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Người nhận</span>,
            selector: row => row.username,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Số lượng</span>,
            selector: row => formatToCurrency(row.amount),
            sortable: true
        }
    ];

    return (
        <div className="page-content">
            <Container fluid={true}>
                <Row>
                    <Col>
                        <Card>
                            <CardBody>
                                <CardTitle className="h4">Chuyển điểm nội bộ</CardTitle>
                                <p className="card-title-desc">
                                    Đây là chức năng dành riêng cho tài khoản với quyền <code>&lt;Admin&gt;</code>{" "}
                                </p>

                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Username người nhận
                                    </label>
                                    <div className="col-md-10">
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-number-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Số điểm
                                    </label>
                                    <div className="col-md-10">
                                        <input
                                            className="form-control"
                                            type="number"
                                            value={amount}  // Sử dụng value thay vì defaultValue
                                            min="0"
                                            onChange={(e) => setAmount(parseInt(e.target.value, 10))}
                                            id="example-number-input"
                                            required
                                        />
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <button
                                        onClick={handleTransfer}
                                        type="button"
                                        className="btn btn-info btn-lg waves-effect waves-light"
                                    >
                                        Chuyển điểm
                                    </button>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col lg={12}>
                        <Card>
                            <DataTable
                                columns={columns}
                                data={filteredData}
                                pagination
                                subHeader
                                subHeaderComponent={
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm theo username người nhận..."
                                        value={searchText}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="form-control form-control-sm"
                                    />
                                }
                            />
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Transfer;
