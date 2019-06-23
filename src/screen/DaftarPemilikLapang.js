import React from 'react';
import { Layout, Button, Icon } from 'antd';
import firebase from 'firebase';
import { Link } from 'react-router-dom';

import MainHeader from '../Component/Header';

const columns = [
  {
    title: 'Avatar',
    dataIndex: 'avatar',
    key: 'avatar'
  },
  {
    title: 'Nama',
    dataIndex: 'nama',
    key: 'nama'
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: 'Alamat',
    dataIndex: 'alamat',
    key: 'alamat'
  }
]

class DaftarPemilikLapang extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listPemilik: []
    }
  }

  componentDidMount() {
    firebase.firestore().collection('user').where('role', '==', 2).get().then(doc => {
      doc.forEach(item => {
        console.log(item.data());
      });
    }).catch(err => {
      console.log(err);
    })
  }

  render() {
    return(
      <Layout >
        <MainHeader selected="4" />
        <Layout.Content style={{ padding: '0 50px', marginTop: 100 }}>
          <Link to="/tambahpemilik" ><Button ><Icon type="plus" />Tambah Pemilik Lapang</Button></Link>
        </Layout.Content>
        <Layout.Footer style={{ textAlign: 'center' }}>
          Ant Design ©2018 Created by Ant UED
        </Layout.Footer>
      </Layout>
    );
  }
}

export default DaftarPemilikLapang;