import Link from 'next/link';
import UserAuth from './UserAuth';

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
            <li><Link href="/videos" as="/videos"><a>Arkiv</a></Link></li>
            <li><Link href="/members" as="/members"><a>Medlemmer</a></Link></li>
        </ul>
        <UserAuth />
      </nav>

    <style jsx>{`
        #header-logo {
            padding: 30px 0;
        }

        nav ul {
            padding: 0;
            display: block;
            background: #535151;
            text-color: white;
            font-family: 'Roboto', sans-serif;
            font-size: 20pt;
            margin: 0;
        }

        nav li {
            display: inline-block;
            margin-left: 30px;
        }

        nav a {
            text-decoration: none;
            text-transform: lowercase;
        }
        nav a:link {
            color: #ddd;
        }
        nav a:visited {
            color: white;
        }
        nav a:hover {
            color: white;
        }
        nav a:active {
            color: white;
        }
        `}</style>
    </header>
    );

export default Header;
