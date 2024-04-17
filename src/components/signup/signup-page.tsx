import React, { useState } from 'react';
import './signup-page.css';
import { AuthApi } from '../../api/authApi';
import { APIStatus, PageProps, securityQuestions } from '../../types';
import { Loader } from '../loader/loader';
import { ErrorMessage } from '../error/error';

export const SignUpPage: React.FC<PageProps> = ({
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSecurityQuestionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSecurityQuestion(e.target.value);
  };

  const handleSecurityAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecurityAnswer(e.target.value);
  };

  const handleSignUp = async () => {
    if (password.length === 0 || username.length === 0 || securityQuestion.length === 0 || securityAnswer.length === 0) {
      setErrorMessage(SignUpErrorMessages.required);
      return;
    }
    setIsLoading(true);
    const res = await AuthApi.signUp({ username, password, securityQuestion, securityAnswer});
    setIsLoading(false);

    if (res === APIStatus.Success) {
      navigateToLoginPage();
      return;
    }
    if (res === APIStatus.BadRequest) {
      setErrorMessage(SignUpErrorMessages.exists);
      return;
    }
    if (res === APIStatus.ServerError) {
      setErrorMessage(SignUpErrorMessages.failed);
      return;
    }
  };

  const handleLogin = () => {
    navigateToLoginPage();
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
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
        <div className="input-group">
          <label htmlFor="securityQuestion">Security Question:</label>
          <select
            style = {{width: '101%'}}
            className='input-field'
            id="securityQuestion"
            name="securityQuestion"
            value={securityQuestion}
            onChange={handleSecurityQuestionChange}
          >
            <option value="">Select a security question</option>
            {securityQuestions.map((question, index) => (
              <option key={index} value={question}>
                {question}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="securityAnswer">Security Answer:</label>
          <input
            className='input-field'
            type="text"
            id="securityAnswer"
            name="securityAnswer"
            value={securityAnswer}
            onChange={handleSecurityAnswerChange}
          />
        </div>
        {errorMessage && <ErrorMessage message={errorMessage} />}
        {isLoading ? <Loader /> : <button type="button" className="signup-btn" onClick={handleSignUp}>Sign Up</button>}
      </form>
      <p className="login-link">Already have an account? <button type="button" onClick={handleLogin}>Login</button></p>
    </div>
  );
};

const SignUpErrorMessages = {
  required: 'All fields are required',
  exists: 'Username already exists',
  failed: 'Sign Up failed, please try again'
};
