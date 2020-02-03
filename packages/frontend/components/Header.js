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
                    <a><img className="logo" src="/static/frikanalen.png" alt="Frikanalen" /></a>
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
                #header-logo>a>img {
                    padding: 30px 0;
                    padding-left: 50px;
                }

                .headerLinks {
                    padding: 0 30px;
                    padding-left: 50px;
                    background: #535151;
                    display: flex;
                    font-family: 'Roboto', sans-serif;
                    font-weight: 700;
                    font-size: 20pt;
                    flex-wrap: wrap;
                }

                @media screen and (max-width: 500px) {
                  .headerLinks>a {
                      max-width: 40%;
                  }
                }

                @media screen and (max-width: 800px) {
                  img.logo {
                      margin: 0 auto;
                  }
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
