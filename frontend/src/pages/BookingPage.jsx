import React from "react";
import BookingForm from "../components/booking/BookingForm";
import BookingList from "../components/booking/BookingList";
import { useData } from "../context/DataContext";

const BookingPage = () => {
  const { spaces, bookings, timetable, addBooking, updateBookingStatus } = useData();

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <h2>Bookings</h2>
      <BookingForm spaces={spaces} bookings={bookings} timetable={timetable} onAddBooking={addBooking} />
      <BookingList bookings={bookings} spaces={spaces} onStatusChange={updateBookingStatus} showActions />
    </div>
  );
};

export default BookingPage;
