import Nav from "react-bootstrap/Nav";
import Link from "next/link";
import React, { Component } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import NavDropdown from "react-bootstrap/NavDropdown";
import configs from "./configs";

function delete_local_session() {
  Cookies.remove("token");
  localStorage.removeItem("userID");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userFirstName");
  localStorage.removeItem("userLastName");
  localStorage.removeItem("userMSISDN");
  localStorage.removeItem("userIsStaff");
}

class UserAuth extends Component {
  logout() {
    delete_local_session();
    this.setState({ loggedIn: false, email: "" });
  }

  render() {
    if (!this.state.loggedIn) {
      return <Nav.Link href="/login">Logg inn/registrer</Nav.Link>;
    } else {
      return (
        <div>
          <NavDropdown className="userdropdown" title={this.state.email}>
            <Link href="/profile" passHref>
              <NavDropdown.Item>Brukerside</NavDropdown.Item>
            </Link>
            <NavDropdown.Item onClick={this.boundLogout}>Logg ut</NavDropdown.Item>
          </NavDropdown>
          <style jsx global>{`
            .userdropdown > a {
              color: #eee !important;
            }
          `}</style>
        </div>
      );
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      email: "",
    };
    this.boundLogout = this.logout.bind(this);
  }

  static async login(email, password) {
    try {
      var response = await axios.get(configs.api + "obtain-token", {
        auth: {
          username: email,
          password: password,
        },
      });
      if (typeof document !== "undefined") {
        Cookies.set("token", response.data.key);
      }
      localStorage.setItem("userID", response.data.user);
      return true;
    } catch (error) {
      if (error.response) {
        if (error.response.status == 401) return "Feil brukernavn/passord";
        else return "Serverfeil!";
      } else {
        return "Nettverksfeil!";
      }
    }
  }

  static async refreshLocalStorage() {
    try {
      var response = await axios.get(configs.api + "user", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + Cookies.get("token"),
        },
      });

      localStorage.setItem("userID", response.data.id);
      localStorage.setItem("userEmail", response.data.email);
      localStorage.setItem("userFirstName", response.data.first_name);
      localStorage.setItem("userLastName", response.data.last_name);
      localStorage.setItem("userMSISDN", response.data.phone_number);
      localStorage.setItem("userIsStaff", response.data.is_staff);
    } catch (error) {
      console.log("Encountered the following while attempting to refresh user profile");
      console.log(error);
      delete_local_session();
    }
  }

  static async verifySession() {
    if (Cookies.get("token")) {
      await UserAuth.refreshLocalStorage();
    }
  }

  componentDidMount() {
    UserAuth.verifySession().then((result) => {
      this.setState({
        loggedIn: localStorage.getItem("userID") ? true : false,
        email: localStorage.getItem("userEmail"),
      });
    });
  }

  static async profile_data() {
    if (localStorage.getItem("userID") == null) {
      await refreshLocalStorage();
    }
    return {
      id: localStorage.getItem("userID"),
      email: localStorage.getItem("userEmail"),
      firstName: localStorage.getItem("userFirstName"),
      lastName: localStorage.getItem("userLastName"),
      isStaff: localStorage.getItem("userIsStaff"),
    };
  }
}

export default UserAuth;
