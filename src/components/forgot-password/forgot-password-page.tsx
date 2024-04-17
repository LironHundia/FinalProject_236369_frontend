import React, { useState } from 'react';
import './forgot-password-page.css';
import { AuthApi } from '../../api/authApi';
import { APIStatus, PageProps } from '../../types';
import { Loader } from '../loader/loader';
import { ErrorMessage } from '../error/error';

export const ForgotPasswordPage: React.FC<PageProps> = ({
  navigateToSignUpPage,
  navigateToLoginPage
}) => {
  const [username, setUsername] = useState<string>('');
  const [securityQuestion, setSecurityQuestion] = useState<string>('');
  const [securityAnswer, setSecurityAnswer] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSecurityAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecurityAnswer(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const getSecurityQuestion = async () => {
    if (username.length === 0) {
      setErrorMessage(SecurityQuestionErrorMessages.required);
      return;
    }
    if(username === 'admin') {
      setErrorMessage('Cannot change password for admin user. Please use another user.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await AuthApi.getSecurityQuestion(username);
      setSecurityQuestion(res);
      setErrorMessage('');

    } catch (e) {
      if (e as APIStatus === APIStatus.Unauthorized) {
        setErrorMessage(SecurityQuestionErrorMessages.invalid);
        return;
      }

      if (e as APIStatus === APIStatus.ServerError) {
        setErrorMessage(SecurityQuestionErrorMessages.failed);
        return;
      }
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleNewPassword = async () => {
    if (password.length === 0 || securityAnswer.length === 0 || username.length === 0) {
      setErrorMessage(ChangePasswordErrorMessages.required);
      return;
    }
    setIsLoading(true);
    const res = await AuthApi.changePassword({username, securityAnswer, password});
    setIsLoading(false);

    if (res === APIStatus.Success) {
      navigateToLoginPage();
      return;
    }
    if (res === APIStatus.Unauthorized) {
      setErrorMessage(ChangePasswordErrorMessages.invalid);
      return;
    }

    if (res === APIStatus.ServerError) {
      setErrorMessage(ChangePasswordErrorMessages.failed);
      return;
    }
  };

  const handleSignUp = () => {
    navigateToSignUpPage()
  };

  const handleLogin = () => {
    navigateToLoginPage()
  };

  return (
    <div className="login-container">
      <h2>Change Password</h2>
      <form>
        <div className="input-group">
          <label htmlFor="username">Username:</label>
          <input
            className='input-field'
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        {securityQuestion &&
          <div>
            <p className="security-question-header">Security question:</p>
            <p className="security-question">{securityQuestion}</p>
            <div className="input-group">
              <label htmlFor="securityAnswer">Security answer:</label>
              <input
                className='input-field'
                type="text"
                id="securityAnswer"
                name="securityAnswer"
                value={securityAnswer}
                onChange={handleSecurityAnswerChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password:</label>
              <input
                className='input-field'
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
          </div>
        }
        {errorMessage && <ErrorMessage message={errorMessage} />}
        {!securityQuestion && <button type="button" className="login-btn" onClick={getSecurityQuestion}>Continue</button>}
        {securityQuestion && <div>
          {isLoading ? <Loader /> : <button type="button" className="login-btn" onClick={handleNewPassword}>Change Password</button>}
        </div>
        }
      </form>
      <p className="forgot-password-link">Remembered password? <button type="button" onClick={handleLogin}>Login</button></p>
      <p className="signup-link">Don't have an account? <button type="button" onClick={handleSignUp}>Sign Up</button></p>
    </div>
  );
};

const SecurityQuestionErrorMessages = {
  required: 'Username is required',
  invalid: 'Username not found',
  failed: 'getting security question failed, please try again'
};

const ChangePasswordErrorMessages = {
  required: 'All fields are required',
  invalid: 'Wrong security answer, please try again',
  failed: 'Changing password failed, please try again'
};