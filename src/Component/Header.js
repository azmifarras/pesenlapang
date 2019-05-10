import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

class MainHeader extends React.Component {
  render() {
    const { selected } = this.props;
    return(
      <Layout.Header style={{ position: 'fixed', zIndex: 1, width: '100%' }} >
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[selected]}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="1" ><Link to="/" >Home</Link></Menu.Item>
          <Menu.Item key="2"><Link to="/transaksi" >Transaksi</Link></Menu.Item>
          <Menu.Item key="3"><Link to="/daftarlapang" >Daftar Lapang</Link></Menu.Item>
        </Menu>
      </Layout.Header>
    );
  }
}

export default MainHeader;