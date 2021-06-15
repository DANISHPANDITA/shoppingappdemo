import React, { useRef } from "react";
import "../styles/Register.css";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addToFormData } from "../app/counterSlice";
import { useHistory } from "react-router-dom";
function Register() {
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const watchAllFields = watch();
  const watchPassword = useRef({});
  watchPassword.current = watch("password", "");

  function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  const onSubmit = (data) => {
    if (data.PhoneNumber.length === 10) {
      const ageOfUser = getAge(data.dob);
      if (ageOfUser > 12 && ageOfUser < 80) {
        delete data.confPassword;
        dispatch(addToFormData(data));
        history.push("/verification");
      } else {
        alert("The range of age should be between 12 and 80");
      }
    } else {
      alert("Phone Number should be only 10 digits");
    }
  };

  return (
    <div className="registerPage">
      <div className="registrationContainer">
        <div className="Registration">
          <h1>Register Here</h1>
          <form className="formRegister" onSubmit={handleSubmit(onSubmit)}>
            <div className="formRow">
              <div className="rowContent">
                <label className="inputLabel" htmlFor="name">
                  Full Name
                </label>
                <input
                  className="inputField"
                  id="name"
                  {...register("name", {
                    required: true,
                    minLength: 5,
                    maxLength: 30,
                  })}
                />
                {errors.name && errors.name.type === "required" && (
                  <span className="errorText">Enter full name.</span>
                )}
                {errors.name && errors.name.type === "minLength" && (
                  <span className="errorText">
                    Name must be more than 5 characters.
                  </span>
                )}
                {errors.name && errors.name.type === "maxLength" && (
                  <span className="errorText">Max length exceeded.</span>
                )}
              </div>
              <div className="rowContent">
                <label className="inputLabel" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  className="inputField"
                  {...register("email", {
                    required: "required",
                    pattern: {
                      value: /\S+@\S+.\S+/,
                      message: "Entered value does not match email format",
                    },
                  })}
                  type="email"
                />
                {errors.email && (
                  <span role="alert" className="errorText">
                    {errors.email.message}
                  </span>
                )}
              </div>
            </div>
            <div className="formRow">
              <div className="rowContent">
                <label className="inputLabel" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  className="inputField"
                  {...register("password", {
                    required: "required",
                    minLength: {
                      value: 5,
                      message: "Minimum length is 5.",
                    },
                  })}
                  type="password"
                />
                {errors.password && (
                  <span className="errorText" role="alert">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <div className="rowContent">
                <label className="inputLabel" htmlFor="password">
                  Confirm Password
                </label>
                <input
                  className="inputField"
                  id="confPassword"
                  {...register("confPassword", {
                    required: "required",
                    minLength: {
                      value: 5,
                      message: "Minimum length is 5.",
                    },
                    validate: (value) =>
                      value === watchPassword.current ||
                      "The passwords do not match",
                  })}
                  type="password"
                />
                {errors.confPassword && (
                  <span className="errorText" role="alert">
                    {errors.confPassword.message}
                  </span>
                )}
              </div>
            </div>
            <label className="inputLabel" htmlFor="Phone">
              Mobile Number
            </label>
            <input
              className="inputField"
              id="PhoneNumber"
              {...register("PhoneNumber", {
                required: "required",
                minLength: {
                  value: 10,
                  message: "Minimum length is 10",
                },
              })}
            />
            {errors.PhoneNumber && (
              <span className="errorText">{errors.PhoneNumber.message}</span>
            )}
            <label className="inputLabel" htmlFor="gender">
              Choose your gender
            </label>
            <select className="inputField" {...register("gender")}>
              <option key={1} value="Male">
                Male
              </option>
              <option key={2} value="Female">
                Female
              </option>
              <option key={3} value="notSpecified">
                Prefer not to say
              </option>
            </select>
            <div className="dobRow">
              <div className="rowContent">
                <label className="inputLabel" htmlFor="dob">
                  Date of Birth
                </label>
                <input
                  className="inputField"
                  type="date"
                  id="dob"
                  {...register("dob", { required: true })}
                />
                {errors.dob && (
                  <span className="errorText">Enter Date of Birth</span>
                )}
              </div>
              {watchAllFields.dob ? (
                <div className="ageCalc">
                  <b>Age: {getAge(watchAllFields.dob)}</b>
                </div>
              ) : (
                ""
              )}
            </div>
            <input className="submitButton" type="submit" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
