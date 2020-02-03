import Link from 'next/link';
import * as env from './constants';
import React, { Component } from 'react';
import { Cookies } from 'react-cookie';
const cookies = new Cookies();

class UserAuth extends Component {
    constructor(props) {
        super(props);
        this.handle_login_form = this.handle_login_form.bind(this);
        this.handle_logout = this.handle_logout.bind(this);
        this.email = React.createRef();
        this.password = React.createRef();
        this.state = {
            token: cookies.get('token') || null,
//            showLogin: false,
            showLogin: true,
        };
    }

    showLogin() {
        this.setState ({
            showLogin: true,
        })
    }

    componentDidMount() {
        if(this.state.token) {
            this.load_profile_data();
        }
    }

    logged_in_nav = () => {
        return (
            <div className="user_nav">
                <div className="user_id_box">
                    <div className="material-icons">account_box</div>
                    <div className="username">{this.state.email}</div>
                </div>
                <div onClick={this.handle_logout}>logg ut</div>
            <style jsx>{`
            .user_nav {
                font-family: 'Roboto', sans-serif;
                font-weight: 700;
                display: flex;
                flex-wrap: no-wrap;
                align-items: center;
            }
            .user_nav>div {
                margin-right: 10px
            }
            .user_id_box {
                display: flex;
                align-items: center;
                background-color: #444;
                padding: 1px 4px;
                margin: 0 20px 0 0;
            }
            .username {
                font-size: calc(inherit - 2pt);
                margin: 0 0 1px 2px;
            }
            .material-icons {
                vertical-align: middle;
                padding-bottom: 1px;
                line-height: inherit;
            }
            `}</style>
            </div>
        );
    };

    loginOrRegisterPrompt = () => {
        return (
            <div className="login_prompt">
            <form onSubmit={this.handle_login_form} >
                <input id="email" type="text" ref={this.email} placeholder="epost" maxLength="30" />
                <input id="password" type="password" ref={this.password} placeholder="passord" maxLength="4096" />
                <input type="submit" value="logg inn" />
            </form>
            <div className="eller">…eller</div>
            <Link href="/register/"><button>registrer ny bruker</button>
            </Link>
            <style jsx>{`
                .login_prompt {
                    display: flex;
                    align-items: baseline;
                }

                .eller {
                    margin: 0 3px 0 8px;
                }

                input, button {
                    font-family: 'Roboto', sans-serif;
                    font-weight: bold;
                    font-size: 12pt;
                }

                input[type=submit], button{
                    margin: 1px;
                    color: black;
                    background: white;
                    border: none;
                }

                input[type=text], input[type=password] {
                    border: 1px solid black;
                    width: 160px;
                    padding: 1px 4px;
                }
                a, a:link{
                    display: inline-block;
                    text-decoration: none;
                    margin: 1px;
                    color: black;
                    background: white;
                    border: none;
                }
            `}</style>
            </div>
        )
    };

    render = props => {
        let user_bar = null;
        if(this.state.token !== null) {
            user_bar = this.logged_in_nav();
        } else {
            if(this.state.showLogin) 
                user_bar = this.loginOrRegisterPrompt();
        }
        return (
            <div className="userBar"> 
            {user_bar}
            <style jsx>{`
            .userBar {
                padding: 0 0 0 50px;
                background: black;
                color: #ddd;
                font-family: 'Roboto', sans-serif;
                font-weight: bold;
            }
            `}</style>
            </div>
        );
    };

    handle_logout = () => {
        cookies.remove('token', { path: '/' })
        this.setState({
            token: null,
            user_id: null
        });
    }

    handle_login_form = (e, data) => {
        e.preventDefault();
        this.get_token(this.email.current.value, this.password.current.value);
    };

    NotLoggedInException() {};

    load_profile_data = () => {
        fetch(env.API_BASE_URL + 'user',  {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + this.state.token,
            }
        })
            .then(res => {
                if (res.status == 401) {
                    throw new this.NotLoggedInException();
                } else {
                    return res.json();
                }
            })
            .then(json => {
                this.setState({
                    email: json.email,
                    first_name: json.first_name,
                    last_name: json.last_name,
                })
            })
            .catch(e => {
                if (e instanceof this.NotLoggedInException) {
                    this.handle_logout();
                } else {
                    throw(e);
                }
            })
    }

    get_token = (email, password) => {
        fetch(env.API_BASE_URL + 'obtain-token', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(email + ":" + password),
            },
        })
            .then(res => {
                if (res.status == 401) {
                    throw new this.NotLoggedInException();
                } else {
                    return res.json();
                }
            })
            .then(json => {
                cookies.set('token', json.key);
                this.setState({
                    token: json.key,
                });
                this.load_profile_data();
            })
            .catch(e => console.log(e));
    }
}

export default UserAuth;
