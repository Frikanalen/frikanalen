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
            <p onClick={this.handle_logout}>Logged in!</p>
        );
    };

    logged_out_nav = () => {
        return (
            <div>
            <form onSubmit={this.handle_login_form} >
            <input id="email" type="text" name="username" ref={this.email}
                placeholder="email" maxLength="30" />
            <input id="password" type="password" name="password" ref={this.password} 
                placeholder="password" maxLength="4096" />
            <input type="submit" value="Log in" />
            </form> eller <a href="/register/">registrer ny bruker</a>
            <style jsx>{`
                form { display: inline-block }
                input[type=text], input[type=password] {
                    width: 80px;
                    padding: 1px 4px;
                }

                .login_box ul {
                    margin: 0;
                }

                .login_box li {
                    display: inline-block;
                    margin-right: 20px;
                }
            `}</style>
            </div>
        )
    };

    render = props => {
        if(this.state.token !== null) {
            return this.logged_in_nav();
        } else {
            return this.logged_out_nav();
        }
    };

    handle_logout = () => {
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
