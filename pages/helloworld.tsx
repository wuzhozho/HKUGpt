import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useChatStore } from "../stores/ChatStore";

const HelloWorld = () => {
  const { t, i18n } = useTranslation();

  // 从全局状态获取当前语言
  const globalLan = useChatStore((state) => state.lan);
  const [selectedLanguage, setSelectedLanguage] = useState(globalLan);

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode)
      .then(() => {
        console.log('Language changed to ', languageCode);
        setSelectedLanguage(languageCode); // 更新本地selectedLanguage状态
        useChatStore.setState({ lan: languageCode }); // 使用 setState 来更新全局lan状态
      })
      .catch((err) => console.error('Error occurred while changing language: ', err));
  };

  useEffect(() => {
    if (typeof selectedLanguage === 'string') {
      changeLanguage(selectedLanguage);
    }
  }, [selectedLanguage]);

  return (
    <div>
      <h1>{t('helloWorld')}</h1>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('ja')}>Japanese</button>
      <button onClick={() => changeLanguage('zh-CN')}>Chinese简体</button>
      <button onClick={() => changeLanguage('zh-TW')}>Chinese繁体</button>
      
      {/* 添加的下拉框选择语言功能 */}
      <select value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="ja">Japanese</option>
        <option value="zh-CN">Chinese简体</option>
        <option value="zh-TW">Chinese繁体</option>
      </select>
    </div>
  );

}

export default HelloWorld;



// import React, { useCallback } from 'react';
// import { useTranslation } from 'react-i18next';

// const HelloWorld = () => {
//   const { t, i18n } = useTranslation();

//   const changeLanguage = useCallback((languageCode: string) => {
//     i18n.changeLanguage(languageCode)
//       .then(() => console.log('Language changed to ', languageCode))
//       .catch((err: Error) => console.log('Error occurred while changing language: ', err));
//   }, [i18n]);

//   return (
//     <div>
//       <h1>{t('helloWorld')}</h1>
//       <button onClick={() => changeLanguage('en')}>English</button>
//       <button onClick={() => changeLanguage('ja')}>Japanese</button>
//       <button onClick={() => changeLanguage('zh-CN')}>Chinese简体</button>
//       <button onClick={() => changeLanguage('zh-TW')}>Chinese繁体</button>
//     </div>
//   );
// };

// export default HelloWorld;