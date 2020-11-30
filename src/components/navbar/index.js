import { Link } from 'react-router-dom'
import './index.css'

export default function NavBar() {
  return (
    <div>
      <div className="desktop-nav">
        <div className="desktop-nav-item-group">
          <div className="desktop-nav-item nav-main">
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
      <div className="mobile-nav">
        <div className="nav-main">
          <span>Davis Busteed</span>
        </div>
        <div className="mobile-nav-items">
          <Link to="/about">
            <span>About</span>
          </Link>
          <Link to="/projects">
            <span>Projects</span>
          </Link>
          <a href="https://github.com/dbusteed">
            <span>GitHub</span>
          </a>
          <a href="https://www.linkedin.com/in/davisbusteed/">
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </div>
  )
}