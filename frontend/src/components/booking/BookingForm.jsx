import React from "react";
import InputField from "../common/InputField";
import Button from "../common/Button";

const BookingForm = () => {
  return (
    <div className="card" style={{ marginBottom: "20px" }}>
      <h3>Request a Space</h3>
      <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <InputField id="space" label="Space Name" placeholder="Seminar Hall 2" />
        <InputField id="date" label="Date" type="date" />
        <InputField id="start" label="Start Time" type="time" />
        <InputField id="end" label="End Time" type="time" />
      </div>
      <div style={{ marginTop: "16px" }}>
        <Button>Submit Booking</Button>
      </div>
    </div>
  );
};

export default BookingForm;
