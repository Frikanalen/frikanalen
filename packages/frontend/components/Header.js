import Link from 'next/link';

function LoginBox(props) {
    const logged_out_nav = (
        <div>
      <form action="/login/" method="POST">
        <input id="id_username" type="text" name="username"
            placeholder="email" maxLength="30" />
        <input id="id_password" type="password" name="password"
            placeholder="password" maxLength="4096" />
        <input type="submit" value="Log in" />
        <input type="hidden" name="next" value="/" />
      </form> or <a href="/register/">register</a>
        </div>
    );

    const logged_in_nav = (
        <div />
    );

    return (
    <div className="login_box">
        {props.logged_in ? logged_in_nav : logged_out_nav}
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
    );
}

const Header = () => (
    <header>
      <div id="header-logo">
        <Link href="/">
            <a><img src="/static/frikanalen.png" alt="Frikanalen" /></a>
        </Link>
      </div>

      <nav>
        <ul>
            <li><Link href="/schedule" as="/schedule"><a>Sendeplan</a></Link></li>
            <li><LoginBox /></li>
        </ul>
      </nav>

    <style jsx>{`
        #header-logo {
            padding: 30px 0;
        }

        nav {
            display: block;
        }

        nav ul {
            margin: 0;
            margin-bottom: 20px;
        }

        nav li {
            display: inline-block;
            margin-left: 30px;
        }

        nav a {
            text-decoration: none;
        }
        `}</style>
    </header>
    );

export default Header;
