import React, { Component } from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import Home from './screen/Home';
import Login from './screen/Login';
import Transaksi from './screen/Transaksi';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import DaftarLapangFutsal from './screen/DaftarLapangFutsal';
import BuatLapang from './screen/BuatLapang';
import DaftarLapangBadminton from './screen/DaftarLapangBadminton';
import LapangSewa from './screen/LapangSewa';
import TambahLapangSewa from './screen/TambahLapangSewa';
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
					<Route exact path="/daftarlapang/badminton" render={(props) => <DaftarLapangBadminton {...props}/>} />
					<Route exact path="/daftarlapang/futsal" render={(props) => <DaftarLapangFutsal {...props}/>} />
					<Route exact path="/buatlapang" render={(props) => <BuatLapang {...props}/>}/>
					<Route exact path="/lapangsewa" render={(props) => <LapangSewa {...props}/>}/>
					<Route exact path="/tambahlapangsewa" render={(props) => <TambahLapangSewa {...props}/>}/>
					
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