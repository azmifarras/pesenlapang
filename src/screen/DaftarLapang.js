import React, { Component } from 'react';
import { Layout, Menu, Avatar, Breadcrumb, Dropdown, Icon, Table, List} from 'antd';
import firebase from 'firebase';
import moment from 'moment';
import _ from 'lodash';

const { Header, Content, Footer } = Layout;

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);


  //nama: `IFI Futsal`,
  //jalan : 'Jln Sayang Jatinangor',
  //kabupaten : 'Kabupaten Sumedang',

  class DaftarLapang extends Component {
    constructor(props){
      super(props);
      this.state = {
        dataSource: []
      }
    }
    componentDidMount(){
      let dataLapang = [];
      firebase.firestore().collection('lapang').get().then (data => {
        data.forEach(item => {
          console.log(item.data());
          dataLapang.push({
            href: 'http://ant.design',
            nama: item.data().nama,
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            jalan: item.data().jalan,
            kabupaten: item.data().kabupaten,
          });
        });
      });
      this.setState({ dataSource: dataLapang });
    }

    componentDidUpdate(prevProps, prevState) {
      if(!_.isEqual(prevState, this.state)) {
        this.forceUpdate();
      }
    }
    
    render() {
      console.log(this.state.dataSource)
      return(
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 3,
          }}
          dataSource={this.state.dataSource}
          renderItem={item => (
            <List.Item
              key={item.title}
              extra={<img width={272} marginRight= {100} alt="logo" src="https://i1.wp.com/www.knginfo.com/wp-content/uploads/2017/10/lapang-futsal.jpg?fit=620%2C350&ssl=1" />}
            >
              <List.Item.Meta
                title={<a href={item.href}>{item.nama}</a>}
                description={item.jalan}
              />
              {item.kabupaten}
            </List.Item>
          )}
        />
    )
  }
  
}

  export default DaftarLapang;