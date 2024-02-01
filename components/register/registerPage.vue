<template>
  <div class="title">
    <span>用户注册</span>
  </div>
  <div class="login-content">
    <div style="" class="login-back">
      <a-form
        style="width: 430px"
        :model="formState"
        name="normal_login"
        class="login-form"
        :rules="rules"
      >
        <a-form-item name="name" label="账户" :labelCol="{ span: 5, offset: 1 }">
          <a-input
            style="display: inline-block; width: 292px"
            v-model:value="formState.name"
          ></a-input>
        </a-form-item>

        <a-form-item name="password" label="密码" :labelCol="{ span: 5, offset: 1 }">
          <a-input-password
            style="display: inlin-block; width: 292px"
            v-model:value="formState.password"
          ></a-input-password>
        </a-form-item>
        <a-form-item name="confirmPassword" label="确认密码" :labelCol="{ span: 5, offset: 1 }">
          <a-input-password
            style="display: inlin-block; width: 292px"
            v-model:value="formState.confirmPassword"
          ></a-input-password>
        </a-form-item>
        <a-form-item name="phone" label="手机号" :labelCol="{ span: 5, offset: 1 }">
          <a-input
            style="display: inlin-block; width: 292px"
            v-model:value="formState.phone"
          ></a-input>
        </a-form-item>
        <a-form-item name="code" label="验证码" :labelCol="{ span: 5, offset: 1 }">
          <div style="display: flex; justify-content: space-between">
            <a-input
              style="display: inlin-block; width: 150px"
              v-model:value="formState.code"
            ></a-input>
            <a-button type="primary" @click="captcha" style="margin-right: 30px">
              {{ explainCode }}
              {{ explainCode === '重新发送' ? '(' + captchaTime + ')' : '' }}</a-button
            >
          </div>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 1 }">
          <div style="display: flex; justify-content: space-between; width: 380px; font-size: 14px">
            <div style="flex: 1; display: flex; justify-content: center">
              <a-button
                type="primary"
                html-type="submit"
                @click="register"
                style="margin-left: 60px"
                >注册</a-button
              >
            </div>
            <div style="display: flex; align-items: center; color: #fff" @click="returnLogin">
              返回登录
            </div>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup>
  import { reactive, ref } from 'vue';
  import { message } from 'ant-design-vue';
  import { registerApi, getCaptcha, checkName } from '@/api/register';
  import { passwordVerify } from '@/utils/index.js';

  const emit = defineEmits(['returnLogin']);
  const formState = reactive({
    name: '',
    password: '',
    confirmPassword: '',
    phone: '',
    code: '',
  });
  const explainCode = ref('发送动态密码');
  const dynamicPw = ref(null);
  const captchaTime = ref('');
  const captcha = async () => {
    if (formState.phone.length === 11 && /^\d{11}$/.test(formState.phone)) {
      const { data } = await getCaptcha({
        phone: formState.phone,
      });
      if (data.code === 200) {
        explainCode.value = '重新发送';
        dynamicPw.value = data.data; // 前端验证动态密码
        const interval = setInterval(() => {
          captchaTime.value++;
          if (captchaTime.value === 60) {
            explainCode.value = '发送动态密码';
            clearInterval(interval);
          }
        }, 1000);
      }
    } else {
      message.warning('请输入手机号');
    }
  };

  const validatePass = (rule, value) => {
    if (!value) {
      return Promise.reject('密码不能为空');
    }
    if (value.length < 8) {
      return Promise.reject('密码不少于8位');
    }
    if (value.length > 20) {
      return Promise.reject('密码不大于20位');
    }
    const isValid = passwordVerify(value);
    if (!isValid) {
      return Promise.reject('设置8至20位的大写字母、小写字母、数字和特殊符号中至少三种组合的密码');
    }
    return Promise.resolve();
  };
  const validatePhone = (rule, value) => {
    if (!value) {
      return Promise.reject('手机号不能为空');
    }
    const regularNumber = /^\d{11}$/.test(value);
    if (regularNumber) {
      return Promise.resolve();
    }
    return Promise.reject('手机号由11位数字组成');
  };
  const rules = {
    name: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    password: [{ required: true, validator: validatePass, trigger: 'change' }],
    confirmPassword: [{ required: true, validator: validatePass, trigger: 'change' }],
    phone: [{ required: true, validator: validatePhone, trigger: 'change' }],
    code: [{ required: true, message: '验证码不可为空', trigger: 'blur' }],
  };

  const register = async () => {
    try {
      if (formState.name === '') {
        message.warning('请输入账号！');
        return;
      } else if (formState.password === '' || !passwordVerify(formState.password)) {
        message.warning('设置8至20位的大写字母、小写字母、数字和特殊符号中至少三种组合的密码!');
        return;
      } else if (formState.confirmPassword === '' || !passwordVerify(formState.confirmPassword)) {
        message.warning('设置8至20位包括大小写字母、数字、特殊字符的确认密码!');
        return;
      } else if (formState.confirmPassword !== formState.password) {
        message.warning('密码和确认密码不一致！');
        return;
      } else if (formState.phone.length !== 11 || !/^\d{11}$/.test(formState.phone)) {
        message.warning('请输入11位数的手机号!');
        return;
      } else if (formState.code === '') {
        message.warning('请输入正确的动态密码!');
        return;
      }
      const { data: result } = await checkName({
        name: formState.name,
      });
      if (result.code === 200) {
        const { data } = await registerApi(formState);
        if (data.code === 200) {
          message.success(data.message);
          emit('returnLogin', false);
        } else {
          message.error(data.message);
        }
      } else {
        message.error(result.message);
      }
    } catch (e) {
      message.error(e.message);
    }
  };
  const returnLogin = () => {
    emit('returnLogin', false);
  };
</script>

<style lang="scss" scoped>
  .title {
    font-size: 50px;
    font-weight: bold;
    color: #fff;
    letter-spacing: 5px;
    height: 23.3%;
    display: flex;
    align-items: flex-end;
    text-shadow: 0px 0px 4px #bacbdd;
  }
  .login-content {
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    height: 470px;
  }
  .login-back {
    background-image: url('@/assets/images/login/login-back.png');
    background-size: 100% 100%;
    padding: 25px 20px 0px;
    color: #fff;
    width: 700px;
    height: 470px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
  .user-style {
    // width: 50px;
    text-align: center;
    font-size: 15px;
    letter-spacing: 2px;
    margin: 0 15px 0 5px;
    color: #fff;
  }
  .login-total {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    flex-direction: column;
    z-index: 3000;
  }
  :deep(.ant-form-item-label > label) {
    color: #fff !important;
    font-size: 15px !important;
  }
</style>
