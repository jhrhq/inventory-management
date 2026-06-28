import { useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import auth from "../../../firebase.init";
import Error from "../../Utilities/Error/Error";
import Loading from "../../Utilities/Loading/Loading";

const ResetPassword = () => {
  // react bootstrap validation
  const [validated, setValidated] = useState(false);
  const emailRef = useRef("");
  // firebase reset password with email
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);

  // loading
  if (sending) {
    <Loading />;
  }
  // errror message
  let err;
  if (error) {
    err = <Error error={error} />;
  }

  // reset password for login
  const handleResetPassword = async (event) => {
    // react bootstrap validation
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    const email = emailRef.current.value;
    setValidated(true);
    if (email) {
      await sendPasswordResetEmail(email);
      toast("Email Sent to your account");
    }
  };

  return (
    <>
      <Row className="justify-content-center mb-3  py-4">
        <Col md={4}>
          <div className=" p-3 bg-white" style={{ borderRadius: "1rem" }}>
            <div className="mb-5 text-center">
              <p className="lead">Enter Your Email</p>
            </div>
            <Form
              noValidate
              validated={validated}
              onSubmit={handleResetPassword}
            >
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control
                  required
                  type="email"
                  placeholder="Enter email"
                  ref={emailRef}
                />
              </Form.Group>

              <div className="row mb-4">
                <div className="d-grid gap-2">
                  <Button variant="secondary" type="submit">
                    Rest Your Passowrd
                  </Button>
                </div>
              </div>
            </Form>

            {/* Error message */}
            {err}
          </div>
        </Col>
      </Row>

      {/* toast */}
      <ToastContainer />
    </>
  );
};

export default ResetPassword;
