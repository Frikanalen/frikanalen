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
            <li><UserAuth /></li>
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
