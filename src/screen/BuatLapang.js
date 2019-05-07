import React, { Component } from 'react';
import { Layout, Menu, Avatar, Breadcrumb, Dropdown, Icon, Table, List, Button,Form, Input, Modal } from 'antd';
import firebase from 'firebase';
import moment from 'moment';
import _ from 'lodash';
import {Redirect} from 'react-router-dom';
import ImageUpload from '../Component/ImageUpload';
import FormItem from 'antd/lib/form/FormItem';
 class BuatLapang extends Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values)=> {
            if(!err){
                console.log("received values", values);
            }
            firebase.firestore().collection('lapang').add({
                nama: values.nama,
                jalan: values.jalan,
                kabupaten: values.kabupaten
            }).then(() => {
                this.props.history.push('/daftarlapang')
            })
        });
    }

    render(){
        const { getFieldDecorator} = this.props.form;
        return (
            
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
                <FormItem>
                    <ImageUpload />
                </FormItem>
                <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        )
    }

}
const WrappedApp = Form.create({ name: 'coordinated' })(BuatLapang);
export default WrappedApp ;