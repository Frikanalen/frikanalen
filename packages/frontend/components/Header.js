import Link from 'next/link';
import React, { Component } from 'react';
import UserAuth from './UserAuth';

class Header extends Component {
    constructor(props) {
        super(props)
        this.userbar = React.createRef();
        this.loginButton = React.createRef();
        this.showLogin = this.showLogin.bind(this)
    }

    showLogin() {
        if(this.userbar.current)
            this.userbar.current.showLogin();
    }

    render () {
        const userauth = < UserAuth ref={this.userbar} />
        return (
            <header>
              <div id="header-logo">
                <Link href="/" as="/">
                    <a><img className="logo" src="/static/frikanalen.png" alt="Frikanalen" /></a>
                </Link>
              </div>

              <nav>
                <div className="headerLinks">
                    <Link href="/" as="/"><a>Direkte</a></Link>
                    <Link href="/om" as="/om"><a>Om oss</a></Link>
                    <a onClick={this.showLogin} >Logg inn</a>
                </div>
                { userauth }
              </nav>


            <style jsx>{`
                #header-logo>a>img {
                    padding: 30px 0;
                    padding-left: 50px;
                }

                .headerLinks {
                    padding: 0 30px;
                    padding-bottom: 2px;
                    padding-left: 50px;
                    background: black;
                    display: flex;
                    font-family: 'Roboto', sans-serif;
                    font-weight: bold;
                    font-size: 20pt;
                    flex-wrap: wrap;
                }

                @media screen and (max-width: 500px) {
                  .headerLinks>a {
                      max-width: 40%;
                  }
                }

                .headerLinks>a {
                    margin: 0;
                    margin-right: 17px;
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
                @media screen and (max-width: 1024px) {
                    #header-logo>a>img {
                        padding: 5px 0;
                    }
                    .headerLinks {
                        font-size: 14pt;
                        padding-left: 5px;
                    }
                }
                @media screen and (max-width: 800px) {
                  img.logo {
                      display: block;
                      margin: 0 auto;
                      padding: 10px 0;
                  }
                }

                `}</style>
            </header>
        );
    }
}

export default Header;
