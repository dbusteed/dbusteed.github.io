import { useEffect, useState } from 'react'
import { Paper, Chip } from '@material-ui/core'
import ProjectCard from '../projectCard'
import { projects, tags } from '../../data/projects'
import './index.css'

export default function Projects() {
  
  const [filter, setFilter] = useState({})

  useEffect(() => {
    let tmp = {}
    Object.values(tags).forEach(tagGroup => {
      tagGroup.forEach(tag => {
        tmp[tag] = false
      })
    })
    setFilter(tmp)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags])

  return (
    <div>
      
      <p>
        here's some projects and other random things i've worked on. 
        most of this mirrors my GitHub page, but this page allows you
        to search my different projects using tags 
      </p>

      <Paper elevation={0}>
        <div className="tag-filters-main">
          <div className="tag-filters-main-header">
            <span>Filter projects by clicking the tags below</span>
          </div>
          <div className="tag-filters">
            {
              Object.entries(tags).map(([k,v]) => (
                <div className="tag-filters-group" key={k}>
                  <span className="tag-filters-header">{k}</span>
                  <div className="tag-filters-tags">
                    {
                      v.map(tag => (
                        <div key={tag} className="tag-filters-tag">
                          <Chip
                            onClick={() => setFilter({...filter, [tag]: !filter[tag]})}
                            variant={filter[tag] ? "default" : "outlined"} 
                            size="small" 
                            label={tag} 
                          />
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </Paper>

      {
        projects.map((p, idx) => (
          <ProjectCard key={idx} project={p} filter={filter} />
        ))
      }
    
    </div>
  )
}