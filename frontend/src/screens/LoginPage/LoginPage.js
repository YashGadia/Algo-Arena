import { useState } from "react";
import TextField from "@material-ui/core/TextField";
import LoginPageImage from "../../images/websiteImages/LoginPageImage.png";
import Button from "@material-ui/core/Button";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import { Link } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";
import { CircularProgress } from "@material-ui/core";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

const LoginPage = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(false);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      setLoading(true);
      const { data } = await axios.post(
        "/api/users/login",
        {
          email,
          password,
        },
        config
      );

      console.log(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="loginContainer">
      <div className="leftimage">
        <img
          src={LoginPageImage}
          alt="Login Page"
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="rightContent">
        <div className="rightForm">
          <div className="rightForm_Title">Login</div>
          <div className="rightForm_Textfield">
            <TextField
              id="outlined-basic"
              label="Email"
              size="small"
              variant="outlined"
              style={{ width: 350 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Pasword"
              size="small"
              variant="outlined"
              style={{ width: 350 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="rightForm_Button">
            <div className="rightForm_Button_Error">
              {error && <ErrorMessage severity="error">{error}</ErrorMessage>}
            </div>
            <div className="rightForm_Button_Loading">
              {loading && (
                <CircularProgress style={{ width: 25, height: 25 }} />
              )}
            </div>
            <div className="rightForm_Button_Submit">
              <Button
                variant="contained"
                style={{ backgroundColor: "#f57c00", color: "white" }}
                startIcon={<LockOpenIcon />}
                onClick={submitHandler}
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>
        <div className="rightForm_Register">
          Don't have an account?{" "}
          <Link to="/register" className="rightForm_Register_title">
            Register
          </Link>{" "}
          here.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
