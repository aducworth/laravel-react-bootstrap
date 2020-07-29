import React from 'react';
import { connect } from 'react-redux';
import { Container, Header, Content, Footer, Sidebar } from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';

import AppHeader from './components/layout/Header';
import AppSidebar from './components/layout/Sidebar';

const Base = ({ children, isAuthenticated }) => (
  <Container>
    <Header>
      <AppHeader />
    </Header>
    <Container>
      {isAuthenticated && <Sidebar><AppSidebar /></Sidebar>}
      <Content>{children}</Content>
    </Container>
    {isAuthenticated && <Footer></Footer>}
  </Container>
);

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
});

export default connect(mapStateToProps)(Base);
