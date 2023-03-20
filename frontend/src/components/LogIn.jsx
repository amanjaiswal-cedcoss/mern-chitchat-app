import axios from "axios";
import React, { useState } from "react";
import {
  Button,
  FloatingLabel,
  Form,
  Toast,
  ToastContainer,
  ToastHeader,
} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { Link, useNavigate } from "react-router-dom";

function LogIn() {
  const [formData, setFormData] = useState({
    emailOrPhone: {
      value: "",
      invalid: false,
    },
    password: {
      value: "",
      invalid: false,
    },
  });
  const [toast, setToast] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate=useNavigate();

  const signIn = async (e) => {
    e.preventDefault();

    // finding if any value is empty in formData object whose required key is true
    let emptyValue = Object.values(formData).find((findEle) => findEle === "");

    if (emptyValue) {
      setToast([
        ...toast,
        { open: true, type: "danger", msg: "Please fill all the fields" },
      ]);
      return;
    } else {
      let temp = formData;

      temp.emailOrPhone.invalid =
        temp.emailOrPhone.value.match(
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
        ) || temp.emailOrPhone.value.match(/^\d{10}$/)
          ? false
          : true;

      let invalidInput = Object.entries(temp).find((ele) => ele[1].invalid);

      if (invalidInput) {
        let tempObj = Object.entries(temp).reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});
        setFormData(tempObj);
        setLoading(false);
      } else {
        try {
          setLoading(true);
          const config = {
            headers: { "Content-type": "application/json" },
          };

          const { data } = await axios.post(
            "/api/user/login",
            {
              emailOrPhone: formData.emailOrPhone.value,
              password: formData.password.value,
            },
            config
          );
          console.log(data);
          localStorage.setItem("chitChatUser", JSON.stringify(data));
          setToast([
            ...toast,
            { open: true, type: "success", msg: "Login Successfull" },
          ]);
          setLoading(false);
          navigate('/')
        } catch (err) {
          console.log(err);
          setToast([
            ...toast,
            { open: true, type: "danger", msg: "Error Occured" },
          ]);
          setLoading(false);
        }
      }
    }
  };

  const changeHandler = (value, key) => {
    formData[key].value = value;
    setFormData({ ...formData });
  };

  const closeToast = (index) => {
    toast.splice(index, 1);
    setToast([...toast]);
  };

  return (
    <>
      <ToastContainer className="bg-white" position="top-end">
        {toast.map((ele, index) => {
          return (
            <Toast
              key={index}
              className="bg-opacity-75"
              onClose={() => closeToast(index)}
              show={ele.open}
              bg={ele.type}
              delay={2000}
              autohide
            >
              <ToastHeader>
                <strong className="me-auto">Chitchat</strong>
              </ToastHeader>
              <Toast.Body>{ele.msg}</Toast.Body>
            </Toast>
          );
        })}
      </ToastContainer>
      <Card className="login mx-auto my-2 bg-white p-2 shadow-sm">
        <h4 className="text-center my-2">Login</h4>
        <Card.Body>
          <Form
            className="mt-2"
            onSubmit={(e) => {
              signIn(e);
            }}
          >
              <FloatingLabel label="Email or Phone" className="mb-3">
                <Form.Control
                  required
                  value={formData.emailOrPhone.value}
                  onChange={(e) => {
                    changeHandler(e.target.value, "emailOrPhone");
                  }}
                  placeholder="Email or Phone"
                  isInvalid={formData.emailOrPhone.invalid}
                />
              </FloatingLabel>
              <FloatingLabel label="Password" className="mb-3">
                <Form.Control
                  type="password"
                  required
                  value={formData.password.value}
                  onChange={(e) => {
                    changeHandler(e.target.value, "password");
                  }}
                  placeholder="Password"
                />
              </FloatingLabel>
            <Button disabled={loading} className="w-100 bg-wtspgreen rounded-0 border-0" type="submit">
              {loading ? "Loading…" : "Log In"}
            </Button>
          </Form>
          <span className="d-flex align-items-center mt-3 gap-1">
            New user?
            <Link to="/signup">Sign Up</Link>
          </span>
        </Card.Body>
      </Card>
    </>
  );
}

export default LogIn;
