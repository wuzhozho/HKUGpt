import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const HelloWorld = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = useCallback((languageCode: string) => {
    i18n.changeLanguage(languageCode)
      .then(() => console.log('Language changed to ', languageCode))
      .catch((err: Error) => console.log('Error occurred while changing language: ', err));
  }, [i18n]);

  return (
    <div>
      <h1>{t('helloWorld')}</h1>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('ja')}>Japanese</button>
      <button onClick={() => changeLanguage('zh-CN')}>Chinese简体</button>
      <button onClick={() => changeLanguage('zh-TW')}>Chinese繁体</button>
    </div>
  );
};

export default HelloWorld;