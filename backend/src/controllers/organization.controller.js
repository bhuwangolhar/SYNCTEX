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
    
    // Extract both snake_case and camelCase formats (handle both from different sources)
    const {
      name,
      founder_name,
      founderName,
      contact_info,
      contactInfo,
      logo,
      tax_info,
      taxInfo
    } = req.body;

    // Pass to service with consistent camelCase keys
    const organization = await organizationService.updateOrganization(organizationId, {
      name,
      founder_name: founder_name || founderName,
      contactInfo: contact_info || contactInfo,
      logo,
      taxInfo: tax_info || taxInfo
    });

    res.json({ message: 'Organization updated successfully', organization });
  } catch (err) {
    if (!isProduction) console.error('Error updating organization:', err.message);
    res.status(500).json({ error: 'Failed to update organization' });
  }
};
