import React, { useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Signin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const user = true;
  const handleSignIn = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    console.log(email, password);
    // await signInWithEmailAndPassword(email, password);
    // const { data } = await axios.post(
    //   `https://carinvento.herokuapp.com/login`,
    //   { email }
    // );
    // localStorage.setItem("accessToken", data.accessToken);
  };

  useEffect(() => {
    if (!user) return;
    else {
      {
        navigate(from, { replace: true });
      }
    }
  }, [user, navigate, from]);

  return (
    <Row className="align-items-center justify-content-center">
      <Col xs={6}>
        <h2 className="mt-5">Sign In</h2>
        <Form onSubmit={handleSignIn}>
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
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group>
          <Row>
            <Col>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Col>
            <Col>
              <Button variant="link" type="submit" as={Link} to="/reset">
                Forgot Your Password
              </Button>
            </Col>
          </Row>
        </Form>
        <hr class="border opacity-50 my-4" />
        <div className=" d-flex align-items-center justify-content-center">
          No account?
          <Link to="/signup">Sign Up</Link>
        </div>
      </Col>
    </Row>
  );
};

export default Signin;
