import Link from 'next/link';
import React, { Component } from 'react';
import UserAuth from './UserAuth';

class Header extends Component {
    constructor(props) {
        super(props);
        this.showLogin = this.showLogin.bind(this);
        this.state = {
            show_login: false,
        }
    }

    showLogin () {
        this.setState({show_login: true});
    }

    render () {
        return (
            <header>
              <div id="header-logo">
                <Link href="/" as="/">
                    <a><img src="/static/frikanalen.png" alt="Frikanalen" /></a>
                </Link>
              </div>

              <nav>
                <div className="headerLinks">
                    <Link href="/schedule" as="/schedule"><a>Sendeplan</a></Link>
                    <Link href="/videos" as="/videos"><a>Arkiv</a></Link>
                    <Link href="/members" as="/members"><a>Medlemmer</a></Link>
                    <Link href="/about" as="/about"><a>Om oss</a></Link>
                    <a onClick={this.showLogin}>Logg inn</a>
                </div>
                {this.state.show_login? <UserAuth /> : <></>}
              </nav>

            <style jsx>{`
                #header-logo {
                    padding: 30px 0;
                }

                .headerLinks {
                    padding: 0 30px;
                    background: #535151;
                    display: flex;
                    font-family: 'Roboto', sans-serif;
                    font-size: 20pt;
                }

                .headerLinks>a {
                    margin: 0 10px;
                    text-decoration: none;
                    text-transform: lowercase;
                    color: #ddd;
                }
                .headerLinks>a:hover {
                    color: white;
                }
                .headerLinks>a:active {
                    color: white;
                }
                `}</style>
            </header>
        );
    }
}

export default Header;
