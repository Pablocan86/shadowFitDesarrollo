const jwt = require("jsonwebtoken");

const getToken = (payload) => {
  return jwt.sign(
    {
      data: payload,
    },
    "SHADOWFIT",
    { expiresIn: `1h` }
  );
};

const getTokenData = (token) => {
  let data = null;
  jwt.verify(token, "SHADOWFIT", (err, decoded) => {
    if (err) {
      console.log("Error al obtener data del token");
    } else {
      data = decoded;
    }
  });

  return data;
};

module.exports = {
  getToken,
  getTokenData,
};
