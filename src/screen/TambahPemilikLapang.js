import React from 'react';
import { Layout, Form, Input, Upload, message, Icon, Button, Select } from 'antd';
import firebase from 'firebase';

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

class TambahPemilik extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: '',
      fullPath: '',
      listLapang: [],
      confirmDirty: false,
    }
  }

  async componentDidMount() {
    let data = []
    await firebase.firestore().collection('lapang').get().then(docs => {
      docs.forEach(doc => {
        data.push({
          nama: doc.data().nama,
          kategori: doc.data().kategori,
          kabupaten: doc.data().kabupaten,
          id: doc.id
        });
      });
    });
    this.setState({ listLapang: data })
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const imagePath = await firebase.storage().ref().child(this.state.fullPath).getDownloadURL();
        firebase.auth().createUserWithEmailAndPassword(values.email, values.password).then(async user => {
          console.log(firebase.auth().currentUser);
          await firebase.auth().currentUser.updateProfile({
            displayName: values.nama,
            photoURL: imagePath,
            phoneNumber: values.phone
          });
          await firebase.firestore().collection('user').doc(firebase.auth().currentUser.uid).set({
            nama: values.nama,
            alamat: values.alamat,
            email: values.email,
            role: 2,
            noTelp: values.phone,
            avatar: imagePath,
            lapangId: firebase.firestore().collection('lapang').doc(values.lapang)
          }).then(() => {
            this.props.history.push('/daftarpemilik');
          });
        });
      }
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

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 10 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 10 },
        sm: { span: 6 },
      },
    };
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return(
      <Layout >
        <MainHeader />
        <Layout.Content style={{ padding: '0 50px', marginTop: 100 }}>
          <h1>Tambah Pemilik Lapang</h1>
          <Form {...formItemLayout} onSubmit={this.handleSubmit} >
            <Form.Item label="Nama" >
              {getFieldDecorator('nama', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your name!',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="Email" >
              {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please input your E-mail!',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="Password" hasFeedback>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                  {
                    validator: this.validateToNextPassword,
                  },
                ],
              })(<Input.Password />)}
            </Form.Item>
            <Form.Item label="Confirm Password" hasFeedback>
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  {
                    validator: this.compareToFirstPassword,
                  },
                ],
              })(<Input.Password onBlur={this.handleConfirmBlur} />)}
            </Form.Item>
            <Form.Item label="Phone Number">
              {getFieldDecorator('phone', {
                rules: [{ required: true, message: 'Please input your phone number!' }],
              })(<Input placeholder="08XXXXXXXXXX" style={{ width: '100%' }} />)}
            </Form.Item>
            <Form.Item label="Alamat" >
              {getFieldDecorator('alamat', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your alamat!',
                  },
                ],
              })(<Input.TextArea rows={4} />)}
            </Form.Item>
            <Form.Item label="Avatar" >
              {getFieldDecorator('avatar', {
                rules: [
                ],
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
            <Form.Item label="Lapang" hasFeedback >
              {getFieldDecorator('lapang', {
                rules: [{ required: true, message: 'Please select your lapang!' }],
              })(
                <Select placeholder="Please select lapang" >
                  {this.state.listLapang.map(item => {
                    return(
                      <Select.Option key={item.id} value={item.id} >{item.nama} {item.kategori} {item.kabupaten}</Select.Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
            <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
              <Button onClick={() => this.props.history.goBack()} type="danger">
                Cancel
              </Button> <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Layout.Content>
        <Layout.Footer style={{ textAlign: 'center' }}>
          Ant Design ©2018 Created by Ant UED
        </Layout.Footer>
      </Layout>
    );
  }
}

export default Form.create({ name: 'register' })(TambahPemilik);