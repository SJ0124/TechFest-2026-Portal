import { useState } from "react";

const API_URL = "http://localhost:5000/api";

function EventCard({ event, onRegistered }) {
  const [seatsLeft, setSeatsLeft] = useState(event.seats);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleRegister() {
    const token = localStorage.getItem("techfestToken");

    if (!token) {
      setError("Please log in before registering.");
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ eventId: event._id })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

      setSeatsLeft(data.event.seats);
      setMessage(data.message);
      if (onRegistered) onRegistered();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="event-card">
      <h3>{event.name}</h3>
      <p>Category: {event.category}</p>
      <p>Fee: {event.fee === 0 ? "Free" : `Rs. ${event.fee}`}</p>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
      <p>Seats left: {seatsLeft}</p>

      {seatsLeft === 0 ? (
        <button disabled>SOLD OUT</button>
      ) : (
        <button onClick={handleRegister}>Register</button>
      )}

      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
}

export default EventCard;
