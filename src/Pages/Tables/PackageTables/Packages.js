import React, { useState, useEffect } from 'react';
import { Card, CardBody, Col, Container, Row, CardTitle, DropdownToggle, UncontrolledDropdown, Toast, ToastHeader, ToastBody } from 'reactstrap';
import DataTable from 'react-data-table-component';
import { formatToCurrency } from "../../../helpers";
import logo from "../../../assets/images/logo-sm.png";

const Packages = () => {
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
    const [packageName, setPackageName] = useState("");
    const [direct, setDirect] = useState(0);
    const [price, setPrice] = useState(0);
    const [daily, setDaily] = useState(0);
    const [toast1, settoast1] = useState(false);
    const [message, setMessage] = useState("");

    const [searchText, setSearchText] = useState('');

    const handleSearch = (text) => {
        setSearchText(text);
    };

    const toggleToast1 = content => {
        settoast1(!toast1);
        setMessage(content);

        if (content === "Tạo mới gói thành công" || content === "Cập nhật trạng thái thành công") {
            setTimeout(() => {
                settoast1(!toast1);
                window.location.reload();
            }, 1500);
        } else {
            setTimeout(() => {
                settoast1(false);
            }, 1500);
        }
    };

    const handleTogglePack = id => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${JSON.parse(localStorage.getItem("authUser")).access_token}`);

        var formdata = new FormData();
        formdata.append("packageId", id);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch("https://seashell-app-bbv6o.ondigitalocean.app/api/admin/togglePack", requestOptions)
            .then(response => response.text())
            .then(result => {
                if (result === "not existed") {
                    toggleToast1("Gói này không tồn tại");
                } else if (result === "ok") {
                    toggleToast1("Cập nhật trạng thái thành công");
                }
            })
            .catch(error => console.log('error', error));
    }

    const handleAddPack = () => {
        if (packageName === "") {
            toggleToast1("Vui lòng nhập tên gói!");
            return;
        }
        if (typeof direct !== 'number' || isNaN(direct) || typeof price !== 'number' || isNaN(price) || typeof daily !== 'number' || isNaN(daily)) {
        
            toggleToast1("Thông tin phải là số!");
            return;
        } else if (direct <= 0 || price <= 0 || daily <= 0) {
            toggleToast1("Vui lòng nhập thông tin là số > 0!");
            return;
        }

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${JSON.parse(localStorage.getItem("authUser")).access_token}`);

        var formdata = new FormData();
        formdata.append("packageName", packageName);
        formdata.append("daily", daily);
        formdata.append("direct", direct);
        formdata.append("price", price);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch("https://seashell-app-bbv6o.ondigitalocean.app/api/admin/addPack", requestOptions)
            .then(response => response.text())
            .then(result => {
                if (result === "trung ten") {
                    toggleToast1("Gói này đã tồn tại");
                } else if (result === "number invalid") {
                    toggleToast1("Thông số không hợp lệ");
                } else if (result === "ok") {
                    toggleToast1("Tạo mới gói thành công");
                }
            })
            .catch(error => console.log('error', error));
    }

    const filteredData = data.filter((item) =>
        (item.name && item.name.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.price && item.price.toLowerCase().includes(searchText.toLowerCase()))
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
            cell: cell => {
                return (
                    <UncontrolledDropdown className="dropdown d-inline-block">
                        <DropdownToggle className="btn btn-soft-secondary btn-sm" tag="button">
                            <i onClick={(e) => { handleTogglePack(cell.id) }} className="bx bx-toggle-right"></i>
                        </DropdownToggle>
                    </UncontrolledDropdown>
                );
            },
        },
    ];

    return (
        <div className="page-content">
            <Container fluid={true}>
                <Row>
                    <Col>
                        <Card>
                            <CardBody>
                                <CardTitle className="h4">Tạo gói mới</CardTitle>
                                <p className="card-title-desc">
                                    Đây là chức năng dành riêng cho tài khoản với quyền <code>&lt;Admin&gt;</code>{" "}
                                </p>

                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Tên gói
                                    </label>
                                    <div className="col-md-10">
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={packageName}
                                            onChange={(e) => setPackageName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-number-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Lãi hàng tháng
                                    </label>
                                    <div className="col-md-10">
                                        <input
                                            className="form-control"
                                            type="number"
                                            value={daily}  // Sử dụng value thay vì defaultValue
                                            min="0"
                                            onChange={(e) => setDaily(parseInt(e.target.value, 10))}
                                            id="example-number-input"
                                            required
                                        />
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-number-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Lãi cho người trực tiếp
                                    </label>
                                    <div className="col-md-10">
                                        <input
                                            className="form-control"
                                            type="number"
                                            value={direct}  // Sử dụng value thay vì defaultValue
                                            min="0"
                                            onChange={(e) => setDirect(parseInt(e.target.value, 10))}
                                            id="example-number-input"
                                            required
                                        />
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-number-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Giá
                                    </label>
                                    <div className="col-md-10">
                                        <input
                                            className="form-control"
                                            type="number"
                                            value={price}  // Sử dụng value thay vì defaultValue
                                            min="0"
                                            onChange={(e) => setPrice(parseInt(e.target.value, 10))}
                                            id="example-number-input"
                                            required
                                        />
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <button
                                        onClick={handleAddPack}
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
                                        placeholder="Tìm kiếm theo tên gói đầu tư..."
                                        value={searchText}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="form-control form-control-sm"
                                    />
                                }
                            />
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
                            {message}
                        </ToastBody>
                    </Toast>
                </div>
            </Container>
        </div>

    );
};

export default Packages;
