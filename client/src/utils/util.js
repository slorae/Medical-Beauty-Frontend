import Taro from '@tarojs/taro';

import {ImgError} from '@/images/index';

export function showErrorToast(msg) {
  Taro.showToast({
    title: msg,
    image: '@/images/icon_error.png'
  })
}

export function redirect(url) {

  //判断页面是否需要登录
  if (false) {
    Taro.redirectTo({
      url: '/packages/pages/auth/login/login'
    });
    return false;
  } else {
    Taro.redirectTo({
      url: url
    });
  }
}
