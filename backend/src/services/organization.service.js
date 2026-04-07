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
  // Handle both snake_case (from some sources) and camelCase (from frontend)
  if (updateData.name !== undefined) {
    organization.name = updateData.name;
  }
  
  if (updateData.founder_name !== undefined) {
    organization.founderName = updateData.founder_name;
  } else if (updateData.founderName !== undefined) {
    organization.founderName = updateData.founderName;
  }
  
  if (updateData.contact_info !== undefined) {
    organization.contactInfo = updateData.contact_info;
  } else if (updateData.contactInfo !== undefined) {
    organization.contactInfo = updateData.contactInfo;
  }
  
  if (updateData.logo !== undefined) {
    organization.logo = updateData.logo;
  }
  
  if (updateData.tax_info !== undefined) {
    organization.taxInfo = updateData.tax_info;
  } else if (updateData.taxInfo !== undefined) {
    organization.taxInfo = updateData.taxInfo;
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
