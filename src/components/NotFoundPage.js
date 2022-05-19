import React from 'react';
import { Link } from 'react-router-dom';
// import PageNotFound from '../assets/images/PageNotFound';
const NotFoundPage = () => {
  return (
    <div>
      <div id='notfound'>
        <div class='notfound'>
          <div class='notfound-404'>
            <h1>
              4<span>0</span>4
            </h1>
          </div>
          <p>
            The page you are looking for might not exist, have been removed, had
            its name changed or is temporarily unavailable.
          </p>
          <Link to='/'>Go to Home Page </Link>
        </div>
      </div>
      {/* </p> */}
    </div>
  );
};
export default NotFoundPage;
