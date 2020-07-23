import Nav from 'react-bootstrap/Nav'
import React, { Component } from 'react';
import axios from 'axios'
import * as env from './constants';
import Cookies from 'js-cookie'
import NavDropdown from 'react-bootstrap/NavDropdown'

class UserAuth extends Component {
    logout() {
        console.log('hi')
        Cookies.remove('token')
        localStorage.removeItem('user-id')
        this.setState({loggedIn: false})
    }

    render () {
        if (!this.state.loggedIn) {
            return (<Nav.Link href="/login">Logg inn/registrer</Nav.Link>)
        } else {
            return (
                <div>
                <NavDropdown className="userdropdown" title={this.state.email}>
                    <NavDropdown.Item onClick={this.logout}>Logg ut</NavDropdown.Item>
                </NavDropdown>
                <style jsx global>{`
                    .userdropdown > a { 
                        color: #eee !important;
                    }
                `}</style>
                </div>
            )
        }
    }
    constructor (props) {
        super(props)
        this.state = {
            loggedIn: false
        }
        this.logout = this.logout.bind(this)
    }
    static async login(email, password) {
        var apiBaseUrl = "https://frikanalen.no/api/";

        try {
            var response = await axios.get(apiBaseUrl+'obtain-token', {
                auth: {
                    username:email,
                    password:password
                }
            })
            if (typeof document !== 'undefined') {
                Cookies.set('token', response.data.key)
                localStorage.setItem('user-id', response.data.user)
            }
            return true
        } catch (error) {
            if (error.response) {
                if(error.response.status == 401) 
                    return 'Feil brukernavn/passord'
                else
                    return 'Serverfeil!'
            } else {
                return 'Nettverksfeil!'
            }
        }
    }

    static async refreshLocalStorage() {
        var apiBaseUrl = "https://frikanalen.no/api/";

        console.log('lol')
        var response = await axios.get(apiBaseUrl+'user', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + Cookies.get('token')
            }
        })
        console.log(response.data)
        localStorage.setItem("user-email", response.data.email)
        localStorage.setItem("user-first_name", response.data.first_name)
        localStorage.setItem("user-last_name", response.data.last_name)
        localStorage.setItem("user-is_staff", response.data.is_staff)
    }

    componentDidMount() {
        this.setState({
            email: localStorage.getItem("user-email"),
            loggedIn: localStorage.getItem("user-id"),
        })
    }


    static async profile_data() {
        if (localStorage.getItem('user-id') === null) {
            await this.refreshLocalStorage()
        }
    }
}

export default UserAuth;
