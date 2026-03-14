const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const Organization = require("../models/organization.model");

exports.register = async ({ name, email, password, organizationName }) => {

  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const organization = await Organization.create({
    name: organizationName
  });

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "ADMIN",
    organization_id: organization.id
  });

  const token = jwt.sign(
    { userId: user.id, organizationId: organization.id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, token };
};

exports.login = async ({ email, password }) => {

  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user.id, organizationId: user.organization_id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, token };
};