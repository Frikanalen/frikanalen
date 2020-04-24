import Layout from '../components/Layout';
import LiveNow from '../components/LiveNow';

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});
export default function index() {
  return (
    <Layout>
      <LiveNow/>
    </Layout>
  );
}
