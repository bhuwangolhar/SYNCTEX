'use strict';

const Branch = require('../models/branch.model');

const normalizeBranchCode = (code) => code.toUpperCase().replace(/[^A-Z0-9@_\\-]/g, '');

const validateBranchCode = (code) => {
  const normalized = normalizeBranchCode(code);
  return normalized.length >= 1 && normalized.length <= 8;
};

const DEFAULT_PHONE = '+919876543210';

const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const normalized = phone.replace(/[^0-9+]/g, '');
  return /^\+91[6-9]\d{9}$/.test(normalized) || /^[6-9]\d{9}$/.test(normalized);
}; // support +91xxxx AND 10-digit mobile numbers

const validatePincode = (pincode) => {
  if (!pincode) return true; // pincode optional
  return /^\d{4,10}$/.test(String(pincode).replace(/[^0-9]/g, ''));
};

const validateCoordinates = (lat, lng) => {
  if (!lat && !lng) return true; // both optional
  const latNum = typeof lat === 'string' ? parseFloat(lat) : lat;
  const lngNum = typeof lng === 'string' ? parseFloat(lng) : lng;
  if (isNaN(latNum) || isNaN(lngNum)) return true; // allow invalid to be ignored
  if (latNum < -90 || latNum > 90) return false;
  if (lngNum < -180 || lngNum > 180) return false;
  return true;
};

const deriveStateCode = (gstin) => {
  if (!gstin || gstin.length < 2) return null;
  return gstin.substring(0, 2);
};

