// enquiry service

'use strict';

const Enquiry = require('../models/enquiry.model');

exports.getAll = async (organizationId) => {
  return await Enquiry.findAll({ where: { organizationId } });
};

exports.create = async (data, organizationId) => {
  if (!data.name) throw new Error('name is required');

  return await Enquiry.create({
    ...data,
    organizationId   // always use server-side org
  });
};

exports.update = async (id, data, organizationId) => {
  const e = await Enquiry.findOne({ where: { id, organizationId } });
  if (!e) throw new Error('Enquiry not found in your organization');

  delete data.organizationId;
  await e.update(data);
  return e;
};

exports.delete = async (id, organizationId) => {
  const e = await Enquiry.findOne({ where: { id, organizationId } });
  if (!e) throw new Error('Enquiry not found in your organization');

  await e.destroy();
};