import React, { Component } from 'react';
import { Layout, Menu, Avatar, Breadcrumb, Dropdown, Icon, Table, List, Button,Form, Input, Modal } from 'antd';
import firebase from 'firebase';
import moment from 'moment';
import _ from 'lodash';
import {Redirect} from 'react-router-dom';
 class TambahLapangSewa extends Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values)=> {
            if(!err){
                console.log("received values", values);
            }
            firebase.firestore().collection('lapang sewa').add({
                deskripsi: values.deskripsi,
                harga: values.harga,
                nama: values.nama
            }).then(() => {
                this.props.history.push('/lapangsewa')
            })
        });
    }

    render(){
        const { getFieldDecorator} = this.props.form;
        return (
            
            <Form labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} onSubmit={this.handleSubmit}>
                <Form.Item label="Deskripsi"
                >
                {getFieldDecorator('deskripsi', {
                    rules: [{ required: true, message: 'Please input your note!' }],
                })(
                    <Input />
                )}
                </Form.Item>
                <Form.Item label="Harga">
                {getFieldDecorator('harga', {
                    rules: [{ required: true, message: 'Please input your Jalan!' }],
                })(
                    <Input />
                )}
                </Form.Item>
                <Form.Item label="nama"
                >
                {getFieldDecorator('nama', {
                    rules: [{ required: true, message: 'Please input your kabupaten!' }],
                })(
                    <Input />
                )}
                </Form.Item>
                <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        )
    }

}
const WrappedApp = Form.create({ name: 'coordinated' })(TambahLapangSewa);
export default WrappedApp ;