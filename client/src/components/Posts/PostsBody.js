import React from 'react'
import '../../componentsStyles/PostsBody.css';

import Feed from './Feed.js'


function PostsBody({user}) {
  return (
      <div className="app">
        <div className="app_body">
            <Feed user = {user}/>
        </div>
      </div>
  )
}

export default PostsBody;