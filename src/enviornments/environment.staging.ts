export const environment = {
  production: false,
  apiUrl: 'http://learnings-api-staging.d3a7hqf3hacfe4cm.centralus.azurecontainer.io:8080/api',
  apiHUBUrl: 'http://learnings-api-staging.d3a7hqf3hacfe4cm.centralus.azurecontainer.io:8080',
  hubsPath: '/hubs/reviews',
  cloudinary: {
    cloudName: 'dtlgcy0go',
    uploadPreset: 'Ecommerece',
  },
  azureAd: {
    clientId: '2771ca11-46c8-4052-9c47-29f551ed5e6c',
    authority:
      'https://login.microsoftonline.com/4a369bea-f988-4d2b-baae-0d98d5e87d25',
    redirectUri: 'https://learningsfrontendstg.z19.web.core.windows.net/admin',
    postLogoutRedirectUri: 'https://learningsfrontendstg.z19.web.core.windows.net',
    scopes: [
      'openid',
      'profile',
      'email',
      'offline_access',
      'api://2771ca11-46c8-4052-9c47-29f551ed5e6c/Admin.Access',
    ],
  },
};
