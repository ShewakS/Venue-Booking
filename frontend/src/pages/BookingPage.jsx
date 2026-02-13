import React from "react";
import BookingForm from "../components/booking/BookingForm";
import BookingList from "../components/booking/BookingList";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../utils/roles";

const BookingPage = () => {
  const { spaces, bookings, timetable, addBooking, updateBookingStatus } = useData();
  const { role } = useAuth();
  const isOrganizer = role === ROLES.ADMIN;

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <h2>Bookings</h2>
      {isOrganizer ? null : (
        <BookingForm spaces={spaces} bookings={bookings} timetable={timetable} onAddBooking={addBooking} />
      )}
      <BookingList
        bookings={bookings}
        spaces={spaces}
        onStatusChange={isOrganizer ? updateBookingStatus : undefined}
        showActions={isOrganizer}
      />
    </div>
  );
};

export default BookingPage;
