import { useNavigate } from 'react-router-dom';
import React from 'react';

export const withNavigate = (Component) => {
  const Wrapper = (props) => {
    const navigate = useNavigate();
    
    return (
      <Component
        navigate={navigate}
        {...props}
      />
    );
  };
  
  return Wrapper;
};