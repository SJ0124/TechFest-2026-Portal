const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

const router = express.Router();

// Register the logged-in user for an event.
router.post("/", auth, async (req, res, next) => {
  try {
    const { eventId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event id" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.seats <= 0) {
      return res.status(400).json({ message: "Event is sold out" });
    }

    const existing = await Registration.findOne({
      user: req.user.id,
      event: eventId
    });

    if (existing) {
      return res.status(409).json({ message: "You are already registered for this event" });
    }

    // Atomic seat decrement prevents two requests from taking the same final seat.
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, seats: { $gt: 0 } },
      { $inc: { seats: -1 } },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(400).json({ message: "Event is sold out" });
    }

    try {
      const registration = await Registration.create({
        user: req.user.id,
        event: eventId
      });

      res.status(201).json({
        message: "Registration successful",
        registration,
        event: updatedEvent
      });
    } catch (registrationError) {
      // If the unique registration index rejects a duplicate, restore the seat.
      await Event.findByIdAndUpdate(eventId, { $inc: { seats: 1 } });
      if (registrationError.code === 11000) {
        return res.status(409).json({ message: "You are already registered for this event" });
      }
      throw registrationError;
    }
  } catch (error) {
    next(error);
  }
});

// View the logged-in user's registrations.
router.get("/mine", auth, async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate("event")
      .sort({ registeredAt: -1 });

    res.status(200).json(registrations);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
