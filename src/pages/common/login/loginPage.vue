<template>
  <div style="width: 100%; height: 100%; background: #fff">
    <img :src="loginBg" class="back-img" />
    <div
      style="
        position: absolute;
        top: 15px;
        left: 20px;
        z-index: 10;
        display: flex;
        flex-direction: row;
      "
    >
      <img :src="wdpLogo" width="60" height="60" />
      <div
        style="
          color: #098dee;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 2px;
          line-height: 65px;
          padding-left: 10px;
        "
        >应用系统示例模板</div
      >
    </div>
    <img
      width="180"
      :src="companyLogo"
      style="position: absolute; bottom: 25px; right: 30px; z-index: 10"
    />
    <div class="login-total" style="background: #fff">
      <div v-if="!showRegister" style="display: flex; flex-direction: row">
        <img :src="loginMiddleBg" style="width: 500px" />
        <div class="login-content" v-if="!showRegister && !showReset" style="position: relative">
          <div style="margin: 30px 40px" class="login-back">
            <div
              style="
                color: rgb(78, 78, 78);
                font-size: 24px;
                font-weight: 700;
                text-align: center;
                margin-top: 150px;
              "
              >登录</div
            >
            <div style="color: #585858; font-size: 14px; text-align: center; margin-top: 10px">
              您好，欢迎回到本系统
            </div>
            <a-form :model="formState" name="normal_login" style="margin: 0px 40px">
              <div class="aui-inputClear">
                <img
                  src="@/assets/images/login/icon-user.png"
                  height="20"
                  width="20"
                  style="display: inline-block"
                />
                <a-form-item name="name" style="display: inline-block">
                  <a-input
                    @keyup.enter="login"
                    style="width: 280px"
                    v-model:value="formState.name"
                    :bordered="false"
                    placeholder="账号"
                  ></a-input>
                </a-form-item>
              </div>
              <div class="aui-inputClear">
                <img
                  src="@/assets/images/login/icon-password.png"
                  height="20"
                  width="20"
                  style="display: inline-block"
                />
                <a-form-item name="password" style="display: inline-block">
                  <a-input
                    @keyup.enter="login"
                    style="display: inlin-block; width: 280px"
                    v-model:value="formState.password"
                    :bordered="false"
                    placeholder="密码"
                    type="password"
                  ></a-input>
                </a-form-item>
              </div>
            </a-form>
            <div style="display: flex; font-size: 14px; margin: 0px 40px">
              <div style="display: flex; align-items: center; width: 100%">
                <div class="aui-choice">
                  <div>
                    <a-checkbox class="fix-auto-fill" v-model:checked="rememberPsw" />
                    <span style="margin-left: 5px">记住我</span></div
                  >

                  <span style="cursor: pointer; color: rgb(9, 141, 238)" @click="showReset = true"
                    >忘记密码？</span
                  >
                </div>
              </div>
              <!-- <div @click="register">用户注册</div> -->
            </div>
          </div>
          <div style="flex: 1; width: 280px; position: absolute; bottom: -190px">
            <a-button
              :loading="loginLoading"
              class="aui-link-login"
              style="color: #fff !important"
              type="primary"
              @click="login"
              block
            >
              登录</a-button
            >
          </div>
        </div>
        <div v-show="showReset" class="reset-content" style="position: relative"
          ><reset-page @get-back="getBack"></reset-page
        ></div>
      </div>
      <template v-else>
        <register-page @return-login="returnLogin"></register-page>
      </template>
    </div>
    <div style="display: flex; justify-content: center">
      <AppFooter style="position: absolute; width: 500px; bottom: 15px; z-index: 999" />
    </div>
  </div>
