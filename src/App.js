import { BrowserRouter as Router } from 'react-router-dom'
import NavBar from './components/navbar'
import Content from './components/content'

export default function App() {
  return (
    <Router>
      <div className="body">
        <div className="gutter"></div>
        
        <div className="main">
          <NavBar />
          <Content />
        </div>
        
        <div className="gutter"></div>
      </div>
    </Router>
  )
}