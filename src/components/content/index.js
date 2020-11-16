import { Switch, Route } from 'react-router-dom'
import About from '../about'
import Projects from '../projects'
import './index.css'

export default function Content() {
  return (
    <div className="content">
      <Switch>
        <Route path="/projects" component={Projects} />
        <Route path="/" component={About} />
      </Switch>
    </div>
  )
}