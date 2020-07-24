import Nav from 'react-bootstrap/Nav'
import React, { Component } from 'react';
import axios from 'axios'
import * as env from './constants';
import Cookies from 'js-cookie'
import NavDropdown from 'react-bootstrap/NavDropdown'

class UserAuth extends Component {
    logout() {
        Cookies.remove('token')
        localStorage.removeItem("user-id")
        localStorage.removeItem("user-email")
        localStorage.removeItem("user-first_name")
        localStorage.removeItem("user-last_name")
        localStorage.removeItem("user-is_staff")
        this.setState({loggedIn: false, email: ''})
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
            loggedIn: false,
            email: ''
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
            }
            localStorage.setItem("user-id", response.data.user)
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

        try {
            console.log('trying with token: ' + Cookies.get('token'))
            var response = await axios.get(apiBaseUrl+'user', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + Cookies.get('token')
                }
            })

            localStorage.setItem("user-id", response.data.id)
            localStorage.setItem("user-email", response.data.email)
            localStorage.setItem("user-first_name", response.data.first_name)
            localStorage.setItem("user-last_name", response.data.last_name)
            localStorage.setItem("user-is_staff", response.data.is_staff)
        } catch (error) {
            console.log('Encountered the following while attempting to refresh user profile')
            console.log(error)
            await logout()
        }
    }

    static async verifySession() {
        if(Cookies.get('token')) {
            await UserAuth.refreshLocalStorage()
        }
    }

    componentDidMount() {
        console.log(localStorage.getItem('user-id'))
        UserAuth.verifySession().then(result => {
            console.log('lol')
            console.log(result)
            this.setState({
                loggedIn: localStorage.getItem("user-id") ? true : false,
                email: localStorage.getItem("user-email"),
            })
        }
        )
    }


    static async profile_data() {
        if (localStorage.getItem('user-id') == null) {
            await refreshLocalStorage()
        }
    }
}

export default UserAuth;
