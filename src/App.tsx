import { MainPage } from './components/main/main-page';
import { LoginPage } from './components/login/login-page';
import { SignUpPage } from './components/signup/signup-page';
import { PageProps } from './types';
import  { useState } from 'react';


export const App = () => {
  // TODO: implement those functions, think about how to use state to navigate between pages

  const [currentPage, setCurrentPage] = useState('main');

  const pageProps: PageProps = {
    navigateToMainPage: () => setCurrentPage('main'),
    navigateToSignUpPage: () => setCurrentPage('signup'),
    navigateToLoginPage: () => setCurrentPage('login'),
    navigateToRouteUser: () => setCurrentPage('user'),
    navigateToRouteBackoffice: () => setCurrentPage('backoffice'),
  }

  // TODO: render the correct page according to the state
  if(currentPage === 'login') {
    return (
      <LoginPage {...pageProps}/>
    )
  }
  if(currentPage === 'signup') {
    return (
      <SignUpPage {...pageProps}/>
    )
  }
  return (
    <MainPage {...pageProps}/>
  )
};