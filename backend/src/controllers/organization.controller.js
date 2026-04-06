// organization controller

const organizationService = require('../services/organization.service');

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Get organization details by ID
 */
exports.getOrganization = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const organization = await organizationService.getOrganization(organizationId);

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    res.json(organization);
  } catch (err) {
    if (!isProduction) console.error('Error fetching organization:', err.message);
    res.status(500).json({ error: 'Failed to fetch organization' });
  }
};

/**
 * Update organization details
 */
exports.updateOrganization = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { name, founder_name, contactInfo, logo, taxInfo } = req.body;

    const organization = await organizationService.updateOrganization(organizationId, {
      name,
      founder_name,
      contactInfo,
      logo,
      taxInfo
    });

    res.json({ message: 'Organization updated successfully', organization });
  } catch (err) {
    if (!isProduction) console.error('Error updating organization:', err.message);
    res.status(500).json({ error: 'Failed to update organization' });
  }
};
