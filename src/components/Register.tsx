import { FormEventHandler, useCallback, useState } from "react";

export const Registration = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();

      // Form validation and submission logic goes here

      // Simulating sending email
      const formData = {
        firstName,
        lastName,
        age,
        email,
        phoneNumber,
        additionalDetails,
      };
      console.log(
        "Sending email to tjdford@gmail.com with form data:",
        formData
      );

      // Resetting form fields
      setFirstName("");
      setLastName("");
      setAge("");
      setEmail("");
      setPhoneNumber("");
      setAdditionalDetails("");
    },
    [additionalDetails, age, email, firstName, lastName, phoneNumber]
  );

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <h2>Register for the Race</h2>
      <div className="form-group">
        <label>First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Age</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="tel"
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <small>Format: 123-456-7890</small>
      </div>
      <div className="form-group">
        <label>Additional Details</label>
        <textarea
          value={additionalDetails}
          onChange={(e) => setAdditionalDetails(e.target.value)}
        ></textarea>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};
