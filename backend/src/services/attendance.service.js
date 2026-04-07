'use strict';

const { Op } = require('sequelize');
const sequelize = require('../../config/database');
const AttendanceDay = require('../models/attendanceDay.model');
const AttendanceSession = require('../models/attendanceSession.model');

const getTodayDate = () => new Date().toISOString().slice(0, 10);

const loadActiveSession = async (userId, organizationId, transaction) => {
  const days = await AttendanceDay.findAll({
    where: { userId, organizationId },
    attributes: ['id'],
    transaction
  });

  const dayIds = days.map((d) => d.id);

  if (dayIds.length === 0) {
    return null;
  }

  const session = await AttendanceSession.findOne({
    where: { attendanceDayId: { [Op.in]: dayIds }, punchOutAt: null },
    transaction
  });

  return session;
};

const recalcDayWorkedSeconds = async (attendanceDay, transaction) => {
  const sum = await AttendanceSession.sum('durationSeconds', {
    where: { attendanceDayId: attendanceDay.id, durationSeconds: { [Op.not]: null } },
    transaction
  });

  const total = Number(sum || 0);
  await attendanceDay.update({ totalWorkedSeconds: total }, { transaction });
  return total;
};

exports.punchIn = async (userId, organizationId, payload) => {
  const now = new Date();
  const locationName = payload.locationName || 'Remote';

  return await sequelize.transaction(async (tx) => {
    const activeSession = await loadActiveSession(userId, organizationId, tx);
    if (activeSession) {
      throw new Error('You already have an active session. Please punch out first.');
    }

    const date = getTodayDate();

    let attendanceDay = await AttendanceDay.findOne({
      where: { userId, organizationId, date },
      transaction: tx
    });

    if (!attendanceDay) {
      attendanceDay = await AttendanceDay.create({
        organizationId,
        userId,
        date,
        status: 'OPEN'
      }, { transaction: tx });
    } else if (attendanceDay.status !== 'OPEN') {
      await attendanceDay.update({ status: 'OPEN' }, { transaction: tx });
    }

    const session = await AttendanceSession.create({
      attendanceDayId: attendanceDay.id,
      punchInAt: now,
      latitude: payload.latitude ?? null,
      longitude: payload.longitude ?? null,
      locationName,
      summaryText: payload.summaryText || null,
      totalBreakSeconds: 0
    }, { transaction: tx });

    return { attendanceDay, session };
  });
};

exports.punchOut = async (userId, organizationId) => {
  const now = new Date();

  return await sequelize.transaction(async (tx) => {
    const activeSession = await loadActiveSession(userId, organizationId, tx);
    if (!activeSession) {
      throw new Error('No active session found to punch out.');
    }

    const day = await AttendanceDay.findOne({
      where: { id: activeSession.attendanceDayId, userId, organizationId },
      transaction: tx
    });

    if (!day) {
      throw new Error('Attendance day not found for active session.');
    }

    let durationSeconds = 0;
    if (activeSession.punchInAt) {
      const elapsed = Math.floor((now.getTime() - new Date(activeSession.punchInAt).getTime()) / 1000);
      durationSeconds = Math.max(0, elapsed - (activeSession.totalBreakSeconds || 0));
    }

    await activeSession.update({ punchOutAt: now, durationSeconds }, { transaction: tx });

    await recalcDayWorkedSeconds(day, tx);

    // Close day when no open session remains.
    const openSession = await AttendanceSession.findOne({
      where: { attendanceDayId: day.id, punchOutAt: null },
      transaction: tx
    });

    if (!openSession) {
      await day.update({ status: 'CLOSED' }, { transaction: tx });
    }

    return { attendanceDay: day, session: activeSession };
  });
};

exports.startBreak = async (userId, organizationId) => {
  const now = new Date();

  return await sequelize.transaction(async (tx) => {
    const activeSession = await loadActiveSession(userId, organizationId, tx);
    if (!activeSession) {
      throw new Error('You need an active session to start a break.');
    }

    if (activeSession.break_started_at) {
      throw new Error('Break already started. End break first.');
    }

    await activeSession.update({ breakStartedAt: now }, { transaction: tx });
    return activeSession;
  });
};

exports.endBreak = async (userId, organizationId) => {
  const now = new Date();

  return await sequelize.transaction(async (tx) => {
    const activeSession = await loadActiveSession(userId, organizationId, tx);
    if (!activeSession) {
      throw new Error('You need an active session to end a break.');
    }

    if (!activeSession.breakStartedAt) {
      throw new Error('No active break to end.');
    }

    const elapsed = Math.floor((now.getTime() - new Date(activeSession.breakStartedAt).getTime()) / 1000);
    const totalBreakSeconds = (activeSession.totalBreakSeconds || 0) + Math.max(0, elapsed);

    await activeSession.update({ totalBreakSeconds, breakStartedAt: null }, { transaction: tx });
    return activeSession;
  });
};

exports.updateSessionSummary = async (userId, organizationId, sessionId, summaryText) => {
  const session = await AttendanceSession.findOne({ where: { id: sessionId } });

  if (!session) {
    throw new Error('Session not found');
  }

  const day = await AttendanceDay.findOne({
    where: { id: session.attendanceDayId, userId, organizationId }
  });

  if (!day) {
    throw new Error('Session not found in your organization');
  }

  await session.update({ summaryText });
  return session;
};

const applyDayResult = (day, sessions) => {
  let total = day ? day.total_worked_seconds : 0;
  if (!day) total = 0;

  const active = sessions.find((s) => s.punch_out_at === null) || null;

  return {
    attendanceDay: day,
    sessions,
    activeSession: active,
    totalWorkedSeconds: total
  };
};

exports.getToday = async (userId, organizationId) => {
  const date = getTodayDate();
  const attendanceDay = await AttendanceDay.findOne({
    where: { userId, organizationId, date }
  });

  const sessions = attendanceDay
    ? await AttendanceSession.findAll({ where: { attendanceDayId: attendanceDay.id }, order: [['punchInAt', 'ASC']] })
    : [];

  return applyDayResult(attendanceDay, sessions);
};

exports.getByDate = async (userId, organizationId, date) => {
  if (!date) {
    throw new Error('date is required');
  }

  const attendanceDay = await AttendanceDay.findOne({
    where: { userId, organizationId, date }
  });

  const sessions = attendanceDay
    ? await AttendanceSession.findAll({ where: { attendanceDayId: attendanceDay.id }, order: [['punchInAt', 'ASC']] })
    : [];

  return applyDayResult(attendanceDay, sessions);
};
