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
import DaftarPemilik from './screen/DaftarPemilikLapang';
import TambahPemilik from './screen/TambahPemilikLapang';

class Routing extends Component {
	render(){
		const { user } = this.props;
		return(
			<Router>
				<div>
					<Route exact path="/login" render={(props) => user && user.dataStore.role == 3 ? <Redirect to='/' /> : <Login {...props} />}/>
					<Route exact path="/" render={(props) => user && user.dataStore.role == 3 ? <Home {...props}/> : <Redirect to='/login' />} />
					<Route exact path="/transaksi" render={(props) => user && user.dataStore.role == 3 ? <Transaksi {...props}/> : <Redirect to='/login' />} />
					<Route exact path="/daftarlapang" render={(props) => user && user.dataStore.role == 3 ? <DaftarLapang {...props}/> : <Redirect to='/login' />} />
					<Route exact path="/daftarlapang/badminton" render={(props) => user && user.dataStore.role == 3 ? <DaftarLapangBadminton {...props}/> : <Redirect to='/login' />} />
					<Route exact path="/daftarlapang/futsal" render={(props) => user && user.dataStore.role == 3 ? <DaftarLapangFutsal {...props}/> : <Redirect to='/login' />} />
					<Route exact path="/buatlapang" render={(props) => user && user.dataStore.role == 3 ? <BuatLapang {...props}/> : <Redirect to='/login' />}/>
					<Route exact path="/daftarlapang/:kategori/:lapangId" render={(props) => user && user.dataStore.role == 3 ? <LapangSewa {...props}/> : <Redirect to='/login' />}/>
					<Route exact path="/daftarlapang/:kategori/:lapangId/tambahlapangsewa" render={(props) => user && user.dataStore.role == 3 ? <TambahLapangSewa {...props}/> : <Redirect to='/login' />}/>
					<Route exact path="/daftarpemilik" render={(props) => user && user.dataStore.role == 3 ? <DaftarPemilik {...props}/> : <Redirect to='/login' />} />
					<Route exact path="/tambahpemilik" render={(props) => user && user.dataStore.role == 3 ? <TambahPemilik {...props}/> : <Redirect to='/login' />} />
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