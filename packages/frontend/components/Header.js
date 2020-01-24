import Link from 'next/link';

const Header = () => (
    <header>
      <div id="header-logo">
        <Link href="/">
            <a><img src="/static/frikanalen.png" alt="Frikanalen" /></a>
        </Link>
      </div>

      <nav className="top-nav">
        <ul>
          <li><Link href="/schedule" as="/schedule"><a>Sendeplan</a></Link></li>
            <li>
              <div className="login_box">
                <form action="/login/" method="POST">
                  <input id="id_username" type="text" name="username"
                      placeholder="email" maxLength="30" />
                  <input id="id_password" type="password" name="password"
                      placeholder="password" maxLength="4096" />
                  <input type="submit" value="Log in" />
                  <input type="hidden" name="next" value="/" />
                </form>
                ...or <a href="/register/">register</a>
              </div>
            </li>
        </ul>
      </nav>

    <style jsx>{`

        #container {
            position: relative;
            min-height: 100%;
            max-width: 920px;
            margin: 0 auto;
            padding: 0;
        }

        #header-container {
        }

        #header-logo {
            padding: 30px 0;
            display: inline-block;
        }

        #header-title {
            font-size: 16pt;
            color: #5C4A31 ;
        }

        #content {
        }

        #spacer {
            height: 1.7em;
        }


        .top-nav {
            display: inline-block;
            position: relative;
            top: -5px;
        }
        .top-nav ul {
            margin: 0;
            margin-bottom: 20px;
        }
        .top-nav li {
            display: inline-block;
            margin-left: 30px;
        }
        .top-nav a {
            text-decoration: none;
        }
        .top-nav form { display: inline-block }
        .top-nav input[type=text], .top-nav input[type=password] {
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

        .navigation_container {
            clear: left;
            display: flex;
            justify-content: space-evenly;
        }

        #right_bar {
            float: right;
            width: 300px;
        }

        .search {
            position: absolute;
            top: 120px;
            right: 0;
        }
        `}</style>
    </header>
    );

export default Header;
