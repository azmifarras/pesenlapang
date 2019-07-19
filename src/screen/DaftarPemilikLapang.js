import React from 'react';
import { Layout, Button, Icon, Table, Avatar, Form, Modal, Input, Select, Upload, message } from 'antd';
import firebase from 'firebase';
import { Link } from 'react-router-dom';
import _ from 'lodash';

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

const columns = [
  {
    title: 'Avatar',
    dataIndex: 'avatar',
    key: 'avatar',
    render: (avatar) => (
      <Avatar size="large" src={avatar} />
    )
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
    title: 'No Telepon',
    dataIndex: 'notelp',
    key: 'notelp'
  },
  {
    title: 'Lapang',
    dataIndex: 'lapang',
    key: 'lapang'
  },
  {
    title: 'Kategori',
    dataIndex: 'kategori',
    key: 'kategori'
  },
  {
    title: 'Alamat',
    dataIndex: 'alamat',
    key: 'alamat'
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <span >
        <Button type="primary" onClick={() => record.onUpdate(record)} >Update</Button> <Button type="danger" onClick={() => record.onDelete(record.key)} >Delete</Button>
      </span>
    )
  }
]
// Update Nama, phone number, alamat, avatar, lapang
const CreateFormModal = Form.create({ name: 'update' })(
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        imageUrl: this.props.record.avatar,
        fullPath: '',
        loading: false
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
  
    customUpload = async ({ onError, onSuccess, file }) => {
      const storage = firebase.storage()
      const metadata = {
        contentType: 'image/jpeg'
      }
      const storageRef = await storage.ref()
      const imageName = create_UUID() //a unique name for the image
      const imgFile = storageRef.child(`Users/${imageName}.png`)
      try {
        const image = await imgFile.put(file, metadata);
        this.setState({ fullPath: image.metadata.fullPath });
        onSuccess(null, image)
      }
      catch(e) {
        onError(e);
      }
    }

    componentDidUpdate(prevProps) {
      if(!_.isEqual(this.props, prevProps)) {
        this.setState({ imageUrl: this.props.record.avatar });
      }
    }

    render() {
      const { visible, onCancel, onCreate, form, record, listLapang } = this.props;
      const { getFieldDecorator } = form
      const uploadButton = (
        <div>
          <Icon type={this.state.loading ? 'loading' : 'plus'} />
          <div className="ant-upload-text">Upload</div>
        </div>
      );

      return(
        <Modal
          visible={visible}
          title="Update Pemilik Lapang"
          okText="Update"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical" >
            <Form.Item label="Nama">
              {getFieldDecorator('nama', {
                rules: [{ required: true, message: 'Please input your name!' }],
                initialValue: record.nama
              })(<Input />)}
            </Form.Item>
            <Form.Item label="No Telepon">
              {getFieldDecorator('notelp', {
                rules: [{ required: true, message: 'Please input your phone number!' }],
                initialValue: record.notelp
              })(<Input />)}
            </Form.Item>
            <Form.Item label="Alamat">
              {getFieldDecorator('alamat', {
                rules: [{ required: true, message: 'Please input your alamat!' }],
                initialValue: record.alamat
              })(<Input.TextArea rows={4} />)}
            </Form.Item>
            <Form.Item>
            {getFieldDecorator('imageURL', {
                initialValue: this.state.fullPath ? this.state.fullPath : this.state.imageUrl
              })(
                <Input style={{ display: "none" }} />
              )}
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
            </Form.Item>
            <Form.Item label="Lapang" hasFeedback >
              {getFieldDecorator('lapang', {
                rules: [{ required: true, message: 'Please select your lapang!' }],
                initialValue: record.lapangId
              })(
                <Select placeholder="Please select lapang" >
                    {listLapang.map(item => {
                    return(
                      <Select.Option key={item.id} value={item.id} >{item.nama} {item.kategori} {item.kabupaten}</Select.Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);

class DaftarPemilikLapang extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listPemilik: [],
      loading: true,
      recordUpdate: {},
      recordDelete: '',
      visible: false,
      listLapang: []
    }
    this.onUpdate = this.onUpdate.bind(this);
  }

  onUpdate(record) {
    console.log(record);
    this.setState({ recordUpdate: record, visible: true })
  }

  handleCreate = () => {
    const { form } = this.formRef.props;

    let imagePath = '';

    form.validateFields(async (err, values) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', values);

      const regex = RegExp('^(http|https)://');

      imagePath = values.imageURL;

      if(!regex.test(values.imageURL)) {
        console.log('masuk sini')
        imagePath = await firebase.storage().ref().child(values.imageURL).getDownloadURL();
      }
      
      firebase.firestore().collection('user').doc(this.state.recordUpdate.key).update({
        alamat: values.alamat,
        lapangId: firebase.firestore().collection('lapang').doc(values.lapang),
        nama: values.nama,
        noTelp: values.notelp,
        avatar: imagePath
      });
      form.resetFields();
      this.setState({ visible: false });
    });
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  onDelete = (key) => {
    console.log(key);
    this.setState({ recordDelete: key })
  }

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  async componentDidMount() {
    let data = [], dataLapang = [];

    await firebase.firestore().collection('user').where('role', '==', 2).get().then(doc => {
      doc.forEach(async item => {
        let lapang = await item.data().lapangId.get();
        console.log(item.data(), lapang.data());
        data.push({
          key: item.id,
          avatar: item.data().avatar,
          nama: item.data().nama,
          email: item.data().email,
          notelp: item.data().noTelp ? item.data().noTelp : null,
          lapang: lapang.data() ? lapang.data().nama : '',
          kategori: lapang.data() ? lapang.data().kategori : '',
          lapangId: lapang.data() ? lapang.id : '',
          alamat: item.data().alamat,
          onUpdate: (record) => this.onUpdate(record),
          onDelete: this.onDelete
        });
      });
    }).catch(err => {
      console.log(err);
    });

    await firebase.firestore().collection('lapang').get().then(docs => {
      docs.forEach(doc => {
        dataLapang.push({
          nama: doc.data().nama,
          kategori: doc.data().kategori,
          kabupaten: doc.data().kabupaten,
          id: doc.id
        });
      });
    });

    setTimeout(() => this.setState({ listPemilik: data, loading: false, listLapang: dataLapang }), 2000);
  }

  render() {
    return(
      <Layout >
        <MainHeader selected="4" />
        <Layout.Content style={{ padding: '0 50px', marginTop: 100 }}>
          <h1 >Daftar Pemilik Lapang</h1>
          <Link to="/tambahpemilik" ><Button ><Icon type="plus" />Tambah Pemilik Lapang</Button></Link>
          <Table loading={this.state.loading} style={{ marginTop: 10 }} columns={columns} dataSource={this.state.listPemilik} />
          <CreateFormModal
            wrappedComponentRef={this.saveFormRef}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            record={this.state.recordUpdate}
            listLapang={this.state.listLapang}
          />
        </Layout.Content>
        <Layout.Footer style={{ textAlign: 'center' }}>
          Ant Design ©2018 Created by Ant UED
        </Layout.Footer>
      </Layout>
    );
  }
}

export default DaftarPemilikLapang;