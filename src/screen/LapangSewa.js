import React, { Component } from 'react';
import { Layout, message, Upload, Breadcrumb, Dropdown, Icon, Table, List, Button,Form, Input, Modal } from 'antd';
import firebase from 'firebase';
import moment from 'moment';
import { BrowserRouter as Router, Link , Redirect } from 'react-router-dom';
import _ from 'lodash';
import qs from 'querystring';

import MainHeader from '../Component/Header';

const { Header, Content, Footer } = Layout;

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if(!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}

function create_UUID(){
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}

const CollectionCreateForm = Form.create({name: 'form_in_modal'}) (
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        nama: "",
        deskripsi: "",
        harga: "",
        routes: [],
        imageUrl: this.props.item.imageUrl,
        fullPath: ''
      }
    }

    handleChangeUpload = info => {
      if(info.file.status === 'uploading') {
        this.setState({ loading: true });
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl =>
          this.setState({
            imageUrl,
            loading: false,
          }),
        );
      }
    }

    componentDidUpdate(prevProps) {
      if(!_.isEqual(this.props, prevProps)) {
        this.setState({ imageUrl: this.props.item.imageUrl })
      }
    }
  
    customUpload = async ({ onError, onSuccess, file }) => {
      const storage = firebase.storage()
      const metadata = {
        contentType: 'image/jpeg'
      }
      const storageRef = await storage.ref()
      const imageName = create_UUID() //a unique name for the image
      const imgFile = storageRef.child(`LapangSewa/${imageName}.png`)
      try {
        const image = await imgFile.put(file, metadata);
        this.setState({ fullPath: image.metadata.fullPath });
        onSuccess(null, image)
      }
      catch(e) {
        onError(e);
      }
    }

    render() {
      const {
        visible, onCancel, onCreate, form, visibleUpdate, item, onUpdate
      } = this.props;
      console.log(this.props);
      const { getFieldDecorator } = form;
      const uploadButton = (
        <div>
          <Icon type="plus" />
          <div className="ant-upload-text">Upload</div>
        </div>
      );
      return(
        <Modal
          visible={visibleUpdate}
          title="Form daftar Lapang"
          okText="Update"
          onCancel={onCancel}
          onOk={onUpdate}
        >
          <Form layout="vertical">
            <Form.Item label="Nama">
              {getFieldDecorator('nama', {
                initialValue: item && item.nama
              })(<Input type="textarea" />)}
            </Form.Item>
            <Form.Item label="Deskripsi">
              {getFieldDecorator('deskripsi', {
                rules: [{ required: true, message: 'data wajib di isi ' }],
                initialValue: item && item.deskripsi
              })(
                <Input.TextArea rows={4} />
              )}
            </Form.Item>
            <Form.Item label="Harga">
              {getFieldDecorator('harga', {
                initialValue: item && item.harga
              })(<Input type="textarea" />)}
            </Form.Item>
            <Form.Item label="Gambar">
              {getFieldDecorator('gambar', {
                initialValue: item && item.harga
              })(
                <Upload
                  name="Avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={this.handleChangeUpload}
                  customRequest={this.customUpload}
                >
                  {this.state.imageUrl ? <img style={{ height: 250, width: 250 }} src={this.state.imageUrl} alt="avatar" /> : uploadButton}
                </Upload>
              )}
            </Form.Item>
            <Form.Item style={{ display: 'none' }} label="ImageUrl">
              {getFieldDecorator('imageUrl', {
                initialValue: this.state.imageUrl
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

  class LapangSewa extends Component {
    constructor(props){
      super(props);
      this.state = {
        dataSource: [],
        itemUpdate: {},
        dataLapang: {}
      }
      this.ModalUpdate = this.ModalUpdate.bind(this);
    }
    
    state ={
      visible: false,
      visibleUpdate: false,
    };
    
    ModalUpdate(item) {
      this.setState({visibleUpdate: true, visible: false, itemUpdate: item});
    }

    handleCancel = () => {
      this.setState({ visible: false, visibleUpdate: false });
    }

    handleUpdate = (item) => {
      const form = this.formRef.props.form;
      form.validateFields((err, values) => {
        if (err) {
          return;
        }  
        console.log('Received values of form: ', values);
        firebase.firestore().collection('lapang sewa').doc(this.state.itemUpdate.id).update({
          deskripsi: values.deskripsi,
          harga: values.harga,
          imageUrl: values.imageUrl,
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
      firebase.firestore().collection('lapang sewa').doc(id).delete().then(function(){
        console.log("Document delete");
      }).catch(function(error){
        console.log("error  removing", error);
      })
    }

    saveFormRefUpdate = (formRef) => {
      this.formRef = formRef;
    }
    
    async componentDidMount(){
      let dataLapangSewa = [];
      let dataLapang = {}
      await firebase.firestore().collection('lapang sewa').where('lapangId', "==", firebase.firestore().collection('lapang').doc(this.props.match.params.lapangId)).get().then (data => {
        data.forEach(item => {
          console.log(item.data());
          dataLapangSewa.push({
            deskripsi: item.data().deskripsi,
            harga: item.data().harga,
            nama: item.data().nama,
            imageUrl: item.data().imageUrl,
            id: item.id
          });
        });
      });
      this.setState({ dataSource: dataLapangSewa });

      await firebase.firestore().collection('lapang').doc(this.props.match.params.lapangId).get().then(doc => {
        dataLapang = doc.data();
      });
      this.setState({ dataLapang: dataLapang })
    }

    componentDidUpdate(prevProps, prevState) {
      if(!_.isEqual(prevState, this.state)) {
      }
    }
    
    render() {
      console.log(qs.parse("?filter=top&origin=im".substring(1)));
      console.log(this.props.location.pathname);
      console.log()
      return(
        <Layout >
          <MainHeader selected="3" />
          <Layout.Content style={{ padding: '0 100px', marginTop: 100 }} >
            <Breadcrumb >
              <Breadcrumb.Item >
              <Link to={`/daftarlapang/${this.props.match.params.kategori}`} ><Icon type="arrow-left" /> {this.props.match.params.kategori == "futsal" ? "Futsal" : "Badminton"}</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item >
                {this.state.dataLapang.nama}
              </Breadcrumb.Item>
            </Breadcrumb>
            <h1>Lapang Sewa</h1>
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
                  extra={<img width={272} marginRight= {100} alt="logo" src={item.imageUrl} />}
                >
                  <List.Item.Meta
                    title={<a href={item.href}>{item.nama}</a>}
                    description={item.harga}
                  />
                  {item.deskripsi}
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
            <Link to ={`${this.props.location.pathname}/tambahlapangsewa`}>
              <Button type="primary" >Tambah Lapang Sewa</Button>
            </Link> 
          </Layout.Content>
          <Layout.Footer style={{ textAlign: 'center' }}>
            Ant Design ©2018 Created by Ant UED
          </Layout.Footer>
        </Layout> 
    )
  }
}

export default LapangSewa;