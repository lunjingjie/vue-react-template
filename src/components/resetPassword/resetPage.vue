<template>
  <div>
    <div
      style="
        color: rgb(78, 78, 78);
        font-size: 24px;
        font-weight: 700;
        text-align: center;
        margin-top: 150px;
      "
      >重置密码</div
    >
    <div v-if="!hasUsers" class="reset_body">
      <a-form :model="formState" ref="formRef">
        <div class="aui-inputClear">
          <Icon
            size="30"
            icon="material-symbols:phone-android-outline"
            color="#098dee"
            style="display: inline-block"
          />
          <a-form-item
            name="phone"
            style="display: inline-block"
            :rules="[
              { required: true, message: '请输入手机号码' },
              {
                pattern:
                  /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9]|19[1|9])\d{8}$/,
                message: '请输入正确的11位手机号码',
                trigger: 'blur',
              },
            ]"
          >
            <a-input
              style="width: 280px"
              v-model:value="formState.phone"
              :bordered="false"
              placeholder="手机号码"
            ></a-input>
          </a-form-item>
        </div>
        <div class="code-inputClear">
          <Icon
            size="30"
            icon="material-symbols:lock-outline"
            color="#098dee"
            style="display: inline-block"
          />
          <a-form-item name="code" :rules="[{ required: true, message: '请输入验证码' }]">
            <a-input
              style="width: 180px; margin-bottom: 8px"
              v-model:value="formState.code"
              :bordered="false"
              placeholder="验证码"
            ></a-input>
          </a-form-item>
          <a-button type="primary" v-if="showCode" @click="sendCode">发送验证码</a-button>
          <span v-else>{{ count }}s后重新获取</span>
        </div></a-form
      >
      <div style="width: 280px; position: absolute; bottom: -220px; display: flex">
        <a-button
          :loading="loginLoading"
          class="aui-link-login"
          style="color: #fff !important"
          type="primary"
          @click="checkUser"
          block
        >
          提交</a-button
        >
        <a-button class="aui-link-login" @click="emits('getBack', false)" block> 返回登录</a-button>
      </div></div
    >
    <div v-else class="reset_body">
      <a-form :model="usersForm" ref="usersRef">
        <div class="aui-inputClear">
          <Icon
            size="30"
            icon="material-symbols:person"
            color="#098dee"
            style="display: inline-block"
          />

          <a-form-item
            name="userId"
            style="display: inline-block"
            :rules="[{ required: true, message: '请选择账号' }]"
          >
            <a-select
              style="width: 280px"
              v-model:value="usersForm.userId"
              :bordered="false"
              placeholder="请选择账号"
            >
              <a-select-option v-for="item in usersList" :key="item.userId" :value="item.userId">
                {{ item.userName }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </div>
        <div class="code-inputClear">
          <Icon
            size="30"
            icon="material-symbols:lock-outline"
            color="#098dee"
            style="display: inline-block"
          />
          <a-form-item name="password" :rules="[{ required: true, message: '请输入新密码' }]">
            <a-input-password
              style="width: 280px; margin-bottom: 8px"
              v-model:value="usersForm.password"
              :bordered="false"
              placeholder="新密码"
            ></a-input-password>
          </a-form-item>
        </div>
        <div class="code-inputClear">
          <Icon
            size="30"
            icon="material-symbols:lock-outline"
            color="#098dee"
            style="display: inline-block"
          />
          <a-form-item
            name="repassword"
            :rules="[
              {
                required: true,
                message: '两次密码不一致',
                pattern: new RegExp('^' + usersForm.password + '$'),
              },
            ]"
          >
            <a-input-password
              style="width: 280px; margin-bottom: 8px"
              v-model:value="usersForm.repassword"
              :bordered="false"
              placeholder="再次输入新密码"
            ></a-input-password>
          </a-form-item>
        </div>
        验证码有效时间：{{ getcodeCount(codeCount) }}秒</a-form
      >
      <div style="width: 280px; position: absolute; bottom: -220px; display: flex">
        <a-button
          :loading="loginLoading"
          class="aui-link-login"
          style="color: #fff !important"
          type="primary"
          @click="updateData"
          block
        >
          提交</a-button
        >
        <a-button class="aui-link-login" @click="hasUsers = false" block> 返回</a-button>
      </div></div
    >
  </div>
</template>

<script setup>
  import { onMounted, reactive, ref } from 'vue';
  import { sendCodeApi, checkUsersApi, updateDataApi } from '@/api/reset-password/index.js';
  import { deleteTokenInHeader } from '@/plugins/axios';
  import { message } from 'ant-design-vue';
  const formState = reactive({});
  const loginLoading = ref(false);
  const formRef = ref();

  const showCode = ref(true);
  const sendCode = async () => {
    const values = await formRef.value.validateFields('phone');
    if (values) {
      const { data: res } = await sendCodeApi(formState.phone);
      if (res) {
        message.success('验证码发送成功！');
        countDown();
        codeDown();
      }
    }
  };
  const timer = ref(null);
  const count = ref(60);
  const countDown = () => {
    timer.value = setInterval(() => {
      showCode.value = false;
      if (count.value <= 0) {
        clearInterval(timer.value);
        count.value = 61;
        showCode.value = true;
      }
      count.value--;
    }, 1000);
  };
  const codeTimer = ref(null);
  const codeCount = ref(302);
  const codeDown = () => {
    codeTimer.value = setInterval(() => {
      if (codeCount.value <= 0) {
        clearInterval(codeTimer.value);
        codeCount.value = 304;
      }
      codeCount.value--;
    }, 1000);
  };

  const hasUsers = ref(false);
  const usersList = ref([{}]);
  const checkUser = async () => {
    const values = await formRef.value.validateFields();
    if (values) {
      const { data: res } = await checkUsersApi(formState);
      if (res.code === 200) {
        hasUsers.value = true;
        usersList.value = res.data;
      }
    }
  };

  const usersForm = reactive({});
  const usersRef = ref();
  const updateData = async () => {
    const values = await usersRef.value.validateFields();
    if (values) {
      if (codeCount.value <= 2) {
        message.warning('验证码已过期！');
      } else {
        const { data: res } = await updateDataApi({
          ...formState,
          ...usersForm,
        });
        if (res.code === 200) {
          message.success('重置成功！');
          emits('getBack', false);
        }
      }
    }
  };
  const emits = defineEmits(['getBack']);
  const getcodeCount = (val) => {
    if (val >= 2 && val <= 302) {
      return val - 2;
    } else {
      val = 0;
      return val;
    }
  };
  onMounted(() => {
    deleteTokenInHeader();
  });
</script>

<style scoped lang="scss">
  .reset_body {
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 4000;
  }
  .code-inputClear {
    height: 40px;
    width: 100%;
    border-bottom: 1px solid #cccccc;
    display: flex;
    margin-bottom: 8px;
    margin-top: 20px;
  }
  .aui-inputClear {
    height: 40px;
    width: 100%;
    border-bottom: 1px solid #cccccc;
    position: relative;
    margin-bottom: 8px;
    margin-top: 20px;
    display: flex;
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
  .aui-link-login {
    height: 42px;
    padding: 10px 15px;
    font-size: 14px;
    border-radius: 8px;
    margin-top: 15px;
    margin-bottom: 8px;
    margin-right: 8px;
  }
</style>
