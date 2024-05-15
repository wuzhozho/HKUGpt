import React, { useState } from 'react';
import { TextInput, Button, Modal, Notification } from "@mantine/core";
import { createStyles } from "@mantine/core";
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { useChatStore } from "../stores/ChatStore";
// 修改密码
const useStyles = createStyles((theme) => ({
  loginRegisterButton: {
    backgroundColor: theme.colors.dark[6], // 使用了指定的背景色
  },
  // 可能还有其他样式定义...
}));

type Props = { 
  isOpen: boolean; 
  onClose: () => void; 
  onRegister: () => void; 
};

const RegisterPage2: React.FC<Props> = ({ isOpen, onClose, onRegister }) => {
  const { classes } = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState<string | null>(null);
  const {jwt} = useChatStore(state => ({jwt: state.jwt}));
  
  // const handleChangeUsername = (event) => {
  //   const newUsername = event.currentTarget.value;
  //   setUsername(newUsername);
  //   setUsernameError(newUsername === '' ? '用户名不能为空。' : null);
  // }

  // const handleChangeEmail = (event) => {
  //   const newEmail = event.currentTarget.value;
  //   setEmail(newEmail);
  //   setEmailError(newEmail === '' ? '邮箱不能为空。' : null);
  // }
  
  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.currentTarget.value;
    setPassword(newPassword);
    if (newPassword === '') {
      setPasswordError('密码不能为空。');
    } else if (newPassword.length < 6) {
      setPasswordError('密码不能为空。' );
    } else {
      setPasswordError(null);
    }
  }

  const handleChangeConfirmPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = event.currentTarget.value;
    setConfirmPassword(newConfirmPassword);
    setConfirmPasswordError(newConfirmPassword !== password ? '输入的密码不一致。' : null);
  }

  const handleChangeCurrentPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCurrentPassword = event.currentTarget.value;
    setCurrentPassword(newCurrentPassword);
    if (newCurrentPassword === '') {
      setCurrentPasswordError('当前密码不能为空。');
    } else if (newCurrentPassword.length < 6) {
      setCurrentPasswordError('当前密码不得少于6位。');
    } else {
      setCurrentPasswordError(null);
    }
  }

  const handleRegister = async () => {
    // setUsernameError(username === '' ? '用户名不能为空。' : null);
    // setEmailError(email === '' ? '邮箱不能为空。' : null);
    setCurrentPasswordError(currentPassword === '' ? '当前密码不能为空。' : null);
    setPasswordError(password === '' ? '新密码不能为空。' : null);
    setConfirmPasswordError(password !== confirmPassword ? '输入的新密码不一致。' : null);

    if(currentPassword !== '' && password !== '' && confirmPassword !== '' && password === confirmPassword) {
      const data = {
        currentPassword: `${currentPassword}`,
        password: `${password}`,
        passwordConfirmation: `${confirmPassword}`
      }
      console.log(data);
      // 修改密码
      try {
        const response = await axios.post('/api/auth/changepwd', data, {
                headers: {
                  Authorization: 'Bearer ' + jwt,
                },
              });
        if (response.status === 201) {
          // console.log("==================")
          console.log(response)

          showNotification({
            title: '成功',
            message: '密码修改成功!',
            color: 'teal',
          });

        }
      }catch (error:any) {
        // console.log("==================")
        // console.log(error)
        let errorMsg = '密码修改失败'; 
        
        showNotification({
          title: '出错了',
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
      title="修改密码"
      size="lg"
    >
      {/* <div style={{ marginBottom: '20px' }}>
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
      </div> */}
      <div style={{ marginBottom: '20px' }}>
        <TextInput
          placeholder="当前密码"
          type="password"
          value={currentPassword}
          onChange={handleChangeCurrentPassword}
        />
        {currentPasswordError && <Notification title={currentPasswordError} color="red" />}
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
      <Button className={classes.loginRegisterButton} onClick={handleRegister} color="violet">修改密码</Button>
    </Modal>
  );
};

export default RegisterPage2;