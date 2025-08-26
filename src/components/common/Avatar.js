import React from 'react';
const Avatar = ({ src, alt, ...props }) => <img className="avatar" src={src} alt={alt} {...props} />;
export default Avatar;
