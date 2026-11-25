import React from 'react';
const NextImage = ({ src, alt, ...rest }: { src: string; alt: string; [key: string]: unknown }) => (
  <img src={src} alt={alt} />
);
export default NextImage;
