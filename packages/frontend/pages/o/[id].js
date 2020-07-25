import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'

import configs from '../../components/configs'
import Layout from '../../components/Layout';
import WindowWidget from '../../components/WindowWidget';

import useSWR from 'swr'
import axios from 'axios'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

const AuthenticatedFetcher = url => axios.get(url, {
    headers: { 'Authorization': 'Token ' + Cookies.get('token') }
    }).then(res => res.data)

function OrganizationFetcher(id) {
    const { data, error } = useSWR(configs.api + 'organization/' + id, AuthenticatedFetcher)

    return {
        org: data,
        isLoading: !error && !data,
        isError: error
    }
}

const Organization = () => {
  const router = useRouter()
  const { id } = router.query
  const { org, isLoading, isError } = OrganizationFetcher(id)

  if(isLoading) return (<Spinner animation="border" variant="primary" />)
  if(isError) {
      const e = new Error("Response not found");
      e.code = "ENOENT";  // Triggers a 404
      throw e;
    }
    

  return (
      <Layout>
      <WindowWidget>
      <h1>{org.name}</h1>
      </WindowWidget>
      </Layout>
  )
}

export default Organization
