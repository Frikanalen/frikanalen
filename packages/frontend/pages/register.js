import Layout from '../components/Layout';
import * as env from '../components/constants';

export default function About() {
  return (
    <Layout>
      <main>
      <h2>Beklager!</h2>
      <p>Funksjon for brukerregistrering er ikke på plass enda.</p>
      <p>Vennligst send en epost til leder for Frikanalen, <a href="mailto:post@frikanalen.no">Ola Tellesbø</a>.</p>
      </main>
      <style jsx>{`
            main {
                padding: 20px 50px;
                font-family: 'Roboto', sans-serif;
                background: #535151;
                max-width: 100%;
                width: 1024px;
            }

            main h2 {
                color: white;
            }

            main p {
                color: #ddd;
            }
            `}</style>
      </Layout>
  );
}

