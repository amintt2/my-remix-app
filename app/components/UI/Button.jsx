import PropTypes from 'prop-types';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  ...props 
}) {
  // Variant styles
  const variantStyles = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
    outline: 'bg-transparent border border-indigo-600 text-indigo-600 hover:bg-indigo-600/10',
    ghost: 'bg-transparent text-indigo-600 hover:bg-indigo-600/10'
  };

  // Size styles
  const sizeStyles = {
    sm: 'text-xs px-3 py-1',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3'
  };
  
  // Base styles
  const baseStyles = 'rounded-md transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900';
  
  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string
}; 