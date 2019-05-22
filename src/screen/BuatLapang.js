import React, { Component } from 'react';
import { Layout, Select, Upload, message, Icon, Table, List, Button,Form, Input, Modal } from 'antd';
import firebase from 'firebase';
import moment from 'moment';
import _ from 'lodash';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';

import ImageUpload from '../Component/ImageUpload';
import MainHeader from '../Component/Header';
import FormItem from 'antd/lib/form/FormItem';

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

class BuatLapang extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      imageUrl: '',
      fullPath: ''
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const imagePath = await firebase.storage().ref().child(this.state.fullPath).getDownloadURL();
    this.props.form.validateFields((err, values)=> {
      if(!err){
        console.log("received values", values);
      }
      firebase.firestore().collection('lapang').add({
        nama: values.nama,
        jalan: values.jalan,
        kabupaten: values.kabupaten,
        kategori: values.kategori,
        imageURL: imagePath
      }).then(() => {
        this.props.history.push('/daftarlapang')
      })
    });
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
    const imgFile = storageRef.child(`Lapang/${imageName}.png`)
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
  const uploadButton = (
    <div>
      <Icon type={this.state.loading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">Upload</div>
    </div>
  );
  return (
    <Layout className="layout" >
      <MainHeader />
      <Layout.Content style={{ padding: '0 100px', marginTop: 100 }} >
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <h1 >
            Buat Lapang
          </h1>
          <Form labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} onSubmit={this.handleSubmit}>
            <Form.Item label="Nama"
            >
            {getFieldDecorator('nama', {
                rules: [{ required: true, message: 'Please input your note!' }],
            })(
                <Input />
            )}
            </Form.Item>
            <Form.Item label="Jalan">
            {getFieldDecorator('jalan', {
                rules: [{ required: true, message: 'Please input your Jalan!' }],
            })(
                <Input />
            )}
            </Form.Item>
            <Form.Item label="Kabupaten"
            >
            {getFieldDecorator('kabupaten', {
                rules: [{ required: true, message: 'Please input your kabupaten!' }],
            })(
                <Input />
            )}
            </Form.Item>
            <Form.Item label="Kategori"
            >
            {getFieldDecorator('kategori', {
                rules: [{ required: true, message: 'Please input your note!' }],
            })(
              <Select defaultValue="Badminton">
                <Select.Option value="Badminton">Badminton</Select.Option>
                <Select.Option value="Futsal">Futsal</Select.Option>
              </Select>
            )}
            </Form.Item>
            <FormItem>
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
            </FormItem>
            <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
          </Form>
        </div>
      </Layout.Content>
      <Layout.Footer style={{ textAlign: 'center' }} >
        Ant Design ©2018 Created by Ant UED
      </Layout.Footer>
    </Layout>
    )
  }
}

const WrappedApp = Form.create({ name: 'coordinated' })(BuatLapang);
export default WrappedApp ;