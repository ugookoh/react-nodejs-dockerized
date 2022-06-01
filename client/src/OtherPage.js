import React from 'react';
import { Link } from 'react-router-dom';

const OtherPage = () => {
  return (
    <div>
      I'm in some other page!
      <Link to="/">Go back Home</Link>
    </div>
  )
}

export default OtherPage