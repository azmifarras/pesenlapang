import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Dropdown, Icon} from 'antd';
import { Link } from 'react-router-dom';
import Transaksi from '../screen/Transaksi';
import DaftarLapang from './DaftarLapang';

const { Header, Content, Footer } = Layout;

 class Home extends Component {


  render() {
    return(
    <Layout>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="1">Home</Menu.Item>
          <Menu.Item key="2"><Link to="/transaksi">Transaksi</Link></Menu.Item>
          <Menu.Item key= "3"><Link to="/daftarlapang">Daftar Lapang</Link></Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 100px', marginTop: 64 }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>Content</div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
    )
  }
}

export default Home ;
  
