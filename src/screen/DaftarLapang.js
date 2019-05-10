import React from 'react';
import { Layout } from 'antd';

import MainHeader from '../Component/Header';
import Sider from '../Component/SiderDaftarLapang';

class DaftarLapang extends React.Component {
  render() {
    return(
      <Layout >
        <MainHeader selected="3" />
        <Layout.Content style={{ padding: '0 100px', marginTop: 100 }}>
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Sider />
            <Layout.Content style={{ padding: '0 24px', minHeight: 280 }}>
              Content
            </Layout.Content>
          </Layout>
        </Layout.Content>
        <Layout.Footer style={{ textAlign: 'center' }}>
          Ant Design ©2018 Created by Ant UED
        </Layout.Footer>
      </Layout>
    );
  }
}

export default DaftarLapang;