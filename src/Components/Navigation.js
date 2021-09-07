import React from 'react'
import { Navbar, Container, Nav } from 'react-bootstrap'
import Button from '@material-ui/core/Button'
import { Home, Favorite, NightsStay, WbSunny } from '@material-ui/icons'
import { NavLink } from 'react-router-dom'

export default function Navigation (props) {
  return (
    <div className='navBar'>
      <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
        <Container>
          <Navbar.Brand href='/'>Herolo Weather App</Navbar.Brand>
          <Navbar.Toggle aria-controls='responsive-navbar-nav' />
          <Navbar.Collapse id='responsive-navbar-nav'>
            <Nav className='me-auto'>
              <Nav.Link>
                <NavLink to='/' className='link'>
                  <Home />
                </NavLink>
              </Nav.Link>
              <Nav.Link to='/favorites'>
                <NavLink to='/favorites' className='link'>
                  <Favorite />
                </NavLink>
              </Nav.Link>
            </Nav>
            <Nav>
              <Button
                onClick={() => {
                  props.setDegree(props.degree === 'C' ? 'F' : 'C')
                }}
                className='navButton'
              >
                {'°' + props.degree}
              </Button>
              <Button
                onClick={() => {
                  props.setBright(props.bright === true ? false : true)
                }}
                className='navButton'
              >
                {props.bright === true ? <WbSunny /> : <NightsStay />}
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  )
}
