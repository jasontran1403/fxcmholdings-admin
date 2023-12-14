
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Toast,
  ToastHeader,
  ToastBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap";

import logo from "../../assets/images/logo-sm.png";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

import { useSelector } from "react-redux";

import withRouter from "../../components/Common/withRouter";

import avatar from "../../assets/images/users/avatar-1.jpg";
// actions
import { editProfile, resetProfileFlag } from "../../store/actions";

const UserProfile = () => {
  document.title = "Profile | Upzet - React Admin & Dashboard Template";

  const [toast1, settoast1] = useState(false);
  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const [idx, setidx] = useState(1);
  const [qr, setQr] = useState();
  const [secret, setSecret] = useState("");
  const [isEnable, setIsEnable] = useState("false");
  const [faCode, setFaCode] = useState("");

  const toggleToast1 = () => {
    settoast1(!toast1);

    setTimeout(() => {
      settoast1(false);
    }, 1500);
  };

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGVzIjpbIlJPTEVfQURNSU4iXSwiaXNzIjoiQURNSU5fTE9HSU4iLCJleHAiOjE3MDI2Njg3ODJ9.2uQJhG5z3Geh_ixW2h3vxdVEfWXU3P2yfODGOTX-Ju0");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("https://seashell-app-bbv6o.ondigitalocean.app/api/authentication/showQR/admin", requestOptions)
      .then(response => response.json())
      .then(result => {
        setIsEnable(result[0]);
        setSecret(result[1]);
        setQr(result[2]);
      })
      .catch(error => console.log('error', error));
  }, []);

  const { error, success } = useSelector((state) => ({
    error: state.profile.error,
    success: state.profile.success,
  }));

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      setname(obj.username);
      setemail(obj.email);
      setidx(obj.uid);
    }
  }, []);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      faCode: faCode || ""
    },
    validationSchema: Yup.object({
      faCode: Yup.string().required("Please enter 2fa code"),
    }),
    onSubmit: (values) => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGVzIjpbIlJPTEVfQURNSU4iXSwiaXNzIjoiQURNSU5fTE9HSU4iLCJleHAiOjE3MDI2Njg3ODJ9.2uQJhG5z3Geh_ixW2h3vxdVEfWXU3P2yfODGOTX-Ju0");

      var formdata = new FormData();
      formdata.append("username", name);
      formdata.append("code", values.faCode);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };
      
      var url = "";
      if (isEnable) {
        url = "https://seashell-app-bbv6o.ondigitalocean.app/api/authentication/disabled"
      } else {
        url = "https://seashell-app-bbv6o.ondigitalocean.app/api/authentication/enabled";
      }
      fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => {
          if (result === "success") {
            window.location.reload();
          } else if (result === "failed") {
            toggleToast1();
          }
        })
        .catch(error => console.log('error', error));
    },
  });
  console.log(isEnable);

  return (
    <React.Fragment>
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: "1111" }}>
        <Toast isOpen={toast1}>
          <ToastHeader>
            <p>Lỗi!!!</p>
          </ToastHeader>
          <ToastBody color="primary">
            <p>Cài đặt 2FA thất bại, mã 2FA không chính xác!</p>
          </ToastBody>
        </Toast>
      </div>
      <div className="page-content">
        <Container fluid>
          {isEnable !== "false" ? <>
            <Card>
              <CardBody>
                <Form
                  className="form-horizontal"
                  onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                    return false;
                  }}
                >
                  <div className="form-group">
                    <Label className="form-label">2FA Code</Label>
                    <Input
                      name="faCode"
                      // value={name}
                      className="form-control"
                      placeholder="Enter 2fa code"
                      type="text"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.faCode || ""}
                      invalid={
                        validation.touched.faCode &&
                          validation.errors.faCode
                          ? true
                          : false
                      }
                    />
                    {validation.touched.faCode &&
                      validation.errors.faCode ? (
                      <FormFeedback type="invalid">
                        <div>{validation.errors.faCode}</div>
                      </FormFeedback>
                    ) : null}
                  </div>
                  <div className="text-center mt-4">
                    <Button type="submit" color="danger">
                      Disable
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </> : <>
            <Row>
              <Col lg="12">
                {error && error ? (
                  <Alert color="danger">
                    <div>{error}</div>
                  </Alert>
                ) : null}
                {success ? (
                  <Alert color="success">
                    <div>{success}</div>
                  </Alert>
                ) : null}

                <Card>
                  <CardBody>
                    <div className="d-flex" style={{ justifyContent: "center" }}>
                      <img
                        src={qr}
                        alt=""
                        className="avatar-xxl"
                        style={{ width: "300px", height: "300px" }}
                      />
                    </div>

                    <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <div className="form-group d-flex" style={{ justifyContent: "center" }}>
                        <Label className="form-label">Secret Phrase: {secret}</Label>
                      </div>
                      <div className="form-group">
                        <Label className="form-label">2FA Code</Label>
                        <Input
                          name="faCode"
                          // value={name}
                          className="form-control"
                          placeholder="Enter 2fa code"
                          type="text"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.faCode || ""}
                          invalid={
                            validation.touched.faCode &&
                              validation.errors.faCode
                              ? true
                              : false
                          }
                        />
                        {validation.touched.faCode &&
                          validation.errors.faCode ? (
                          <FormFeedback type="invalid">
                            <div>{validation.errors.faCode}</div>
                          </FormFeedback>
                        ) : null}
                      </div>
                      <div className="text-center mt-4">
                        <Button type="submit" color="danger">
                          Enable
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>


              </Col>
            </Row>
          </>}


        </Container>
      </div>

    </React.Fragment>
  );
};

export default withRouter(UserProfile);
