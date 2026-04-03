'use strict';

const attendanceService = require('../services/attendance.service');

exports.punchIn = async (req, res) => {
  try {
    const { latitude, longitude, locationName, summaryText } = req.body;
    const result = await attendanceService.punchIn(req.user.userId, req.user.organizationId, {
      latitude,
      longitude,
      locationName,
      summaryText
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.punchOut = async (req, res) => {
  try {
    const result = await attendanceService.punchOut(req.user.userId, req.user.organizationId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getToday = async (req, res) => {
  try {
    const result = await attendanceService.getToday(req.user.userId, req.user.organizationId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getByDate = async (req, res) => {
  try {
    const date = req.query.date;
    const result = await attendanceService.getByDate(req.user.userId, req.user.organizationId, date);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.startBreak = async (req, res) => {
  try {
    const result = await attendanceService.startBreak(req.user.userId, req.user.organizationId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.endBreak = async (req, res) => {
  try {
    const result = await attendanceService.endBreak(req.user.userId, req.user.organizationId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateSessionSummary = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const { summaryText } = req.body;
    const result = await attendanceService.updateSessionSummary(
      req.user.userId,
      req.user.organizationId,
      sessionId,
      summaryText
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
