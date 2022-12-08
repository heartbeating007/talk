//针对账号的验证规则
const loginIdValidator = new FieldValidator('txtLoginId', async function (val) {
  if (!val) {
    return '请填写账号';
  }
  // 调用账号验证方法，账号是不是已经存在
  const resp = await API.exists(val);
  if (resp.data) {
    // 账号已存在
    return '该账号已被占用，请重新选择一个账号名';
  }
});

//针对昵称的验证规则
const nicknameValidator = new FieldValidator('txtNickname', function (val) {
  if (!val) {
    return '请填写昵称';
  }
});

//针对密码的验证规则
const loginPwdValidator = new FieldValidator('txtLoginPwd', function (val) {
  if (!val) {
    return '请填写密码';
  }
});
// 针对再次输入密码的验证规则
const loginPwdConfirmValidator = new FieldValidator(
  'txtLoginPwdConfirm',
  function (val) {
    if (!val) {
      return '请填写确认密码';
    }
    if (val !== loginPwdValidator.input.value) {
      return '两次密码不一致';
    }
  }
);
// 针对整个表单的验证规则
const form = $('.user-form');

form.onsubmit = async function (e) {
  // 阻止表单默认行为
  e.preventDefault();
  // 验证每一项，是否都验证成功
  const result = await FieldValidator.validate(
    loginIdValidator,
    nicknameValidator,
    loginPwdValidator,
    loginPwdConfirmValidator
  );
  if (!result) {
    return; // 验证未通过
  }
  // 验证成功开始注册

  const formData = new FormData(form); // 传入表单dom，得到一个表单数据对象

  const data = Object.fromEntries(formData.entries());

  const resp = await API.reg(data);

  if (resp.code === 0) {
    alert('注册成功，点击确定，跳转到登录页');
    location.href = './login.html';
  }
};
