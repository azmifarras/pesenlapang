import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Dropdown, Icon, Table} from 'antd';
import firebase from 'firebase';
import moment from 'moment';

const { Header, Content, Footer } = Layout;
const columns = [{
    title: 'Nama Lapang',
    dataIndex: 'nama',
    // specify the condition of filtering result
    // here is that finding the name started with `value`
    onFilter: (value, record) => record.nama.indexOf(value) === 0,
    sorter: (a, b) => a.nama.length - b.nama.length,
    sortDirections: ['descend'],
  },{
    title: 'Lapang Sewa',
    dataIndex: 'lapangsewa',   
  },
   {
    title: 'Tanggal',
    dataIndex: 'tanggal',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.tanggal - b.tanggal,
  }, {
    title: 'Nama Penyewa',
    dataIndex: 'sewa',   
  },
   {
    title: 'Harga',
    dataIndex: 'Harga'
  }

];

function onChange(pagination, filters, sorter) {
  console.log('params', pagination, filters, sorter);
}

 class Transaksi extends Component {
  constructor(props){
    super(props);
    this.state = {
      dataSource: []
    }
  }

  componentDidMount() {
    let dataTemp = [];
    //setelah di render baru jalanin setelah yang ada di component didmount
    firebase.firestore().collection('transaksi').get().then(async data => {
      data.forEach(async item => {
        //buat ngebuka satu2 ketika pakai array 
        console.log('=======', item.id);
        console.log(item.data());
        let dataUser= await item.data().userID.get();
        //Let =Inisialisasi 
        console.log(dataUser.data());
        let dataSewa = await item.data().lapangSewa.get();
        console.log(dataSewa.data());
        let dataLapang = await dataSewa.data().lapangId.get();
        console.log(dataLapang.data());
        dataTemp.push({
          key: item.id,
          nama: dataLapang.data().nama,
          lapangsewa: dataSewa.data().nama,
          tanggal: moment(item.data().tanggal.toDate()).format('MMMM Do YYYY, h:mm:ss a'),
          sewa: dataUser.data().nama,
          Harga: item.data().harga
        });
      });
      console.log(dataTemp);
      await this.setState({ dataSource: dataTemp });
    })
  }

  render() {
    console.log('ini state', this.state.dataSource);
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
          <Menu.Item key="2">Transaksi</Menu.Item>                      
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px', marginTop: 64 }}>
        <Table columns={columns} dataSource={this.state.dataSource} onChange={onChange} />
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
    )
  }
}

export default Transaksi ;
  
