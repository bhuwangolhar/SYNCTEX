// enquiry controller

'use strict';

const service = require('../services/enquiry.service');

exports.getAll = async (req, res) => {
  try {
    const data = await service.getAll(req.user.organizationId);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await service.create(req.body, req.user.organizationId);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await service.update(req.params.id, req.body, req.user.organizationId);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await service.delete(req.params.id, req.user.organizationId);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};