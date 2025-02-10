exports.logout = async (req, res) => {
  const { email } = req.session.user;
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error al cerrar sesión" });
    }
    res.redirect("../views/paginaprincipal");
  });
};
