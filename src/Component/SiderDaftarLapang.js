import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

class SiderDL extends React.Component {
  render() {
    const { selected } = this.props;
    return(
        <Layout.Sider width={200} style={{ background: '#fff' }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={[selected]}
          style={{ height: '100%' }}
        >
          <Menu.Item key="1" ><Link to="/daftarlapang/futsal" >Futsal</Link></Menu.Item>
          <Menu.Item key="2" ><Link to="/daftarlapang/badminton" >Badminton</Link></Menu.Item>
        </Menu>
      </Layout.Sider>
    );
  }
}

export default SiderDL;