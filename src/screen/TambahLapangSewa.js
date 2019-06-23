import React, { Component } from 'react';
import { Layout, Upload, Avatar, Breadcrumb, Dropdown, Icon, Table, message, Button,Form, Input, Modal } from 'antd';
import firebase from 'firebase';
import moment from 'moment';
import _ from 'lodash';
import {Redirect} from 'react-router-dom';

import MainHeader from '../Component/Header';

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

class TambahLapangSewa extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLapang: {},
      fileList: [],
      previewVisible: false,
      previewImage: '',
      fullPath: ''
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values)=> {
      const imagePath = await firebase.storage().ref().child(this.state.fullPath).getDownloadURL();
      if(!err){
        console.log("received values", values);
      }
      firebase.firestore().collection('lapang sewa').add({
        deskripsi: values.deskripsi,
        harga: values.harga,
        nama: values.nama,
        lapangId: firebase.firestore().doc('/lapang/' + this.props.match.params.lapangId),
        imageUrl: imagePath
      }).then(() => {
        this.props.history.push('../')
      })
    });
  }

  componentDidMount() {
    firebase.firestore().collection('lapang').doc(this.props.match.params.lapangId).get().then(doc => {
      this.setState({ dataLapang: doc.data() })
    })
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

  render(){
    const { getFieldDecorator} = this.props.form;
    const { dataLapang } = this.state
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <Layout className="layout">
        <MainHeader />
        <Layout.Content style={{ padding: '0 100px', marginTop: 100 }} >
          <h1 >Membuat Lapang Sewa {dataLapang.nama}</h1>
          <Form labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} onSubmit={this.handleSubmit}>
            <Form.Item label="Nama"
            >
            {getFieldDecorator('nama', {
              rules: [{ required: true, message: 'Please input your kabupaten!' }],
            })(
              <Input />
            )}
            </Form.Item>
            <Form.Item label="Deskripsi"
            >
            {getFieldDecorator('deskripsi', {
              rules: [{ required: true, message: 'Please input your note!' }],
            })(
              <Input.TextArea rows={4} />
            )}
            </Form.Item>
            <Form.Item label="Harga">
            {getFieldDecorator('harga', {
              rules: [{ required: true, message: 'Please input your Jalan!' }],
            })(
              <Input />
            )}
            </Form.Item>
            <Form.Item label="Gambar">
            {getFieldDecorator('gambar', {
              rules: [{ required: true, message: 'Please input your Jalan!' }],
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
            <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
              <Button onClick={() => this.props.history.goBack()} type="danger" htmlType="submit">
                Cancel
              </Button> <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Layout.Content>
        <Layout.Footer style={{ textAlign: 'center' }} >
          Ant Design ©2018 Created by Ant UED
        </Layout.Footer>
      </Layout>
    )
  }
}
const WrappedApp = Form.create({ name: 'coordinated' })(TambahLapangSewa);
export default WrappedApp;