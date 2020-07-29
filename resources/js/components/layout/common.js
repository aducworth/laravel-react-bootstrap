import React from 'react';
import { Link } from 'react-router-dom';
import { Nav } from 'rsuite';

const MyLink = React.forwardRef((props, ref) => {
  const { to, ...rest } = props;
  return (
    <Link to={to} ref={ref} {...rest} />
  );
});

export const NavLink = props => <Nav.Item componentClass={MyLink} {...props} />;
