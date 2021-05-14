const userModel = require("../models/user");
const bcrypt = require("bcryptjs");

module.exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(401).json({
      success: false,
      message: "incorrect credentials",
      error: {
        statusCode: 401,
        description: "username and password are both required",
      },
    });
  }

  await userModel
    .findOne({ username })
    .then(async (user) => {
      if (await bcrypt.compare(password, user.password)) {
        return res.status(200).json({
          success: true,
          message: "login successfull",
          data: {
            statusCode: 200,
            description: "account login successfull",
            user,
          },
        });
      }
      return res.status(401).json({
        success: false,
        message: "incorrect password",
        error: {
          statusCode: 404,
          description: "the provided password is incorrect",
        },
      });
    })
    .catch((error) => {
      return res.status(404).json({
        success: false,
        message: "user not found",
        error: {
          statusCode: 404,
          description: "no account associated with the given username",
        },
      });
    });
};