</template>
<script setup name="login">
  import { deleteTokenInHeader } from '@/plugins/axios';
  import { reactive, ref, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import { setSessionValue } from '@/utils/hooks/system/useStorage';
  import { setTokenInHeader } from '@/plugins/axios';
  import { useLoginStore } from '@/stores/login';
  // import { passwordVerify } from '@/utils';
  // import { useLayoutStore } from '@/stores/layout/index.js';
  import registerPage from '@/components/register/registerPage.vue';
  import resetPage from '@/components/resetPassword/resetPage.vue';
  import { useGo } from '@/hooks/web/usePage';
  import loginBg from '@/assets/images/login/login-bg.jpg';
  import loginMiddleBg from '@/assets/images/login/login-middle-bg.png';
  import wdpLogo from '@/assets/images/logo/wdp-icon.png';
  import companyLogo from '@/assets/images/logo/full-logo-dark.png';
  import { menuList } from '@/stores/aside';
  import { decrypt, encrypt } from '@/utils/encrypt';
  import AppFooter from '@/components/layout/AppFooter.vue';

  const go = useGo();
  const loginLoading = ref(false);
  const loginStore = useLoginStore();
  const menuStore = menuList();
  const showRegister = ref(false);

  const formState = reactive({
    name: 'Administrator',
    password: '123456',
  });

  setSessionValue('shouldLogout', false);

  const rememberPsw = ref(false);

  const login = async () => {
    try {
      if (formState.name === '' && formState.password === '') {
        message.warning('请输入账号和密码！');
        return;
      } else if (formState.name === '') {
        message.warning('请输入账号！');
        return;
      } else if (formState.password === '') {
        message.warning('请输入密码！');
        return;
      }
      loginLoading.value = true;
      deleteTokenInHeader();
      // 测试数据，由接口获取
      const data = {
        code: 200,
        data: {
          token: '123456789',
        },
      };
      // 判断登录成功
      if (data.code === 200 && data.data.token) {
        setSessionValue('token', data.data.token);
        setSessionValue('userId', data.data.userId);
        setSessionValue('userName', formState.name);
        setSessionValue('userPassword', formState.password);
        setTokenInHeader(data.data.token);
        loginStore.setToken(data.data.token);
        loginStore.setUserName(formState.name);
        loginStore.getLoginMenuTree();
        if (!menuStore.asideMenu.length) {
          // 若没有配置菜单，跳到404
          go('/404');
        } else {
          // 默认首页
          go('/template');
        }

        // 后续登录成功后获取角色、用户等信息
        // xxxxx
        loginLoading.value = false;

        //动态添加路由
        // menuList().menu[0].children.forEach((item) => {
        //   if (item.children) {
        //     item.children.forEach((index) => {
        //       if (index.children) {
        //         index.children.forEach((value) => {
        //           router.addRoute({
        //             path: value.url,
        //             meta: { name: value.name, icon: value.icon },
        //             name: value.url,
        //             // component: () => import(`../template${value.url}`),
        //           });
        //         });
        //       }
        //       router.addRoute({
        //         path: index.url,
        //         meta: { name: index.name, icon: index.icon },
        //         name: index.url,
        //         // component: () => import(`../template${value.url}`),
        //       });
        //     });
        //   }
        // });
        // router.addRoute({ path: '/:catchAll(.*)', redirect: '/404', hidden: true });

        // let path = '';
        // if (menuList().menu.length > 0) {
        //   if (menuList().menu[0].children[0].children[0].children.length > 0) {
        //     path = menuList().menu[0].children[0].children[0].children[0].url;
        //   } else {
        //     path = menuList().menu[0].children[0].url;
        //   }
        // }
        // if (path !== '') {
        //   router.push({ path });
        // } else {
        //   message.error('菜单获取失败，请检查');
        // }

        // 记住密码保存到浏览器本地缓存
        if (rememberPsw.value) {
          window.localStorage.setItem('rememberPsw', 'true');
          window.localStorage.setItem('reName', formState.name);
          window.localStorage.setItem('rePassword', encrypt(formState.password));
        } else {
          window.localStorage.setItem('rememberPsw', 'false');
          window.localStorage.removeItem('reName');
          window.localStorage.removeItem('rePassword');
        }
      }
    } catch (e) {
      console.log(e.response);
    } finally {
      loginLoading.value = false;
    }
  };

  const returnLogin = (e) => {
    showRegister.value = e;
  };

  const getBack = (e) => {
    showReset.value = e;
  };

  const showReset = ref(false);

  onMounted(async () => {
    rememberPsw.value = window.localStorage.getItem('rememberPsw') === 'true';
    if (rememberPsw.value) {
      formState.name = window.localStorage.getItem('reName');
      formState.password = decrypt(window.localStorage.getItem('rePassword'));
    }
  });
</script>
<style scoped lang="scss">
  .back-img {
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
  .login-content {
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    height: 170px;
    width: 350px !important;
  }
  .reset-content {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    height: 170px;
    width: 350px !important;
  }
  /* .login-back {
    background-image: url('@/assets/images/login/login-back.png');
    background-size: 100% 100%;
    padding: 15px 20px;
    color: #fff;
    width: 550px;
    height: 300px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  } */
  .user-style {
    width: 50px;
    text-align: center;
    font-size: 15px;
    letter-spacing: 2px;
    margin: 0 15px 0 5px;
    color: #fff;
  }
  .login-total {
    width: 851px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: auto;
    display: flex;
    align-items: center;
    flex-direction: column;
    z-index: 3000;
    box-shadow: 0 4px 8px 1px #0003;
    border-radius: 15px;
  }

  .title {
    font-size: 50px;
    font-weight: bold;
    color: #fff;
    letter-spacing: 5px;
    flex: 1;
    display: flex;
    align-items: flex-end;
    text-shadow: 0px 0px 4px #bacbdd;
  }
  .aui-choice {
    position: relative;
    font-size: 12px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    position: relative;
    color: #040404;
    width: 100%;
    justify-content: space-between;
  }

  .aui-choice input {
    width: 14px;
    height: 14px;
    cursor: pointer;
  }

  .aui-inputClear {
    height: 40px;
    width: 100%;
    border-bottom: 1px solid #cccccc;
    position: relative;
    padding-left: 20px;
    background: #fff;
    margin-bottom: 8px;
    margin-top: 20px;
  }

  .aui-inputClear .ant-form-item {
    margin-bottom: 0 !important;
    border: none;
    background: none !important;
  }
  .aui-inputClear img {
    position: absolute;
    top: 10px;
    left: 0;
  }

  .aui-inputClear input {
    width: 100%;
    padding: 10px;
    border: none;
    color: #333333;
    font-size: 14px;
    background: none !important;
  }

  .aui-inputClear input:active {
    border: none;
  }

  .aui-inputClear:focus {
    border-bottom: 1px solid #1b90ff;
  }

  .aui-inputClear:hover {
    border-bottom: 1px solid #1b90ff;
  }

  input {
    &:autofill {
      background: #fff;
    }
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      transition: background-color 5000s !important;
      -webkit-text-fill-color: rgba(0, 0, 0, 0.65) !important;
      border: none !important;
    }
  }

  .aui-link-login {
    height: 42px;
    padding: 10px 15px;
    font-size: 14px;
    border-radius: 8px;
    margin-top: 15px;
    margin-bottom: 8px;
  }
</style>
