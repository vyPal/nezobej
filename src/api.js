/* eslint-disable no-undef */
import { Appwrite } from 'appwrite';
import { aw } from './config.json';

let api = {
  sdk: null,

  provider: () => {
    if(api.sdk) return api.sdk;
    let appwrite = new Appwrite();
    if(process.env.NODE_ENV == 'development') {
      appwrite.setEndpoint('http://192.168.1.164:81/v1').setProject(aw.projectId);
    }else {
      appwrite.setEndpoint(aw.endpoint).setProject(aw.projectId);
    }
    api.sdk = appwrite;
    return appwrite;
  },

  createAccount: (email, password, name) => {
    return api.provider().account.create('unique()', email, password, name);
  },
    
  getAccount: () => {
    return api.provider().account.get();
  },

  getPrefs: () => {
    return api.provider().account.getPrefs();
  },

  updatePrefs: (prefs) => {
    return api.provider().account.updatePrefs(prefs);
  },
    
  createSession: (email, password) => {
    return api.provider().account.createSession(email, password);
  },
    
  deleteCurrentSession: () => {
    return api.provider().account.deleteSession('current');
  },
};

export default api;