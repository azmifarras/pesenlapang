import React, { Component } from 'react';
import { Layout, Menu, Avatar, Breadcrumb, Dropdown, Icon, Table, List, Button,Form, Input, Modal } from 'antd';
import firebase from 'firebase';
import moment from 'moment';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import MainHeader from '../Component/Header';
import Sider from '../Component/SiderDaftarLapang';

const { Header, Content, Footer } = Layout;

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

const CollectionCreateForm = Form.create({name: 'form_in_modal'}) (
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        nama: "",
        jalan: "",
        kabupaten: ""
      }
    }

    render() {
      const {
        visible, onCancel, onCreate, form, visibleUpdate, item, onUpdate
      } = this.props;
      console.log(this.props);
      const { getFieldDecorator } = form;
      return(
        <Modal
          visible={visibleUpdate}
          title="Form daftar Lapang"
          okText="Update"
          onCancel={onCancel}
          onOk={onUpdate}
        >
          <Form layout="vertical">
            <Form.Item label="Nama Lapang">
              {getFieldDecorator('nama', {
                rules: [{ required: true, message: 'data wajib di isi ' }],
                initialValue: item && item.nama
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="Jalan">
              {getFieldDecorator('jalan', {
                initialValue: item && item.jalan
              })(<Input type="textarea" />)}
            </Form.Item>
            <Form.Item label="Kabupaten">
              {getFieldDecorator('kabupaten', {
                initialValue: item && item.kabupaten
              })(<Input type="textarea" />)}
            </Form.Item> 
          </Form>
        </Modal>
      )
    }
  }
);


  //nama: `IFI Futsal`,
  //jalan : 'Jln Sayang Jatinangor',
  //kabupaten : 'Kabupaten Sumedang',

  class DaftarLapangBadminton extends Component {
    constructor(props){
      super(props);
      this.state = {
        dataSource: [],
        itemUpdate: {}
      }
      this.ModalUpdate = this.ModalUpdate.bind(this);
    }
    
    state ={
      visible: false,
      visibleUpdate: false,
    };
    showModal = () =>{
      this.setState({visible: true, visibleUpdate: false});
    }
    ModalUpdate(item) {
      this.setState({visibleUpdate: true, visible: false, itemUpdate: item});
    }
    handleCancel = () => {
      this.setState({ visible: false, visibleUpdate: false });
    }
  
    handleCreate = () => {
      const form = this.formRef.props.form;
      form.validateFields((err, values) => {
        if (err) {
          return;
        }  
        console.log('Received values of form: ', values);
        firebase.firestore().collection('lapang').add({
          nama: values.nama,
          jalan: values.jalan,
          kabupaten: values.kabupaten
        }).then(data => {
          console.log(data);
        })
        form.resetFields();
        this.setState({ visible: false, visibleUpdate: false });
      });
    }

    handleUpdate = () => {
      const form = this.formRef.props.form;
      const { itemUpdate } = this.state;
      form.validateFields((err, values) => {
        if (err) {
          console.log(err)
          return;
        }  
        console.log('Received values of form: ', values);
        console.log(itemUpdate)
        firebase.firestore().collection('lapang').doc(itemUpdate.id).update({
          jalan: values.jalan,
          kabupaten: values.kabupaten,
          nama: values.nama
        }).then(function(){
          console.log("success");
        }).catch(function(error){
          console.log("error", error);
        })
        form.resetFields();
        this.setState({ visible: false, visibleUpdate: false });
      });
    }

    handleDelete(id) {
      firebase.firestore().collection('lapang').doc(id).delete().then(function(){
        console.log("Document delete");
      }).catch(function(error){
        console.log("error  removing", error);
      })
    }

    saveFormRef = (formRef) => {
      this.formRef = formRef;
    }

    saveFormRefUpdate = (formRef) => {
      this.formRef = formRef;
    }
    
    async componentDidMount(){
      let dataLapang = [];
      await firebase.firestore().collection('lapang').where("kategori", "==", "Badminton").get().then (data => {
        data.forEach(item => {
          console.log(item.data());
          dataLapang.push({
            href: '/lapangsewa',
            nama: item.data().nama,
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            jalan: item.data().jalan,
            kabupaten: item.data().kabupaten,
            id: item.id
          });
        });
      });
      this.setState({ dataSource: dataLapang });
    }
    componentDidUpdate(prevProps, prevState) {
      if(!_.isEqual(prevState, this.state)) {
      }
    }
    render() {
      console.log(this.state.itemUpdate)
      return(
        <Layout >
          <MainHeader selected="3" />
          <Layout.Content style={{ padding: '0 100px', marginTop: 100 }}>
            <Layout style={{ padding: '24px 0', background: '#fff' }}>
              <Sider selected="2" />
              <Layout.Content style={{ padding: '0 24px', minHeight: 280 }}>
                <h1 >Badminton</h1>
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
                      <br/>
                      <Button type="danger" onClick={() => this.handleDelete(item.id)}>Delete</Button> <Button type="primary" onClick={() => this.ModalUpdate(item)}>Update</Button>
                      
                      <CollectionCreateForm
                        wrappedComponentRef={this.saveFormRefUpdate}
                        visibleUpdate={this.state.visibleUpdate}
                        onCancel={this.handleCancel}
                        item={this.state.itemUpdate}
                        onUpdate={this.handleUpdate}
                      />
                    </List.Item>
                  )}
                />
                <Link to ="/buatlapang">
                  <Button type="primary" onClick={this.showModal}>Tambah Lapang</Button>
                </Link>
              </Layout.Content>
            </Layout>
          </Layout.Content>
          <Layout.Footer style={{ textAlign: 'center' }}>
            Ant Design ©2018 Created by Ant UED
          </Layout.Footer>
        </Layout>
    )
  }
  
}

  export default DaftarLapangBadminton;