// organization service

const Organization = require('../models/organization.model');

/**
 * Get organization by ID
 */
exports.getOrganization = async (organizationId) => {
  if (!organizationId) {
    throw new Error('Organization ID is required');
  }

  const organization = await Organization.findByPk(organizationId);

  if (!organization) {
    throw new Error('Organization not found');
  }

  return organization;
};

/**
 * Update organization details
 */
exports.updateOrganization = async (organizationId, updateData) => {
  if (!organizationId) {
    throw new Error('Organization ID is required');
  }

  const organization = await Organization.findByPk(organizationId);

  if (!organization) {
    throw new Error('Organization not found');
  }

  // Only update allowed fields
  if (updateData.name !== undefined) {
    organization.name = updateData.name;
  }
  
  if (updateData.founder_name !== undefined) {
    organization.founder_name = updateData.founder_name;
  }
  
  if (updateData.contactInfo !== undefined) {
    organization.contact_info = updateData.contactInfo;
  }
  
  if (updateData.logo !== undefined) {
    organization.logo = updateData.logo;
  }
  
  if (updateData.taxInfo !== undefined) {
    organization.tax_info = updateData.taxInfo;
  }

  await organization.save();

  return organization;
};

/**
 * Create organization
 */
exports.createOrganization = async (name) => {
  if (!name) {
    throw new Error('Organization name is required');
  }

  const organization = await Organization.create({ name });

  return organization;
};
