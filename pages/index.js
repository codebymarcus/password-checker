import React from 'react';
import debounce from 'lodash.debounce';
import PasswordInput from '@components/PasswordInput';

const STRENGTH_LABEL = {
  1: 'too weak',
  2: 'weak',
  3: 'okay',
  4: 'strong',
  5: 'very strong',
};

const PASSWORD_STRENGTH_API = 'https://o9etf82346.execute-api.us-east-1.amazonaws.com/staging/password/strength';

export default function App() {
  const [passwordStrengthNum, setPasswordStrengthNum] = React.useState(0);
  const [isFetching, setIsFetching] = React.useState(false);
  const [strengthMeterResult, setStrengthMeterResult] = React.useState(null);
  const [password, setPassword] = React.useState(null);

  const checkPasswordStrength = async (val) => {
    try {
      const result = await fetch(PASSWORD_STRENGTH_API, {
        method: 'POST',
        body: JSON.stringify({ password: val }),
      });

      const data = await result.json();
      setPasswordStrengthNum(data.score || 0);
      setStrengthMeterResult(data.error ? null : data);
      setIsFetching(false);
    } catch (error) {
      setStrengthMeterResult(null);
      setIsFetching(false);
      throw new Error(error);
    }
  };

  const _onSetPassword = debounce((val) => {
    setPassword(val);
    setIsFetching(true);
    checkPasswordStrength(val);
  }, 500);

  const _onPasswordChange = React.useCallback(
    (e) => {
      if (e && e.preventDefault) e.preventDefault();
      _onSetPassword(e.currentTarget.value);
    },
    [_onSetPassword]
  );

  return (
    <div className="App grid items-center justify-center h-screen w-screen">
      <div className="password-checker--container text-center space-y-8">
        <h1 className="text-2xl font-bold">Is your password strong enough?</h1>
        <div className="password-container grid">
          <PasswordInput
            onChange={_onPasswordChange}
            value={password}
            isLoading={isFetching}
            strength={passwordStrengthNum}
          />
        </div>
        {strengthMeterResult && !isFetching && (
          <div className="space-y-5">
            <p className="text-xl font-bold">Your password is {STRENGTH_LABEL[strengthMeterResult.score + 1]}!</p>
            <p>
              It will take {strengthMeterResult.guessTimeString} to guess your password. {strengthMeterResult.warning}
            </p>
            {strengthMeterResult.suggestions &&
              strengthMeterResult.suggestions.length > 0 &&
              strengthMeterResult.suggestions.map((text, i) => (
                <p key={i} className="font-semibold">
                  {text}
                </p>
              ))}
          </div>
        )}
        {isFetching && !strengthMeterResult && (
          <img src="/assets/images/svgs/loading.png" className="animate-spin w-10 mx-auto" alt="" />
        )}
      </div>
    </div>
  );
}
