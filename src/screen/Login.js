import {
  Form, Icon, Input, Button, Checkbox,
} from 'antd';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import firebase from 'firebase';
import Home from './Home';
import {LOGIN_SUCCESS} from '../../src/store/action';
 
class NormalLoginForm extends React.Component {
  state= {
      email: '',
      password: '',
  }
  

  login = () => {
    const { putUser } = this.props;
    const { email, password } = this.state;
    firebase.auth().signInWithEmailAndPassword(email, password).then((data)=> {
      firebase.firestore().collection("user").doc(data.user.uid).get().then(function(doc){
        console.log(doc.data())
        putUser({
          dataAuth: data,
          dataStore: doc.data()
        })
      }).catch(err => {
        console.log(err);
      })
    }).catch(err => {
      console.log(err);
    });
  }

  onChangeEmail = (data) => {
    this.setState({ email: data.target.value });
  }

  onChangePass = (data) => {
    this.setState({ password: data.target.value });
  }

  render() {
    const { user, putUser } = this.props
    return (
      <div style={{ alignSelf: "center", margin: "0px 300px", borderWidth: 1 }}>
        <Input value={this.state.email} placeholder={"Email..."} onChange={this.onChangeEmail} />
        <Input type="password" value={this.state.password} placeholder={"Password..."} onChange={this.onChangePass} />
        <Button onClick={this.login} >Login</Button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user
})
const mapDispatchToProps = dispatch => ({
  putUser: user => dispatch({
      type: LOGIN_SUCCESS,
      user: user 
  })
})

export default connect(mapStateToProps,mapDispatchToProps)(NormalLoginForm); 