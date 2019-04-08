import React, { Component } from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import Home from './screen/Home';
import Login from './screen/Login';
import Transaksi from './screen/Transaksi';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import DaftarLapang from './screen/DaftarLapang';

class Routing extends Component {
	render(){
		const { user } = this.props;
		return(
			<Router>
				<div>
					<Route exact path="/login" render={(props) => user && user.dataStore.role == 3 ? <Redirect to='/' /> : <Login {...props} />}/>
					<Route exact path="/" render={(props) => <Home {...props}/>} />
					<Route exact path="/transaksi" render={(props) => <Transaksi {...props}/>} /> 
					<Route exact path="/daftarlapang" render={(props) => <DaftarLapang {...props}/>} /> 
				</div>
			</Router>
		)
	}

}

const mapStateToProps = state => ({
	user: state.user.user
})

const mapDispatchToProps = dispatch => ({
})

export default  connect(mapStateToProps, mapDispatchToProps)(Routing);