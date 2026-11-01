const express = require("express");
const Event = require("../models/Event");
const auth = require("../middleware/auth");

const router = express.Router();

// GET all events
router.get("/", async (req, res, next) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
});

// GET one event by id
router.get("/:id", async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
});

// POST add event - protected
router.post("/", auth, async (req, res, next) => {
  try {
    const { name, category, fee, seats, date } = req.body;
    const event = await Event.create({ name, category, fee, seats, date });
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
});

// PUT edit event - protected
router.put("/:id", auth, async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
});

// DELETE event - protected
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ message: "Event deleted successfully", event });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
