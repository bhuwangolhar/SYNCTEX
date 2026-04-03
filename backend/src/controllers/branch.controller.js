'use strict';

const branchService = require('../services/branch.service');

exports.getBranches = async (req, res) => {
  try {
    const branches = await branchService.getBranches(req.user.organizationId);
    res.json(branches);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getBranch = async (req, res) => {
  try {
    const branch = await branchService.getBranchById(req.params.id, req.user.organizationId);
    res.json(branch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.createBranch = async (req, res) => {
  try {
    const branch = await branchService.createBranch(req.body, req.user.organizationId, req.user.userId);
    res.status(201).json(branch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateBranch = async (req, res) => {
  try {
    const branch = await branchService.updateBranch(req.params.id, req.body, req.user.organizationId);
    res.json(branch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteBranch = async (req, res) => {
  try {
    await branchService.deleteBranch(req.params.id, req.user.organizationId);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
