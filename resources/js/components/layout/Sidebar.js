import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dropdown, Icon, Nav, Navbar, Sidenav } from 'rsuite';
import * as actions from '../../store/actions';

import { NavLink } from './common';

function Sidebar(props) {
  const handleLogout = (e) => {
    e.preventDefault();
    props.dispatch(actions.authLogout());
  };

  return (
    <div style={{ width: 250 }}>
      <Sidenav defaultOpenKeys={['3', '4']} activeKey="1">
        <Sidenav.Body>
          <Nav>
            <NavLink to="/" eventKey="1" icon={<Icon icon="dashboard" />}>Dashboard</NavLink>
            <NavLink to="/resource/todo" eventKey="2" icon={<Icon icon="list" />}>Todos</NavLink>
            <Nav.Item eventKey="2" icon={<Icon icon="group" />}>
              User Group
            </Nav.Item>
            <Dropdown eventKey="3" title="Advanced" icon={<Icon icon="magic" />}>
              <Dropdown.Item eventKey="3-1">Geo</Dropdown.Item>
              <Dropdown.Item eventKey="3-2">Devices</Dropdown.Item>
              <Dropdown.Item eventKey="3-3">Loyalty</Dropdown.Item>
              <Dropdown.Item eventKey="3-4">Visit Depth</Dropdown.Item>
            </Dropdown>
            <Dropdown
              eventKey="4"
              title="Settings"
              icon={<Icon icon="gear-circle" />}
            >
              <Dropdown.Item eventKey="4-1">Applications</Dropdown.Item>
              <Dropdown.Item eventKey="4-2">Channels</Dropdown.Item>
              <Dropdown.Item eventKey="4-3">Versions</Dropdown.Item>
              <Dropdown.Menu eventKey="4-5" title="Custom Action">
                <Dropdown.Item eventKey="4-5-1">Action Name</Dropdown.Item>
                <Dropdown.Item eventKey="4-5-2">Action Params</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Sidenav.Body>
      </Sidenav>
    </div>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
});

export default connect(mapStateToProps)(Sidebar);
