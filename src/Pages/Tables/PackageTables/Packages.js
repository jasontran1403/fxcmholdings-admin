import React, { useState, useEffect } from 'react';
import { Card, CardBody, Col, Container, Row, CardTitle, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
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
    const [packageName, setPackageName] = useState("");
    const [direct, setDirect] = useState(0);
    const [price, setPrice] = useState(0);
    const [daily, setDaily] = useState(0);

    const [searchText, setSearchText] = useState('');

    const handleSearch = (text) => {
        setSearchText(text);
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
                    alert("Gói này không tồn tại");
                } else if (result === "ok") {
                    alert("Cập nhật trạng thái thành công");
                }
            })
            .catch(error => console.log('error', error));
    }

    const handleAddPack = () => {
        if (packageName === "") {
            alert("Vui lòng nhập tên gói!");
            return;
        }
        if (typeof direct !== 'number' || isNaN(direct) || typeof price !== 'number' || isNaN(price) || typeof daily !== 'number' || isNaN(daily)) {
            alert("Thông tin phải là số!");
            return;
        } else if (direct <= 0 || price <= 0 || daily <= 0) {
            alert("Vui lòng nhập thông tin là số > 0!");
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

        fetch("http://localhost:8080/api/admin/addPack", requestOptions)
            .then(response => response.text())
            .then(result => {
                if (result === "trung ten") {
                    alert("Gói này đã tồn tại");
                } else if (result === "number invalid") {
                    alert("Thông số không hợp lệ");
                } else if (result === "ok") {
                    alert("Tạo mới gói thành công");
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
                            <i onClick={(e) => {handleTogglePack(cell.id)}} className="bx bx-toggle-right"></i>
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
            </Container>
        </div>

    );
};

export default Packages;
