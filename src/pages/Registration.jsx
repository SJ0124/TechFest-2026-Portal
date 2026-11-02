import { useEffect, useState } from "react";

const API_URL = "https://techfest-2026-portal.onrender.com/api";

function Registration() {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/events`)
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch(() => setError("Could not load events"));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    const token = localStorage.getItem("techfestToken");
    if (!token) {
      setError("Please log in before registering for an event.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ eventId })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

      setMessage(data.message);
      setEventId("");
      loadRegistrations(token);
    } catch (err) {
      setError(err.message);
    }
  }

  async function loadRegistrations(token = localStorage.getItem("techfestToken")) {
    if (!token) {
      setError("Please log in to view your registrations.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/registrations/mine`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not load registrations");
      setRegistrations(data);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <h1>Event Registration</h1>

      <form onSubmit={handleSubmit}>
        <label>Select Event</label>
        <select value={eventId} onChange={(e) => setEventId(e.target.value)} required>
          <option value="">Choose an event</option>
          {events.map((event) => (
            <option key={event._id} value={event._id} disabled={event.seats === 0}>
              {event.name} ({event.seats} seats left)
            </option>
          ))}
        </select>

        <button type="submit">Register for Event</button>
      </form>

      <button type="button" onClick={() => loadRegistrations()}>
        View My Registrations
      </button>

      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}

      {registrations.length > 0 && (
        <>
          <h2>My Registrations</h2>
          <ul>
            {registrations.map((registration) => (
              <li key={registration._id}>
                {registration.event?.name || "Event"} —{" "}
                {registration.event?.category || ""}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Registration;
