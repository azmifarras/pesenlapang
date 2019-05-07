import React, { Component } from 'react';
import { Layout, Menu, Avatar, Breadcrumb, Dropdown, Icon, Table, List, Button,Form, Input, Modal } from 'antd';
import firebase from 'firebase';
import moment from 'moment';
import { BrowserRouter as Router, Link , Redirect } from 'react-router-dom';
import _ from 'lodash';

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
        deskripsi: "",
        harga: ""
      }
    }
    render() {
      const {
        visible, onCancel, onCreate, form, visibleUpdate, item, onUpdate
      } = this.props;
      console.log(this.props);
      const { getFieldDecorator } = form;
      if(visible) {
        return(
          <Modal
            visible={visible}
            title="Form daftar Lapang"
            okText="Create"
            onCancel={onCancel}
            onOk={onCreate}
          >
            <Form layout="vertical">
              <Form.Item label="Deskripsi">
                {getFieldDecorator('deskripsi', {
                  rules: [{ required: true, message: 'data wajib di isi ' }],
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item label="Harga">
                {getFieldDecorator('harga')(<Input type="textarea" />)}
              </Form.Item>
              <Form.Item label="Nama ">
                {getFieldDecorator('nama')(<Input type="textarea" />)}
              </Form.Item> 
            </Form>
          </Modal>
        )
      }
      else {
        return(
          <Modal
            visible={visibleUpdate}
            title="Form daftar Lapang"
            okText="Update"
            onCancel={onCancel}
            onOk={onUpdate}
          >
            <Form layout="vertical">
              <Form.Item label="Deskripsi">
                {getFieldDecorator('deskripsi', {
                  rules: [{ required: true, message: 'data wajib di isi ' }],
                  initialValue: item && item.deskripsi
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item label="Harga">
                {getFieldDecorator('harga', {
                  initialValue: item && item.harga
                })(<Input type="textarea" />)}
              </Form.Item>
              <Form.Item label="Nama">
                {getFieldDecorator('nama', {
                  initialValue: item && item.nama
                })(<Input type="textarea" />)}
              </Form.Item> 
            </Form>
          </Modal>
        )
      }
    }
  }
);


  //nama: `IFI Futsal`,
  //jalan : 'Jln Sayang Jatinangor',
  //kabupaten : 'Kabupaten Sumedang',

  class LapangSewa extends Component {
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
        firebase.firestore().collection('lapang sewa').add({
          deskripsi: values.deskripsi,
          harga: values.harga,
          nama: values.nama,
        }).then(data => {
          console.log(data);
        })
        form.resetFields();
        this.setState({ visible: false, visibleUpdate: false });
      });
    }

    handleUpdate = (item) => {
      const form = this.formRef.props.form;
      form.validateFields((err, values) => {
        if (err) {
          return;
        }  
        console.log('Received values of form: ', values);
        firebase.firestore().collection('lapang sewa').doc(item.id).update({
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
      firebase.firestore().collection('lapang sewa').doc(id).delete().then(function(){
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
      let dataLapangSewa = [];
      await firebase.firestore().collection('lapang sewa').get().then (data => {
        data.forEach(item => {
          console.log(item.data());
          dataLapangSewa.push({
            href: '/lapangsewa',
            deskripsi: item.data().deskripsi,
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            harga: item.data().harga,
            nama: item.data().nama,
            id: item.id
          });
        });
      });
      this.setState({ dataSource: dataLapangSewa });
    }

    componentDidUpdate(prevProps, prevState) {
      if(!_.isEqual(prevState, this.state)) {
      }
    }
    
    render() {
      console.log(this.state.itemUpdate)
      return(
        <div>
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
              extra={<img width={272} marginRight= {100} alt="logo" src="http://www.staradmiral.com/wp-content/uploads/2017/01/Empat-Macam-Lapangan-Futsal.jpg" />}
            >
              <List.Item.Meta
                title={<a href={item.href}>{item.deskripsi}</a>}
                description={item.harga}
              />
              {item.nama}
              <br/>
              <Button type="danger" onClick={() => this.handleDelete(item.id)}>Delete</Button>
              <Button type="primary" onClick={() => this.ModalUpdate(item)}>Update</Button>
              
              <CollectionCreateForm
                wrappedComponentRef={this.saveFormRefUpdate}
                visibleUpdate={this.state.visibleUpdate}
                onCancel={this.handleCancel}
                item={item}
                onUpdate={this.handleUpdate}
              />
            </List.Item>
          )}
        />
            <Link to ="/tambahlapangsewa">
              <Button type="primary" onClick={this.showModal}>Tambah Lapang</Button>
            </Link>  
       </div>
    )
  }
  
}

  export default LapangSewa;