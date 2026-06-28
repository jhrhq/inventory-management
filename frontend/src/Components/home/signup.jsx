import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Signup = () => {
  // react bootstrap validation
  const [validated, setValidated] = useState(false);

  // dummy user
  const user = true;
  let error;
  let updateError;
  // react router dom hook
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  // checkbox state for sign up button enable disable
  const [check, setCheck] = useState(false);

  // error
  let errorElement;

  //  sign up button onClick handler
  const handleSignUp = async (event) => {
    event.preventDefault();
    //  bootstrap validation
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    setValidated(true);
  };
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  if (error || updateError) {
    errorElement = (
      <div>
        <p className="text-danger">
          Error: {error?.message}
          {updateError?.message}
        </p>
      </div>
    );
  }
  return (
    <Row className="justify-content-center mb-3  py-4">
      {errorElement}
      <Col md={5} xs={12}>
        <div className=" p-3 bg-white">
          <div className="mb-5">
            <h3 className="text-center">Sign Up</h3>
            <p className="lead">
              Hey, there. Enter your email and password to sign up to your new
              account
            </p>
            {errorElement}
          </div>
          <Form noValidate validated={validated} onSubmit={handleSignUp}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                name="name"
                type="name"
                placeholder="Enter your name"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                required
                name="email"
                type="email"
                placeholder="Enter email"
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                name={"password"}
                type="password"
                placeholder="Password"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check
                onClick={() => setCheck(!check)}
                type="checkbox"
                label="I agree all terms and conditions"
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button
                disabled={check ? false : true}
                variant={check ? "primary" : "light"}
                type="submit"
              >
                Submit
              </Button>
            </div>
          </Form>
          <div className=" d-flex align-items-center justify-content-center">
            Already have an account?
            <Link to="/signin">Sign in</Link>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Signup;
