import { Switch, Route } from 'react-router-dom'
import About from '../about'
import Post from '../post'
import Projects from '../projects'
import PostList from '../postList'
import './index.css'


export default function Content() {
  return (
    <div className="content">
      <Switch>
        <Route path="/projects" component={Projects} />
        <Route path="/posts" component={Post} />
        <Route path="/" component={PostList} />
      </Switch>
    </div>
  )
}