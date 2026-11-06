export const environment = {
  production: false,
  // En desarrollo, proxy.conf.json redirige /api a http://localhost:9600 (evita CORS)
  apiUrl: '/api',
  // Pendiente HU-08: mientras el backend no tenga /api/auth/login, el login acepta
  // cualquier usuario y contraseña. Poner en false cuando exista el endpoint.
  authSimulado: true,
};
