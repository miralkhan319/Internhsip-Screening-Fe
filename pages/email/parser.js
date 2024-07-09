import React from 'react';

const Parser = ({ content }) => {
  // Assuming email content is HTML
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
};

export default Parser;