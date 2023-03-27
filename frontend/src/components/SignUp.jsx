import axios from "axios";
import React from "react";
import { useState } from "react";
import {
  Button,
  FloatingLabel,
  Form,
  FormGroup,
  Toast,
  ToastContainer,
  ToastHeader,
} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  const [formData, setFormData] = useState({
    name: {
      value: "",
      invalid: false,
      required: true,
    },
    email: {
      value: "",
      invalid: false,
      required: true,
    },
    phone: {
      value: "",
      invalid: false,
      required: true,
    },
    password: {
      value: "",
      invalid: false,
      required: true,
    },
    pic: { value: undefined, invalid: false, required: false },
  });
  const [toast, setToast] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const changeHandler = (value, key) => {
    formData[key].value = value;
    setFormData({ ...formData });
  };

  const postPic = (pic) => {
    setLoading(true);
    if (pic === undefined) {
      setToast([...toast, { open: true, msg: "Please select an image!" }]);
      return;
    }

    if (
      pic.type === "image/jpeg" ||
      pic.type === "image/png" ||
      pic.type === "image/jpg"
    ) {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "Chit-Chat");
      data.append("cloud_name", "du6yxff5s");
      fetch("https://api.cloudinary.com/v1_1/du6yxff5s/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            ...formData,
            pic: { ...pic, value: data.url.toString(), invalid: false },
          });
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      setFormData({
        ...formData,
        pic: { ...pic, invalid: true },
      });
      setToast([...toast, { open: true, msg: "Please select an image!" }]);
    }
  };

  const signUp = async (e) => {
    e.preventDefault();

    // finding if any value is empty in formData object whose required key is true
    let emptyValue = Object.values(formData)
      .filter((ele) => ele.required)
      .find((findEle) => findEle.value === "");

    if (emptyValue) {
      setToast([
        ...toast,
        { open: true, type: "danger", msg: "Please fill all the fields" },
      ]);
      return;
    } else {
      let temp = formData;

      temp.email.invalid = temp.email.value.match(
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
      )
        ? false
        : true;

      temp.phone.invalid = temp.phone.value.match(/^\d{10}$/) ? false : true;

      temp.password.invalid = temp.password.value.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
      )
        ? false
        : true;

      let invalidInput = Object.entries(temp).find((ele) => ele[1].invalid);

      if (invalidInput) {
        let tempObj = Object.entries(temp).reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});
        setFormData(tempObj);
      } else {
        try {
          setLoading(true);
          const config = {
            headers: { "Content-type": "application/json" },
          };

          const { data } = await axios.post(
            "/api/user",
            {
              name: formData.name.value,
              email: formData.email.value,
              password: formData.password.value,
              phone: formData.phone.value,
              pic: formData.pic.value,
            },
            config
          );
          localStorage.setItem("chitChatUser", JSON.stringify(data));
          setToast([
            ...toast,
            { open: true, type: "success", msg: "Registration successful" },
          ]);
          setLoading(false);
          navigate("/");
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

  const closeToast = (index) => {
    toast.splice(index, 1);
    setToast([...toast]);
  };

  return (
    <>
      <ToastContainer className="bg-white" position="bottom-center" >
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
        <h4 className="text-center my-2">Sign Up</h4>
        <Card.Body>
          <Form
            className="mt-2"
            onSubmit={(e) => {
              signUp(e);
            }}
          >
            <FloatingLabel className="p-0 mb-3" label="Name">
              <Form.Control
                value={formData.name.value}
                onChange={(e) => {
                  changeHandler(e.target.value, "name");
                }}
                type="text"
                required={formData.name.required}
                isInvalid={formData.name.invalid}
                placeholder="Name"
              />
            </FloatingLabel>
            <FloatingLabel className="p-0 mb-3" label="Email">
              <Form.Control
                value={formData.email.value}
                onChange={(e) => {
                  changeHandler(e.target.value, "email");
                }}
                type="email"
                required={formData.email.required}
                isInvalid={formData.email.invalid}
                placeholder="Email"
              />
            </FloatingLabel>
            <FloatingLabel className="p-0 mb-3" label="Phone">
              <Form.Control
                value={formData.phone.value}
                onChange={(e) => {
                  changeHandler(e.target.value, "phone");
                }}
                required={formData.phone.required}
                isInvalid={formData.phone.invalid}
                placeholder="Phone"
              />
            </FloatingLabel>
            <FormGroup className="mb-3">
              <FloatingLabel className="p-0" label="Password">
                <Form.Control
                  value={formData.password.value}
                  onChange={(e) => {
                    changeHandler(e.target.value, "password");
                  }}
                  type="password"
                  required={formData.password.required}
                  isInvalid={formData.password.invalid}
                  placeholder="Password"
                />
              </FloatingLabel>
              <p className="fw-light text-sm lh-sm mt-1">
                Password must contain minimum 8 characters with minimum 1
                lowercase,uppercase,number and a special character.
              </p>
            </FormGroup>
            <Form.Group className="mb-3">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control
                onChange={(e) => {
                  postPic(e.target.files[0]);
                }}
                type="file"
                accept="image/"
                required={formData.pic.required}
              />
            </Form.Group>
            <Button
              disabled={loading}
              className="w-100 bg-wtspgreen rounded-0 border-0"
              type="submit"
            >
              {loading ? "Loading…" : "Sign Up"}
            </Button>
          </Form>
          <span className="d-flex align-items-center mt-3 gap-1">
            Alreday a user?
            <Link to="/login">Log In</Link>
          </span>
        </Card.Body>
      </Card>
    </>
  );
}

export default SignUp;
