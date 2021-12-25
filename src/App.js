import { BrowserRouter as Router } from 'react-router-dom'
import NavBar from './components/navbar'
import Content from './components/content'
import SideNav from './components/sideNav'

export default function App() {
  return (
    <Router>
      <div className="body">
        <div className="gutter"></div>
        
        <div className="main">
          <NavBar />
          <div className="main-content">  
            {/* <SideNav /> */}
            <Content />
          </div>
        </div>
        
        <div className="gutter"></div>
      </div>
    </Router>
  )
}