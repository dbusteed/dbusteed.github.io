import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { posts } from '../../data/posts'
import { Paper } from '@material-ui/core'
import './index.css'

export default function PostList() {
  
  return (
    <div>
      {
        Object.entries(posts).map(([link, data]) => (
          <Paper>
            <div className="post-div">
              <div className="post-div-row">
                <div>
                  <Link key={link} to={`/posts/${link}`}>
                    <span style={{"fontSize": "1.35rem"}}>{data.name}</span>
                  </Link>
                </div>
                <div>
                  <span>{new Date(Number(data.date)).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="post-div-row" style={{"paddingTop": "0.75rem"}}>
                <span style={{"color": "#808080"}}>
                  {data.tags.join(', ')}
                </span>
              </div>
            </div>
          </Paper>
        ))
      }
    </div>
  )
}