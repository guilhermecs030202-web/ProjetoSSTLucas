import React from 'react';

const Input = ({ label, id, ...props }) => {
  return (
    <div className="input-group" style={{ marginBottom: '1rem' }}>
      {label && <label htmlFor={id} className="input-label">{label}</label>}
      <input 
        id={id}
        className="input-field" 
        {...props} 
      />
    </div>
  );
};

export default Input;
