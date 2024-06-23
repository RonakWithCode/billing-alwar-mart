import React from 'react';

const ToggleSwitch = ({ isChecked, setIsChecked, labelOn, labelOff }) => {
  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id="hs-valid-toggle-switch"
        className={`relative shrink-0 w-[3.25rem] h-7 p-px bg-gray-100 border-transparent text-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:ring-green-600 disabled:opacity-50 disabled:pointer-events-none ${isChecked ? 'bg-green-600' : ''} dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-green-500 dark:checked:border-green-500 dark:focus:ring-offset-gray-600 before:inline-block before:size-6 before:bg-white checked:before:bg-green-200 before:translate-x-0 checked:before:translate-x-full before:rounded-full before:shadow before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-neutral-400 dark:checked:before:bg-green-200`}
        checked={isChecked}
        onChange={handleToggle}
      />
      <label htmlFor="hs-valid-toggle-switch" className="text-sm text-gray-500 ml-3 dark:text-neutral-400">
        {isChecked ? labelOn : labelOff}
      </label>
    </div>
  );
};

export default ToggleSwitch;
