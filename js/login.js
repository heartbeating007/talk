//针对账号登录的验证
const loginIdValidator = new FieldValidator('txtLoginId', async function (val) {
  if (!val) {
    return '请填写账号';
  }
});

//针对密码的验证规则
const loginPwdValidator = new FieldValidator('txtLoginPwd', function (val) {
  if (!val) {
    return '请填写密码';
  }
});

// 针对整个表单的验证规则
const form = $('.user-form');

form.onsubmit = async function (e) {
  // 阻止表单默认行为
  e.preventDefault();
  // 验证每一项，是否都验证成功
  const result = await FieldValidator.validate(
    loginIdValidator,

    loginPwdValidator
  );
  if (!result) {
    return; // 验证未通过
  }
  // 验证成功开始注册

  const formData = new FormData(form); // 传入表单dom，得到一个表单数据对象

  const data = Object.fromEntries(formData.entries());

  const resp = await API.login(data);

  if (resp.code === 0) {
    alert('登录成功，点击确定，跳转到首页');
    location.href = baseUrl + 'index.html';
  } else {
    loginIdValidator.p.innerText = '账号或密码错误';
    loginPwdValidator.input.value = '';
  }
};
