import { Link } from 'react-router-dom'
import './index.css'

export default function NavBar() {
  return (
    <div>
      <div className="desktop-nav">
        <div className="desktop-nav-item-group">
          <div className="desktop-nav-item desktop-nav-item-main">
            <span>Davis Busteed</span>
          </div>
          <div className="desktop-nav-item">
            <Link to="/about">
              <span>About</span>
            </Link>
          </div>
          <div className="desktop-nav-item">
            <Link to="/projects">
              <span>Projects</span>
            </Link>
          </div>
        </div>
        <div className="desktop-nav-item-group desktop-nav-item-group-right">
          <div className="desktop-nav-item">
            <a href="https://github.com/dbusteed">
              <span>GitHub</span>
            </a>
          </div>
          <div className="desktop-nav-item">
            <a href="https://www.linkedin.com/in/davisbusteed/">
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}