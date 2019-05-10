import React, { Component } from 'react';
import {Layout, Menu, Avatar, Breadcrumb, Dropdown, Icon, Table, List, Button,Form, Input, Modal } from 'antd';
import { Link } from 'react-router-dom';
import Transaksi from '../screen/Transaksi';
import DaftarLapangFutsal from './DaftarLapangFutsal';
import UpdateLapang from './BuatLapang';
import firebase from 'firebase';
import ImageUpload from '../Component/ImageUpload';

import MainHeader from '../Component/Header';
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
      <MainHeader selected="1" />
      <Content style={{ padding: '0 100px', marginTop: 100 }}>
        <ImageUpload/>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
    )
  }
}

export default Home ;
  
