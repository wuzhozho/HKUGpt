import React, { useState } from 'react';
import { TextInput, Button, Modal, Notification } from "@mantine/core";
import { createStyles } from "@mantine/core";
import axios from 'axios';
import { showNotification } from '@mantine/notifications';

const useStyles = createStyles((theme) => ({
  loginRegisterButton: {
    backgroundColor: theme.colors.dark[6], // 使用了指定的背景色
    // 其他需要的样式，如边距、字体颜色、圆角等
  },
}));

type Props = { 
  isOpen: boolean; 
  onClose: () => void; 
  onRegister: () => void; 
};


const RegisterPage: React.FC<Props> = ({ isOpen, onClose, onRegister }) => {
  const { classes } = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = event.currentTarget.value;
    setUsername(newUsername);
    setUsernameError(newUsername === '' ? '用户名不能为空。' : null);
  }

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.currentTarget.value;
    setEmail(newEmail);
    if (newEmail === '') {
      setEmailError('邮箱不能为空。');
    } else if (!/^\S+@\S+\.\S+$/.test(newEmail)) {
      setEmailError('请输入有效的邮箱地址。')
    } else {
      setEmailError(null);
    }
  }
  
  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.currentTarget.value;
    setPassword(newPassword);
    if (newPassword === '') {
      setPasswordError('密码不能为空。');
    } else if (newPassword.length < 6) {
      setPasswordError('密码不得少于6位。');
    } else {
      setPasswordError(null);
    }
  }

  const handleChangeConfirmPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = event.currentTarget.value;
    setConfirmPassword(newConfirmPassword);
    setConfirmPasswordError(newConfirmPassword !== password ? '输入的密码不一致。' : null);
  }

  const  handleRegister = async () => {
    setUsernameError(username === '' ? '用户名不能为空。' : null);
    setEmailError(email === '' ? '邮箱不能为空。' : null);
    setPasswordError(password === '' ? '密码不能为空。' : null);
    setConfirmPasswordError(password !== confirmPassword ? '输入的密码不一致。' : null);

    if(username !== '' && password !== '' && email !== '' && password === confirmPassword) {
      const data = {username: `${username}`, password: `${password}`, email: `${email}`}
      console.log(data);
      // 注册用户
      try {
            const response = await axios.post('/api/auth/register', data);
            if (response.status === 201) {
              // console.log("==================")
              // console.log(response)

              showNotification({
                title: 'success',
                message: '注册成功!',
                color: 'teal',
              });

            }
        }catch (error:any) {
          // console.log("==================")
          // console.log(error)
          let errorMsg = '注册失败'; 
          
          showNotification({
            title: 'fail',
            message: errorMsg+": " + error.response.data.error,
            color: 'red', 
          });
        }
      onClose();
      onRegister();
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="注册"
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
          type="email"
          placeholder="邮箱" 
          value={email}
          onChange={handleChangeEmail}
        />
        {emailError && <Notification title={emailError} color="red" />}
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
      <div style={{ marginBottom: '20px' }}>
        <TextInput 
          placeholder="确认密码"
          type="password"
          value={confirmPassword}
          onChange={handleChangeConfirmPassword}
        />
        {confirmPasswordError && <Notification title={confirmPasswordError} color="red" />}
      </div>
      <Button className={classes.loginRegisterButton} onClick={handleRegister} color="violet">注册</Button>
    </Modal>
  );
};

export default RegisterPage;