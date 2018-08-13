import React, {Component} from 'react'
import injectSheet from 'react-jss'
import {styles} from './styles'

class home extends Component {
  componentDidMount() {

  }

  render() {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        test
      </div>
    )
  }
}

export const Home = injectSheet(styles)(home)
