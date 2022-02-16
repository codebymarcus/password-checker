import React from 'react';
import PropTypes from 'prop-types';

const STRENGTH_CLASS_NAME = {
  1: 'very-weak',
  2: 'weak',
  3: 'medium',
  4: 'strong',
  5: 'very-strong',
};

const MeterBar = ({ type, strength }) => {
  if (type === 'filled') {
    return [...Array(strength)].map((i, key) => (
      <div key={key} className={`filled ${STRENGTH_CLASS_NAME[strength]}`}></div>
    ));
  }

  if (type === 'not-filled') {
    return [...Array(strength)].map((i, key) => <div className="not-filled" key={key}></div>);
  }

  return null;
};

const PasswordInput = ({ onChange, value, isLoading, strength }) => {
  const [isPasswordHidden, setIsPasswordHidden] = React.useState(true);
  return (
    <div className="password-box mx-auto space-y-2">
      <div className="flex flex-row border-2 border-gray-700 rounded overflow-hidden">
        <input
          onChange={onChange}
          type={isPasswordHidden ? 'password' : 'text'}
          placeholder="type a password"
          className="text-center outline-none p-2 w-full"
          name=""
          id=""
        />
        <button
          className="p-2 focus:outline-none font-semibold text-sm"
          onClick={() => setIsPasswordHidden((state) => !state)}
        >
          {isPasswordHidden ? 'UNHIDE' : 'HIDE'}
        </button>
      </div>
      <div className="grid grid-cols-5 gap-1">
        <MeterBar type="filled" strength={value && !isLoading ? strength + 1 : 0} />
        <MeterBar type="not-filled" strength={value && !isLoading ? 5 - strength - 1 : 5} />
      </div>
    </div>
  );
};

PasswordInput.propTypes = {};

export default PasswordInput;
