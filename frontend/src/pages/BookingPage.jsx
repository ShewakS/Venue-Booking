import React from "react";
import BookingForm from "../components/booking/BookingForm";
import BookingTable from "../components/booking/BookingTable";

const BookingPage = () => {
  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <h2>Bookings</h2>
      <BookingForm />
      <BookingTable />
    </div>
  );
};

export default BookingPage;
