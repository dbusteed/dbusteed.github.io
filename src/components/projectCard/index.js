import { useEffect, useState } from 'react'
import { Paper, Chip } from '@material-ui/core'
import './index.css'

export default function ProjectCard(props) {

  const [display, setDisplay] = useState("")
  
  const project = props.project
  const filter = props.filter

  useEffect(() => {
    if (Object.values(filter).every(x => x === false)) {
      setDisplay("")
    } else {
      let matches = 0
      let trueTags = Object.entries(filter).filter(x => x[1]).map(x => x[0])
      project.tags.forEach(tag => {
        if (trueTags.indexOf(tag) !== -1) {
          matches += 1
        }
      })
      if (matches === trueTags.length) {
        setDisplay("")
      } else {
        setDisplay("none")
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  return (
    <div style={{display: display}}>
      <Paper elevation={2}>
        <div className="paper-inner">
          <div className="project-card-header">
            <span className="project-name" onClick={() => console.log(filter)}>{project.name}</span>
            <span>
              <a href={`${project.url}`}>view project</a>
            </span>
          </div>
          <div className="project-card-blurb">
            <span className="project-blurb">{project.blurb}</span>
          </div>
          <div className="project-card-tags">
            {
              project.tags.map((tag, idx) => (
                <div className="project-tag" key={idx}>
                  <Chip variant="outlined" size="small" label={tag} />
                </div>
              ))
            }
          </div>
        </div>
      </Paper>
    </div>
  )
}