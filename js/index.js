(async function () {
  // 获取登录信息
  const resp = await API.profile();
  const user = resp.data;
  // 如果没有登录信息，就提醒重新登录
  if (!user) {
    alert('未登录或登录已过期，请重新登录');
    location.href = '../login.html';
    return;
  }

  // 如果有登录信息，根据登录信息渲染页面

  const doms = {
    aside: {
      nickName: $('#nickname'),
      loginId: $('#loginId')
    },
    close: $('.close'),
    chatContainer: $('.chat-container'),
    txtMsg: $('#txtMsg'),
    msgContainer: $('.msg-container')
  };

  setUserInfo();
  function setUserInfo() {
    doms.aside.nickName.innerText = user.nickname;
    doms.aside.loginId.innerText = user.loginId;
  }

  // 注销账户信息，退出登录
  doms.close.onclick = function () {
    API.loginOut();
    location.href = './login.html';
  };
  // 传入一条消息，把消息加载到页面
  function addChat(chatInfo) {
    const div = $$$('div');
    div.classList.add('chat-item');
    if (chatInfo.from) {
      div.classList.add('me');
    }
    const img = $$$('img');
    img.className = 'chat-avatar';
    img.src = chatInfo.from ? './asset/avatar.png' : './asset/robot-avatar.jpg';

    const content = $$$('div');
    content.className = 'chat-content';
    content.innerText = chatInfo.content;

    const date = $$$('div');
    date.className = 'chat-date';
    date.innerText = formatDate(chatInfo.createdAt);

    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(date);

    doms.chatContainer.appendChild(div);
  }
  // 加载消息历史记录
  await loadHistory();
  async function loadHistory() {
    const resp = await API.getHistory();
    for (const item of resp.data) {
      addChat(item);
    }
    scrollBottom();
  }

  // 格式化时间，传入一个时间戳，转化为2022-12-05 19:42:27
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  // 让聊天区域的滚动条滚动到底
  function scrollBottom() {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  }
  // 发送消息事件
  doms.msgContainer.onsubmit = function (e) {
    e.preventDefault();
    sendChat();
  };
  async function sendChat() {
    const content = doms.txtMsg.value.trim();
    if (!content) {
      return;
    }
    addChat({
      from: user.loginId,
      to: null,
      createdAt: Date.now(),
      content
    });
    doms.txtMsg.value = '';
    scrollBottom();
    const resp = await API.sendChat(content);
    addChat({
      from: null,
      to: user.loginId,
      ...resp.data
    });
    scrollBottom();
  }
})();
