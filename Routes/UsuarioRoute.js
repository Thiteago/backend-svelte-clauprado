const UsuarioController = require('../Controller/UsuarioController');

module.exports = (app) => {
  app.post('/usuario', UsuarioController.postNovoUsuario);
  app.post('/login', UsuarioController.postLogin);
  app.put('/usuario/:id', UsuarioController.put);
  app.delete('/usuario/:id', UsuarioController.delete);
  app.get('/usuarios', UsuarioController.get);
  app.get('/usuario/:id', UsuarioController.getById);
};
