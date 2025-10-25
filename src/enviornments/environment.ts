export const environment = {
  production: false,
  apiUrl: 'https://localhost:44324/api',
  apiHUBUrl: 'https://localhost:44324',
  hubsPath: '/hubs/reviews',
  cloudinary: {
    cloudName: 'dtlgcy0go',
    uploadPreset: 'Ecommerece',
  },
  azureAd: {
    clientId: '2771ca11-46c8-4052-9c47-29f551ed5e6c',
    authority:
      'https://login.microsoftonline.com/4a369bea-f988-4d2b-baae-0d98d5e87d25',
    redirectUri: 'http://localhost:4200/admin',
    postLogoutRedirectUri: 'http://localhost:4200',
    scopes: [
      'openid',
      'profile',
      'email',
      'offline_access',
      'api://2771ca11-46c8-4052-9c47-29f551ed5e6c/Admin.Access',
    ],
  },
};
