// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('antd-pro-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  if (!authority && ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return ['admin'];
  }
  return authority;
}
export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}

export function getLogged() {
  const authority = localStorage.getItem(`logged`) || false;
  return JSON.parse(authority);
}

export function setLogged(authority) {
  return localStorage.setItem(`logged`, authority || false);
}

export function isLogged() {
  return getLogged();
}

export function isActionsAllowable(targets) {
  const allowableActions = getAuthority();
  console.log(targets);

  // Handle String type actions
  if (typeof targets === 'string') {
    return allowableActions.indexOf(targets) >= 0;
  }

  // Handle Array type actions
  if (Array.isArray(targets)) {
    const allowableStatus = {};
    targets.forEach(action => {
      if (allowableActions.indexOf('*') >= 0) {
        allowableStatus[action] = true;
      } else {
        allowableStatus[action] = allowableActions.indexOf(action) >= 0;
      }
    });
    return allowableStatus;
  }
  return false;
}
