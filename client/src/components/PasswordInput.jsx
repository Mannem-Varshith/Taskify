import { useState, useEffect } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';

const PasswordInput = ({ 
  value, 
  onChange, 
  placeholder = "Enter password",
  showStrengthMeter = true,
  showRequirements = true,
  label = "Password",
  name = "password"
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [requirements, setRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
  });
  const [strength, setStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState('');

  useEffect(() => {
    if (!value) {
      setRequirements({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecial: false,
      });
      setStrength(0);
      setStrengthLabel('');
      return;
    }

    // Check requirements
    const newRequirements = {
      minLength: value.length >= 8,
      hasUppercase: /[A-Z]/.test(value),
      hasLowercase: /[a-z]/.test(value),
      hasNumber: /\d/.test(value),
      hasSpecial: /[@$!%*?&]/.test(value),
    };

    setRequirements(newRequirements);

    // Calculate strength
    const metRequirements = Object.values(newRequirements).filter(Boolean).length;
    const strengthValue = (metRequirements / 5) * 100;
    setStrength(strengthValue);

    // Set strength label and color
    if (strengthValue === 0) {
      setStrengthLabel('');
    } else if (strengthValue <= 40) {
      setStrengthLabel('Weak');
    } else if (strengthValue <= 60) {
      setStrengthLabel('Medium');
    } else if (strengthValue <= 80) {
      setStrengthLabel('Strong');
    } else {
      setStrengthLabel('Very Strong');
    }
  }, [value]);

  const getStrengthColor = () => {
    if (strength <= 40) return 'bg-red-500';
    if (strength <= 60) return 'bg-orange-500';
    if (strength <= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthTextColor = () => {
    if (strength <= 40) return 'text-red-600 dark:text-red-400';
    if (strength <= 60) return 'text-orange-600 dark:text-orange-400';
    if (strength <= 80) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      
      {/* Password Input */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 transition-colors"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Strength Meter */}
      {showStrengthMeter && value && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">Password Strength</span>
            <span className={`font-semibold ${getStrengthTextColor()}`}>
              {strengthLabel}
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getStrengthColor()}`}
              style={{ width: `${strength}%` }}
            />
          </div>
        </div>
      )}

      {/* Requirements Checklist */}
      {showRequirements && value && (
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 space-y-1.5">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password must contain:
          </p>
          <RequirementItem 
            met={requirements.minLength} 
            text="At least 8 characters" 
          />
          <RequirementItem 
            met={requirements.hasUppercase} 
            text="One uppercase letter (A-Z)" 
          />
          <RequirementItem 
            met={requirements.hasLowercase} 
            text="One lowercase letter (a-z)" 
          />
          <RequirementItem 
            met={requirements.hasNumber} 
            text="One number (0-9)" 
          />
          <RequirementItem 
            met={requirements.hasSpecial} 
            text="One special character (@$!%*?&)" 
          />
        </div>
      )}
    </div>
  );
};

const RequirementItem = ({ met, text }) => (
  <div className="flex items-center gap-2 text-xs">
    {met ? (
      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
    ) : (
      <X className="w-4 h-4 text-red-500 flex-shrink-0" />
    )}
    <span className={met ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}>
      {text}
    </span>
  </div>
);

export default PasswordInput;
