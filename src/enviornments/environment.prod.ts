export const environment = {
    production: false,
    apiUrl: 'http://learnings-api-prod.feg0dughchd3d3bj.centralus.azurecontainer.io:8080/api',
    apiHUBUrl: 'http://learnings-api-prod.feg0dughchd3d3bj.centralus.azurecontainer.io:8080',
    hubsPath: '/hubs/reviews',
    cloudinary: {
    cloudName: 'dtlgcy0go',
    uploadPreset: 'Ecommerece'
  },
  azureAd: {
    clientId: 'de9cc888-1e10-4879-b26a-3b10a4fbc6de',
    authority: 'https://login.microsoftonline.com/4a369bea-f988-4d2b-baae-0d98d5e87d25',
    redirectUri: 'http://localhost:4200/admin',
    postLogoutRedirectUri: 'http://localhost:4200',
    scopes: [
      'openid',
      'profile',
      'email',
      'offline_access',
      'api://de9cc888-1e10-4879-b26a-3b10a4fbc6de/Admin.Access'
    ]
  }
  };
  