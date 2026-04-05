// organization controller

const organizationService = require('../services/organization.service');

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
    console.error('Error fetching organization:', err);
    res.status(500).json({ error: err.message });
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
    console.error('Error updating organization:', err);
    res.status(500).json({ error: err.message });
  }
};
