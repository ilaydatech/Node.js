const user = require("../models/user.model");
const bcrypt = require("bcrypt");
const APIError = require("../utils/errors");
const Response = require("../utils/response");
const { createToken } = require("../middlewares/auth");

const login = async (req, res) => {
  const { email, password } = req.body;

  const userInfo = await user.findOne({ email });

  if (!userInfo) throw new APIError("Email yada şifre hatalı!", 401);

  const comparePassword = await bcrypt.compare(password, userInfo.password);
  console.log(comparePassword);

  if (!comparePassword) throw new APIError("Email yada şifre hatalı!", 401);

  createToken(userInfo, res);
}; 

const register = async (req, res) => {
  const { email } = req.body;

  const userCheck = await user.findOne({ email });

  if (userCheck) {
    throw new APIError("Girmiş oldugunuz mail kullanımda!", 401);
  }

  req.body.password = await bcrypt.hash(req.body.password, 10);

  console.log("hash sifre: ", req.body.password);

  const userSave = new user(req.body);
  //Response bir class olduğu için new kullanılır.
  await userSave
    .save()
    .then((data) => {
      return new Response(data, "Kayıt başarıyla eklendi").created(res);
    })
    .catch((err) => {
      throw new APIError("Kullanıcı kayıt edilemedi!", 400);
      console.log(err);
    });
};

