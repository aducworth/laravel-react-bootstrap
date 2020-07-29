import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dropdown, Icon, Nav, Navbar } from 'rsuite';
import * as actions from '../../store/actions';

import { NavLink } from './common';

function Header(props) {
  const handleLogout = (e) => {
    e.preventDefault();
    props.dispatch(actions.authLogout());
  };

  return (
    <Navbar appearance="inverse">
      <Navbar.Header>
        <h1 className="logo m-3 font-weight-normal h4">
          <Link to="/">Laravel React</Link>
        </h1>
      </Navbar.Header>
      <Navbar.Body>
        {props.isAuthenticated && (
          <Nav pullRight>
            <NavLink to="/archive">Archive</NavLink>
            <Dropdown placement="bottomEnd" title="Account">
              <Dropdown.Item style={{ width: 160 }} eventKey="4">Settings</Dropdown.Item>
              <Dropdown.Item divider />
              <Dropdown.Item
                eventKey="5"
                onClick={handleLogout}
              >
                Logout
              </Dropdown.Item>
            </Dropdown>
          </Nav>
        )}
      </Navbar.Body>
    </Navbar>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
});

export default connect(mapStateToProps)(Header);
