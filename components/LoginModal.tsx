import React, { useState } from 'react';
import { TextInput, Button, Modal, Notification } from "@mantine/core";
import { createStyles } from "@mantine/core";
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { useChatStore } from "../stores/ChatStore";
import { update } from "@/stores/ChatActions";

const useStyles = createStyles((theme) => ({
  loginRegisterButton: {
    backgroundColor: theme.colors.dark[6], // 使用了指定的背景色
    // 其他需要的样式，如边距、字体颜色、圆角等
  },
}));

type Props = { 
  isOpen: boolean; 
  onClose: () => void; 
  onLogin: (user:object) => void; 
};

const LoginPage: React.FC<Props> = ({ isOpen, onClose, onLogin }) => {
  
  const { classes } = useStyles();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [usernameError, setUsernameError] = useState<string | null>(null);

  const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = event.currentTarget.value;
    setUsername(newUsername);
    setUsernameError(newUsername === '' ? '用户名不能为空。' : null);
  };
  
  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.currentTarget.value;
    setPassword(newPassword);
    setPasswordError(newPassword === '' ? '密码不能为空。' : null);
  }


  const handleLogin = async () => {
    setUsernameError(username === '' ? '用户名不能为空。' : null);
    setPasswordError(password === '' ? '密码不能为空。' : null);

    if(username !== '' && password !== '') {
      const data = {identifier: `${username}`, password: `${password}`}
      console.log(data);
      // 登录
      try {
        const response = await axios.post('/api/auth/login', data);
        if (response.status === 201) {
          // console.log("==================")
          // console.log(response)
          const jwt = response.data.jwt
          const user = response.data.user
          // console.log("==============")
          // console.log("==============jwt,",jwt)
          // console.log("==============user,",user)
          // 存储到全局状态
          useChatStore.setState({ jwt: jwt, user: user });
          showNotification({
            title: '成功',
            message: '登录成功!',
            color: 'teal',
          });
          // 取配置信息
          await fetchConfig(jwt)
          onClose();
          onLogin(user);
        }
      }catch (error:any) {
        // console.log("==================")
        // console.log(error)
        let errorMsg = '登录失败'; 

        showNotification({
          title: '出错了',
          message: errorMsg+": " + error.response.data.error,
          color: 'red', 
        });
      }
      
    }
  };

  // 定义获取配置信息的函数
const fetchConfig = async (jwt:string) => {
  try {
    const response = await axios.get('/api/config', {
      headers: {
        Authorization: 'Bearer ' + jwt,
      },
    });
    if (response.status === 201) { 
      const config = response.data.data
      console.log("----------------config11:", config)
      console.log("===-=-=-=-=-newsetting0000",config.attributes.model)

      update({
        apiKey: config.attributes.OPENAI_KEY,
        // colorScheme: config.attributes.theme,
        // settingsForm: {
        //   ...config.attributes.settingsForm, // 拷贝之前的设置
        //   model: config.attributes.model // 设置新的模型值
        // }
      });
    }
  } catch (error) {
    console.log("================== get config error", error)
  }
}


  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="登录"
      size="lg"
    >
      <div style={{ marginBottom: '20px' }}>
        <TextInput 
          placeholder="用户名" 
          value={username}
          onChange={handleChangeUsername}
        />
        {usernameError && <Notification title={usernameError} color="red" />}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <TextInput 
          placeholder="密码"
          type="password"
          value={password}
          onChange={handleChangePassword}
        />
        {passwordError && <Notification title={passwordError} color="red" />}
      </div>
      <Button  className={classes.loginRegisterButton} onClick={handleLogin} color="violet">登录</Button>
    </Modal>
  );
};

export default LoginPage;