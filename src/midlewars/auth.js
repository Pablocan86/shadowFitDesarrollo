const isAuthenticated = (req, res, next) => {
  if (req.session.user && req.session.user) {
    return next();
  } else {
    res.redirect("/api/views/paginaprincipal");
  }
};

const isNotAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return next();
  } else {
    res.redirect(`/api/users/perfil/${req.session.user.id}`);
  }
};
const isNotAuthenticatedProfesor = (req, res, next) => {
  if (!req.session.user) {
    return next();
  } else {
    res.redirect(`/api/users/perfil/profesor/${req.session.user.id}`);
  }
};

module.exports = {
  isAuthenticated,
  isNotAuthenticated,
  isNotAuthenticatedProfesor,
};
