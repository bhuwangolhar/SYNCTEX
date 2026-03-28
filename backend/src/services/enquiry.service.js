const Enquiry = require("../models/enquiry.model");

exports.getAll = async (orgId) => {
  return await Enquiry.findAll({ where: { organization_id: orgId } });
};

exports.create = async (data) => {
  if (!data.name || !data.organization_id) {
    throw new Error("Missing fields");
  }

  return await Enquiry.create(data);
};

exports.update = async (id, data) => {
  const e = await Enquiry.findByPk(id);
  if (!e) throw new Error("Not found");

  await e.update(data);
  return e;
};

exports.delete = async (id) => {
  const e = await Enquiry.findByPk(id);
  if (!e) throw new Error("Not found");

  await e.destroy();
};