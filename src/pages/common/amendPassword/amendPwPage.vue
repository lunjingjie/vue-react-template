<template>
  <div style="background-color: #fff; padding: 10px; height: 98%">
    <div class="search_card">
      <div class="search_title">账号安全中心</div>
    </div>
    <div
      style="margin-top: 12px; width: 100%; padding: 10px"
      :style="{ height: offsetHeight + 'px' }"
    >
      <div style="margin-top: 20px">
        <span>用户名称：</span>
        <a-input v-model:value="userName" disabled style="width: 300px" />
      </div>
      <div style="margin-top: 28px; padding-left: 14px">
        <span>旧密码：</span>
        <a-input-password
          v-model:value="usedPw"
          placeholder="请输入当前账号密码"
          style="width: 300px"
          password
        />
      </div>
      <div style="margin-top: 28px; padding-left: 14px">
        <span>新密码：</span>
        <a-input-password
          v-model:value="newPw"
          placeholder="请输入新密码"
          style="width: 300px"
          password
        />
      </div>
      <div style="margin-top: 28px">
        <span>确认密码：</span>
        <a-input-password
          v-model:value="verifyPw"
          placeholder="请输入确认密码"
          style="width: 300px"
          password
        />
      </div>
      <div style="margin-top: 28px; padding-left: 14px">
        <span>手机号：</span>
        <a-input
          v-model:value="userPhone"
          disabled
          placeholder="请输入手机号"
          style="width: 300px"
        />
      </div>
      <div style="margin-top: 28px; padding-left: 14px">
        <span>验证码：</span>
        <a-input
          v-model:value="code"
          placeholder="请输入验证码"
          style="width: 160px; margin-right: 20px"
        />
        <a-button type="primary" v-if="showCode" @click="sendCode" style="width: 120px">
          发送验证码
        </a-button>
        <a-button v-else disabled> {{ count }}s后重新获取 </a-button>
        <!-- <span v-else>{{ count }}s后重新获取</span> -->
      </div>
      <div style="margin-top: 38px; padding-left: 70px">
        <a-button type="primary" @click="saveNewPw"> 更新密码 </a-button>
        <a-button style="margin-left: 64px" class="aui-link-login" @click="getBack"> 返回</a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { getSessionValue } from '@/utils/hooks/system/useStorage.js';
  import { message } from 'ant-design-vue';
  import { passwordVerify } from '@/utils/index.js';
  import { sendCodeApi, checkUsersApi, updateDataApi } from '@/api/reset-password/index.js';
  import { useLoginStore } from '@/stores/login';
  import { router } from '@/plugins/router';
  // import { userListApi, amendPwApi } from '@/api/register';

  const offsetHeight = ref(document.body.offsetHeight - 150);
  const userName = getSessionValue('userName');
  const userPhone = getSessionValue('userPhone');
  const userId = getSessionValue('userId');
  const usedPw = ref('');
  const newPw = ref('');
  const verifyPw = ref('');
  const code = ref('');

  onMounted(() => {
    // getUserData(userName);
  });
  // const userData = ref({});
  // const getUserData = async (name) => {
  //   const { data } = await userListApi({ name });
  //   data.list.forEach((item) => {
  //     if (name === item.name) {
  //       userData.value = item;
  //     }
  //   });
  // };
  const { loginOut } = useLoginStore();
  const saveNewPw = async () => {
    // const userPw = getSessionValue('userPassword');
    if (usedPw.value == '') {
      message.warning('旧密码不能为空');
    } else if (newPw.value == '') {
      message.warning('新密码不能为空');
    } else if (verifyPw.value == '') {
      message.warning('确认密码不能为空');
    } else if (getSessionValue('userPassword') != usedPw.value) {
      message.warning('旧密码与当前账号密码不匹配，请检查');
    } else if (!passwordVerify(newPw.value)) {
      message.warning('请输入由大写字母、小写字母、数字和特殊符号中至少三种组合的8位以上的密码!');
    } else if (newPw.value != verifyPw.value) {
      message.warning('新密码与确认密码不匹配，请检查');
    } else if (userPhone == '') {
      message.warning('该账号未绑定手机号，请联系管理员修改密码');
    } else if (code.value == '') {
      message.warning('验证码不能为空');
    } else {
      // userData.value.password = verifyPw.value;
      if (codeCount.value <= 2) {
        message.warning('验证码已过期！');
      } else {
        const { data: hasCode } = await checkUsersApi({ phone: userPhone, code: code.value });
        const { data: res } = await updateDataApi({
          phone: userPhone,
          code: code.value,
          userId: userId,
          password: newPw.value,
        });
        if (hasCode.code === 200) {
          if (res.code === 200) {
            message.success('密码更新成功! 请重新登录');
            setTimeout(() => {
              loginOut();
            }, 1000);
          } else {
            message.error(res.msg);
          }
        }
      }
    }
  };
  const showCode = ref(true);
  const sendCode = async () => {
    if (userPhone == '') {
      message.warning('该账号未绑定手机号，请联系管理员修改密码');
    } else {
      const { data: res } = await sendCodeApi(userPhone);
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
  const getBack = () => {
    router.push('/board');
    // router.push({ path: JSON.parse(getSessionValue('allMenu'))[0].url });
  };
</script>

<style lang="scss" scoped>
  .search_card {
    background: #fff;
    padding: 2px 4px 8px;
    border-bottom: 1px solid #e4e4e4;
  }
  .search_title {
    font-size: 18px;
    font-weight: bold;
    color: #33c8e9;
    border-left: 6px solid #33c8e9;
    padding-left: 8px;
    line-height: 20px;
  }
</style>
