export const setCookie = (name, value, days) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 60 * 1000); //dk glb
    //date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

export const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const eraseCookie = (name) => {
  document.cookie = name + '=; Max-Age=-99999999;';
};

export const generateUserAuthCookie = () => {
  const userToken = `user-${Math.random().toString(36).substring(2)}-${Date.now()}`;
  setCookie('userAuthToken', userToken, 3);
  return userToken;
};

export const getUserAuthToken = () => {
  return getCookie('userAuthToken');
};

export const removeUserAuthToken = () => {
  eraseCookie('userAuthToken');
};
