import { Link } from 'react-router-dom'
import './index.css'
import { posts } from '../../data/posts'

export default function SideNav() {
  return (
    <div>
      {
        posts.map(p => (
          <Link to={`/posts/${p[1]}`}>
            <p>{p[0]}</p>
          </Link>
        ))
      }
    </div>
  )
}