import {
  createStyles,
  Header,
  Group,
  ActionIcon,
  Container,
  Burger,
  rem,
  Text,
  MediaQuery,
  Divider,
  px,
  Button,
  Modal
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconBrandGithub, IconPlus } from "@tabler/icons-react";
import { useChatStore } from "@/stores/ChatStore";
import { getModelInfo, modelInfos } from "@/stores/Model";
import { useRouter } from "next/router";
import { addChat, setNavOpened } from "@/stores/ChatActions";
import { useState } from "react";
import LoginPage from "@/components/LoginModal";
import RegisterPage from "@/components/RegisterModal";
import RegisterPage2 from "@/components/Register2Modal";
import React, { useEffect } from 'react';

const useStyles = createStyles((theme) => ({
  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: rem(36),

    [theme.fn.smallerThan("sm")]: {
      justifyContent: "flex-start",
    },
  },

  links: {
    width: rem(260),

    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  social: {
    width: rem(260),

    [theme.fn.smallerThan("sm")]: {
      width: "auto",
      marginLeft: "auto",
    },
  },

  burger: {
    marginRight: theme.spacing.md,

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
}));

export default function MuHeader({ children }: any) {
  const { classes, theme } = useStyles();
  const chats = useChatStore((state) => state.chats);
  const router = useRouter();
  const activeChatId = router.query.chatId as string | undefined;

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  const activeModel = useChatStore((state) => state.settingsForm.model);

  const navOpened = useChatStore((state) => state.navOpened);

  const isSmall = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const isKnownModel = modelInfos[activeModel] !== undefined;
  const modelInfo = getModelInfo(activeModel);
  // 从全局状态读取user数据并解构出username
  const { username } = useChatStore(state => state.user || {}) as { username: string };
  useEffect(() => {
    // 从全局状态读取登录信息
    const userState = useChatStore.getState().user;
    if (userState) {
      setIsLoggedIn(true);
      setLoginOpen(false); // 根据你的逻辑，当用户已登录时不显示登录窗口
    }
  }, []);
  // 登陆，注册相关
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [register2Open, setRegister2Open] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (user:object) => {
    setLoginOpen(false);
    setIsLoggedIn(true);   // 登录成功
    // console.log("父组件user",user)
    console.log("Logged in:",user);
  };

  const handleRegister = () => {
    setRegisterOpen(false);
    console.log("Registered");
  };

  const handleRegister2 = () => {
    setRegister2Open(false);
    console.log("Registered2");
  };

  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const handleLogout = () => {
    useChatStore.setState({ jwt: undefined, user: undefined, apiKey: "", colorScheme :"light"});
    setIsLoggedIn(false);
    setConfirmLogoutOpen(false); // 关闭确认对话框
  };

  return (
    <Header height={36} mb={120} sx={{ zIndex: 1002 }}>
      <Container className={classes.inner}>
        <MediaQuery largerThan="sm" styles={{ display: "none", width: 0 }}>
          <Burger
            opened={navOpened}
            onClick={() => setNavOpened(!navOpened)}
            size="sm"
            color={theme.colors.gray[6]}
          />
        </MediaQuery>
        <MediaQuery
          largerThan="sm"
          styles={{ width: "100%", justifyContent: "center" }}
        >
          <Group spacing={5} className={classes.social} noWrap c="dimmed">
            {activeChat?.chosenCharacter ? (
              <>
                <MediaQuery smallerThan="md" styles={{ display: "none" }}>
                  <Text size="sm">{activeChat?.chosenCharacter}</Text>
                </MediaQuery>
                <MediaQuery smallerThan="md" styles={{ display: "none" }}>
                  <Divider size="xs" orientation="vertical" />
                </MediaQuery>
              </>
            ) : null}
            港大-商学院-LLM-Chatbot实验平台
            <Text size="sm">{modelInfo.displayName}</Text>
            {isKnownModel && (
              <> 
                <Divider size="xs" orientation="vertical" />
                <Text size="sm">
                  ${(activeChat?.costIncurred || 0).toFixed(2)}
                </Text>
              </>
            )}
          </Group>
        </MediaQuery>

        <Group spacing={0} className={classes.social} position="right" noWrap>
          <MediaQuery largerThan="sm" styles={{ display: "none", width: 0 }}>
            <ActionIcon
              onClick={() => {
                addChat(router);
                if (isSmall) {
                  setNavOpened(false);
                }
              }}
              size="lg"
            >
              <IconPlus
                size={px("1.5rem")}
                stroke={1.5}
                color={theme.colors.gray[6]}
              />
            </ActionIcon>
          </MediaQuery>
          
          <Group spacing={0} className={classes.social} position="right" noWrap>
            {isLoggedIn ? (
              <> <div>{username || "用户"}</div> 
                <a style={{ marginRight: "10px",cursor: 'pointer' ,paddingLeft: '12px',paddingRight: '12px'  }} 
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F3F4F5'} 
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'} 
                onClick={() => setRegister2Open(true)}>修改密码</a> |
                <a style={{ margin: "0 10px",cursor: 'pointer',paddingLeft: '12px',paddingRight: '12px' }} 
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F3F4F5'} 
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'} 
                onClick={() => setConfirmLogoutOpen(true)}>退出</a>
              </>
            ) : (
              <>
                <a style={{ marginRight: "10px",cursor: 'pointer' ,paddingLeft: '12px',paddingRight: '12px'  }} 
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F3F4F5'} 
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'} 
                onClick={() => setLoginOpen(true)}>登录</a> |
                <a style={{ marginLeft: "10px",cursor: 'pointer' ,paddingLeft: '12px',paddingRight: '12px'  }} 
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F3F4F5'} 
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'} 
                onClick={() => setRegisterOpen(true)}>注册</a>
              </>
            )}
          </Group>
        </Group>
      </Container>

      <LoginPage 
        isOpen={loginOpen} 
        onClose={() => setLoginOpen(false)}
        onLogin={handleLogin} 
      />

      <RegisterPage 
        isOpen={registerOpen} 
        onClose={() => setRegisterOpen(false)}
        onRegister={handleRegister} 
      />

      <RegisterPage2
        isOpen={register2Open} 
        onClose={() => setRegister2Open(false)}
        onRegister={handleRegister2} 
      />

      <Modal
        title="确认退出？"
        opened={confirmLogoutOpen}
        onClose={() => setConfirmLogoutOpen(false)}
      >
        <p>你确定要退出登录吗？</p>
        <Group position="right" spacing="md">
          <Button variant="default" onClick={() => setConfirmLogoutOpen(false)}>
            取消
          </Button>
          <Button color="red" onClick={handleLogout}>
            确认退出
          </Button>
        </Group>
      </Modal>

    </Header>
  );
}