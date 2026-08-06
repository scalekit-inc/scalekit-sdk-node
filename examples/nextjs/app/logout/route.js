const { auth } = require('../../lib/auth');

exports.GET = auth.createLogoutHandler();
