const { auth } = require('../../lib/auth');

exports.GET = auth.withAuth(async (_request, { user }) => {
  return Response.json({ user });
});