exports.getBranches = async (organizationId) => {
  const isProduction = process.env.NODE_ENV === 'production';
  try {
    const branches = await Branch.findAll({
      where: { organizationId },
      include: [
        { model: require('../models/user.model'), as: 'owner', required: false, attributes: ['id', 'name'] },
        { model: require('../models/user.model'), as: 'creator', required: false, attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    return branches;
  } catch (err) {
    if (!isProduction) console.error('[branch.service] getBranches error:', err.message);
    // fallback: return without includes if associations fail
    const branches = await Branch.findAll({
      where: { organizationId },
      order: [['createdAt', 'DESC']]
    });
    return branches;
  }
};

exports.getBranchById = async (id, organizationId) => {
  try {
    const branch = await Branch.findOne({
      where: { id, organizationId },
      include: [
        { model: require('../models/user.model'), as: 'owner', required: false, attributes: ['id', 'name'] },
        { model: require('../models/user.model'), as: 'creator', required: false, attributes: ['id', 'name'] }
      ]
    });
    if (!branch) throw new Error('Branch not found');
    return branch;
  } catch (err) {
    // fallback without includes
    const branch = await Branch.findOne({
      where: { id, organizationId }
    });
    if (!branch) throw new Error('Branch not found');
    return branch;
  }
};

exports.createBranch = async (data, organizationId, createdBy) => {
  const normalizedCode = normalizeBranchCode(data.branchCode);
  if (!validateBranchCode(normalizedCode)) throw new Error('Invalid branch code format');

  const existing = await Branch.findOne({
    where: { branchCode: normalizedCode, organizationId }
  });
  if (existing) throw new Error('Branch code already exists in this organization');

  const normalizedPhone = data.phone && validatePhone(String(data.phone)) ? String(data.phone).trim() : DEFAULT_PHONE;
  const normalizedPincode = data.pincode ? String(data.pincode).trim() : '000000';

  if (!normalizedPhone || !validatePhone(normalizedPhone)) throw new Error('Invalid phone number format');
  if (!validatePincode(normalizedPincode)) throw new Error('Invalid pincode format');

  // coerce lat/lng from string if needed
  let lat = data.latitude;
  let lng = data.longitude;
  if (typeof lat === 'string') lat = lat.trim() ? parseFloat(lat) : null;
  if (typeof lng === 'string') lng = lng.trim() ? parseFloat(lng) : null;

  if (!validateCoordinates(lat, lng)) throw new Error('Invalid coordinates');

  const finalCity = data.city ? String(data.city).trim() : 'N/A';
  const finalState = data.state ? String(data.state).trim() : 'N/A';
  const finalAddress = data.addressLine1 ? String(data.addressLine1).trim() : 'N/A';
  const finalName = data.name ? String(data.name).trim() : 'Untitled Branch';

  if (!data.branchCode) throw new Error('Branch code is required');
  if (!data.name) throw new Error('Branch name is required');

  data.phone = normalizedPhone;
  data.pincode = normalizedPincode;
  data.city = finalCity;
  data.state = finalState;
  data.addressLine1 = finalAddress;
  data.name = finalName;

  if (data.gstRegistered) {
    if (!data.gstinNumber) throw new Error('GSTIN number required when GST registered');
    if (!data.placeOfSupply) throw new Error('Place of supply required when GST registered');
    data.stateCode = deriveStateCode(data.gstinNumber);
  }

  return await Branch.create({
    organizationId,
    branchCode: normalizedCode,
    name: data.name,
    branchType: data.branchType,
    branchStatus: data.branchStatus,
    openingDate: data.openingDate || null,
    operationalSince: data.operationalSince || null,
    addressLine1: data.addressLine1 || finalAddress,
    addressLine2: data.addressLine2 || null,
    area: data.area || 'N/A',
    city: data.city || finalCity,
    state: data.state || finalState,
    country: data.country || 'India',
    pincode: normalizedPincode,
    googleMapsLink: data.googleMapsLink || null,
    latitude: lat,
    longitude: lng,
    phone: normalizedPhone,
    email: data.email || `info@${String(organizationId).slice(0, 8)}.local`,
    branchOwnerId: data.branchOwnerId || null,
    gstRegistered: Boolean(data.gstRegistered),
    gstinNumber: data.gstinNumber || null,
    placeOfSupply: data.placeOfSupply || null,
    stateCode: data.stateCode || null,
    createdBy
  });
};

exports.updateBranch = async (id, data, organizationId) => {
  const branch = await Branch.findOne({ where: { id, organizationId } });
  if (!branch) throw new Error('Branch not found');

  if (data.branchCode) {
    const normalizedCode = normalizeBranchCode(data.branchCode);
    if (!validateBranchCode(normalizedCode)) throw new Error('Invalid branch code format');
    const existing = await Branch.findOne({
      where: { branchCode: normalizedCode, organizationId, id: { [require('sequelize').Op.ne]: id } }
    });
    if (existing) throw new Error('Branch code already exists in this organization');
    data.branchCode = normalizedCode;
  }

  if (data.phone !== undefined && data.phone !== null && data.phone !== '') {
    if (!validatePhone(String(data.phone))) {
      // keep existing phone for updates instead of rejecting pre-filled placeholder values
      data.phone = branch.phone || DEFAULT_PHONE;
    }
  }
  if (data.pincode && !validatePincode(data.pincode)) throw new Error('Invalid pincode format');

  // coerce lat/lng from string if needed
  if (data.latitude !== undefined) {
    if (typeof data.latitude === 'string') {
      data.latitude = data.latitude.trim() ? parseFloat(data.latitude) : null;
    }
  }
  if (data.longitude !== undefined) {
    if (typeof data.longitude === 'string') {
      data.longitude = data.longitude.trim() ? parseFloat(data.longitude) : null;
    }
  }

  if ((data.latitude !== undefined || data.longitude !== undefined) && !validateCoordinates(data.latitude, data.longitude)) throw new Error('Invalid coordinates');

  if (data.gstRegistered !== undefined && data.gstRegistered) {
    if (!data.gstinNumber) throw new Error('GSTIN number required when GST registered');
    if (!data.placeOfSupply) throw new Error('Place of supply required when GST registered');
    data.stateCode = deriveStateCode(data.gstinNumber);
  }

  delete data.organizationId; // Prevent changing org

  const updatePayload = {
    branchCode: data.branchCode ? normalizeBranchCode(data.branchCode) : branch.branchCode,
    name: data.name || branch.name,
    branchType: data.branchType || branch.branchType,
    branchStatus: data.branchStatus || branch.branchStatus,
    openingDate: data.openingDate || branch.openingDate,
    operationalSince: data.operationalSince || branch.operationalSince,
    addressLine1: data.addressLine1 || branch.addressLine1,
    addressLine2: data.addressLine2 || branch.addressLine2,
    area: data.area || branch.area,
    city: data.city || branch.city,
    state: data.state || branch.state,
    country: data.country || branch.country,
    pincode: data.pincode || branch.pincode,
    googleMapsLink: data.googleMapsLink || branch.googleMapsLink,
    latitude: data.latitude !== undefined ? data.latitude : branch.latitude,
    longitude: data.longitude !== undefined ? data.longitude : branch.longitude,
    phone: data.phone || branch.phone,
    email: data.email || branch.email,
    branchOwnerId: data.branchOwnerId || branch.branchOwnerId,
    gstRegistered: data.gstRegistered !== undefined ? data.gstRegistered : branch.gstRegistered,
    gstinNumber: data.gstinNumber || branch.gstinNumber,
    placeOfSupply: data.placeOfSupply || branch.placeOfSupply,
    stateCode: data.stateCode || branch.stateCode
  };

  await branch.update(updatePayload);
  return branch;
};

exports.deleteBranch = async (id, organizationId) => {
  const branch = await Branch.findOne({ where: { id, organizationId } });
  if (!branch) throw new Error('Branch not found');
  // For now, simple delete since no references yet
  await branch.destroy();
  return true;
};

exports.createDefaultHomeBranch = async ({ organizationId, createdBy, ownerId = null, orgName, email = '', phone = '' }) => {
  const defaultCode = 'HOME';
  const existing = await Branch.findOne({ where: { organizationId, branchCode: defaultCode } });
  if (existing) return existing;

  const normalizedPhone = validatePhone(phone) ? phone : DEFAULT_PHONE;
  const normalizedEmail = email && email.includes('@') ? email : `noreply@${String(orgName || 'org').replace(/\s+/g, '').toLowerCase()}.com`;

  try {
    return await exports.createBranch(
      {
        branchCode: defaultCode,
        name: `Head Office`,
        branchType: 'HEAD_OFFICE',
        branchStatus: 'ACTIVE',
        addressLine1: 'Head Office',
        addressLine2: null,
        area: 'Headquarter',
        city: 'N/A',
        state: 'N/A',
        country: 'India',
        pincode: '000000',
        googleMapsLink: null,
        latitude: null,
        longitude: null,
        phone: normalizedPhone,
        email: normalizedEmail,
        branchOwnerId: ownerId,
        gstRegistered: false,
        gstinNumber: null,
        placeOfSupply: null,
        stateCode: null
      },
      organizationId,
      createdBy
    );
  } catch (err) {
    // Avoid blocking user account creation for branch defaults;
    // log the issue and continue.
    console.warn('Home branch creation failed:', err.message);
    return null;
  }
};

exports.createDefaultUserBranch = async ({ organizationId, createdBy, ownerId, userName }) => {
  const code = `USER_${(ownerId || '').slice(0, 5).toUpperCase()}`.slice(0, 8);
  const existing = await Branch.findOne({ where: { organizationId, branchCode: code } });
  if (existing) return existing;

  try {
    return await exports.createBranch(
      {
        branchCode: code,
        name: `${userName || 'User'} Branch`,
        branchType: 'BRANCH_OFFICE',
        branchStatus: 'ACTIVE',
        addressLine1: 'Employee Branch',
        addressLine2: null,
        area: 'Employee Area',
        city: 'N/A',
        state: 'N/A',
        country: 'India',
        pincode: '000000',
        googleMapsLink: null,
        latitude: null,
        longitude: null,
        phone: '+911234567890',
        email: `branch.${ownerId}@${organizationId}.local`,
        branchOwnerId: ownerId,
        gstRegistered: false,
        gstinNumber: null,
        placeOfSupply: null,
        stateCode: null
      },
      organizationId,
      createdBy
    );
  } catch (err) {
    console.warn('User branch creation failed:', err.message);
    return null;
  }
};
