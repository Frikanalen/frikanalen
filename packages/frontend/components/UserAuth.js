import Link from 'next/link';
import { instanceOf } from 'prop-types';
import * as env from './constants';
import React, { Component } from 'react';
import cookies from 'next-cookies';
import fetch from 'isomorphic-unfetch';

class PlayoutAdmin extends Component {
}

class UserAuth extends Component {
    constructor(props) {
        super(props);
        this.handle_login_form = this.handle_login_form.bind(this);
        this.handle_logout = this.handle_logout.bind(this);
        this.email = React.createRef();
        this.password = React.createRef();
        this.handle_logout = this.handle_logout.bind(this);
        this.get_token = this.get_token.bind(this);
        this.state = {
            token: cookies(props).token || null,
            showLogin: false
        };
        this.load_profile_data();
    }


    showLogin() {
        this.setState ({
            showLogin: true,
        })
    }

    logged_in_nav = () => {
        var staff_button;
        if (this.state.is_staff) {
            staff_button = (
                <div>
                <Link href="/playout" as="/playout">
                <a>playout</a>
                </Link>
                <style>{`
                    a {
                        color: #460d0d; //#be0e0e;
                    }
                `}</style>
                </div>
            )
        } else {
            staff_button = <></>
        }
        return (
            <div className="user_nav">
            <div className="user_id_box">
            <div className="material-icons">account_box</div>
            <div className="username">{this.state.email}</div>
            </div>
            { staff_button }
            <div onClick={this.handle_logout}>logg ut</div>
            <style jsx>{`
            .user_nav {
                font-family: 'Roboto', sans-serif;
                font-weight: 700;
                display: flex;
                flex-wrap: no-wrap;
                align-items: center;
                align-content: stretch;
                height:32px;
                padding-left: 0px;
            }
            .user_nav>div {
                margin-right: 10px
            }
            div {
                padding: 2px 10px;
                color: black;
            }
            .user_id_box {
                display: flex;
                align-items: center;
                background-color: white;
                opacity: 0.7;
                color: black;
                padding: 0;
                margin: 0 20px 0 0;
            }
            .username {
                font-size: 16px;
                padding: 2px;
            }
            .material-icons {
                vertical-align: middle;
                line-height: inherit;
                padding: 0;
                padding-left: 1px;
            }
            @media screen and (max-width: 630px) {
                .user_id_box {
                    padding: 0px 1px;
                }
                .user_nav {
                    font-size: 11pt;
                }
            }
            `}</style>
            </div>
        );
    };

    loginOrRegisterPrompt = () => {
        return (
            <div className="login_prompt">
            <form id="login" onSubmit={this.handle_login_form} />
            <input form="login" id="email" type="text" 
            ref={this.email} placeholder="epost" maxLength="30" />
            <input form="login" id="password" type="password" 
            ref={this.password} placeholder="passord" maxLength="4096" />
            <div id="breaker"></div>
            <input id="login_button" form="login" type="submit" value="logg inn" />
            <div className="eller">…eller</div>
            <Link href="/register/"><button>registrer ny bruker</button>
            </Link>
            <style jsx>{`
            .login_prompt {        
                    min-height: 32px;
                    display: flex;
                    flex-wrap: wrap;
                    align-items: baseline;
                    align-content: center;
                }
                @media screen and (max-width: 630px) {
                    .login_prompt {        
                        flex-basis: 100%;
                        justify-content: flex-start;
                    }
                    input, button {
                    }
                    #breaker {
                      flex-basis: 100%;
                      height: 0;
                    }
                    .login_prompt>input, .login_prompt>button, {
                        flex-grow: 1;
                    }
                }

                form {
                    display: none;
                }
                .eller {
                    margin: 0 3px 0 8px;
                    flex-grow: 0;
                }

                input, button {
                    font-family: 'Roboto', sans-serif;
                    font-weight: bold;
                    font-size: 12pt;
                }
                @media screen and (max-width: 1024px) {
                    input, button {
                        font-size: 8pt;
                    }
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
                user_bar= this.loginOrRegisterPrompt();
            else
                return null;
        }
        if(typeof window !== 'undefined') {
            return (
                <div className="userBar">
                {user_bar}
                <style jsx>{`
            .userBar {
                min-height: 32px;
                padding: 0 0 0 50px;
                color: #ddd;
                background-color: #3f913f;
                font-family: 'Roboto', sans-serif;
                font-weight: bold;
            }
            @media screen and (max-width: 1024px) {
                .userBar {
                    padding: 0 0 0 5px;
                }
            }
            `}</style>
                </div>
            );
        } else { 
            return null;
        }
    };

    handle_logout = () => {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';

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
                    is_staff: json.is_staff,
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
                document.cookie = `token=${json.key}; path=/`;
                this.setState({
                    token: json.key,
                });
                this.load_profile_data();
                this.setState({
                    token: json.key,
                });
            })
            .catch(e => console.log(e));
    }
}

export default UserAuth;
