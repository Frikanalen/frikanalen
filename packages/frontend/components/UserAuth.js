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
            username: ''
        };
    }

    logged_in_nav = () => {
        return (
            <div>
            <button onClick={this.handle_logout}>logg ut</button>
            <style jsx>{`
            button {
                margin: 1px;
                margin-left: 30px;
                color: white;
                background: #333;
                border: 1px solid white;
                text-color: white;
                font-family: 'Roboto', sans-serif;
                font-size: 14pt;
            }
            `}</style>
            </div>
        );
    };

    logged_out_nav = () => {
        return (
            <div>
            <form onSubmit={this.handle_login_form} >
            <input id="email" type="text" ref={this.email}
                placeholder="epost" maxLength="30" />
            <input id="password" type="password" ref={this.password} 
                placeholder="passord" maxLength="4096" />
            <input type="submit" value="Logg inn" />
            </form> eller <a href="/register/">registrer ny bruker</a>
            <style jsx>{`
                input {
                    font-family: 'Roboto', sans-serif;
                    font-size: 12pt;
                }
                input[type=submit] {
                    margin: 1px;
                    color: white;
                    background: #333;
                    border: 1px solid white;
                    text-color: white;
                }
                form { display: inline-block }
                input[type=text], input[type=password] {
                    border: 1px solid black;
                    width: 160px;
                    padding: 1px 4px;
                }
            `}</style>
            </div>
        )
    };

    render = props => {
        let form = null;
        if(this.state.token !== null) {
            form = this.logged_in_nav;
        } else {
            form = this.logged_out_nav;
        }
        return (
            <div className="userBar"> 
            {form()}
            <style jsx>{`
            .userBar {
                padding: 0 40px;
                background: black;
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
    }

    get_token = (email, password) => {
        fetch(env.API_BASE_URL + 'obtain-token', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(email + ":" + password),
            },
        })
        .then(res => res.json())
        .then(json => {
            cookies.set('token', json.key);
            this.setState({
                token: json.key,
                user_id: json.user
            });
        });
    }
}

export default UserAuth;
