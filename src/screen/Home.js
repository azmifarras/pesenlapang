import React, { Component } from 'react';
import {Layout, Menu, Avatar, Breadcrumb, Dropdown, Icon, Table, List, Button,Form, Input, Modal } from 'antd';
import { Link } from 'react-router-dom';
import Transaksi from '../screen/Transaksi';
import DaftarLapangFutsal from './DaftarLapangFutsal';
import UpdateLapang from './BuatLapang';
import firebase from 'firebase';
import ImageUpload from '../Component/ImageUpload';
const { Header, Content, Footer } = Layout;

 class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      dataSource: [],
   }
}
  componentDidMount(){
    let dataKategori = [];
     firebase.firestore().collection('kategori').get().then (data => {
      data.forEach(item => { 
        console.log(item.data());
        dataKategori.push({
          nama: item.data().nama,
          gambar: item.data().gambar,
          id: item.id
        });
      });
    });
    this.setState({ dataSource: dataKategori });
  }

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
          <Menu.Item key="1" trigger={['click']} >Home</Menu.Item>
          <Menu.Item key="2"><Link to="/transaksi">Transaksi</Link></Menu.Item>
          <Dropdown overlay={(
            <Menu>
            <List >
              <Menu.Item key="0">
                <a href="/daftarlapang/futsal">Futsal</a>
              </Menu.Item>
              <Menu.Item key="0">
                <a href="/daftarlapang/badminton">Badminton</a>
              </Menu.Item>
            </List>  
          </Menu>
          )} trigger={['click']}>
            <a  href="">
             Daftar Lapang <Icon type="down" />
            </a>
          </Dropdown>
        </Menu>
      </Header>
      <Content style={{ padding: '0 100px', marginTop: 64 }}>
        <ImageUpload/>
      </Content>
    </Layout>
    )
  }
}

export default Home ;
  
