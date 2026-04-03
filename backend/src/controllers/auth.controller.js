// auth controller

const authService = require("../services/auth.service");

exports.register = async (req, res) => {
  try {

    const { name, email, password, organizationName, mobile } = req.body;

    const result = await authService.register({
      name,
      email,
      password,
      organizationName,
      mobile
    });

    res.status(201).json(result);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const result = await authService.login({ email, password });

    res.json(result);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
