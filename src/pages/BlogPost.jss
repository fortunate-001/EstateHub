import React from 'react';
import { useParams, useLocation } from 'react-router-dom';

function BlogPost() {
  const { id } = useParams();
  const location = useLocation();
  const { blogTitle } = location.state || {};

  return (
    <div className="blog-post-page">
      <div className="container">
        <h1>{blogTitle || `Blog Post ${id}`}</h1>
        <p>Full article content goes here...</p>
        {/* Add your full blog content */}
      </div>
    </div>
  );
}

export default BlogPost;