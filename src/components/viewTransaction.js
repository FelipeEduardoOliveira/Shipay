import React, { Component } from "react";
import { Link } from "react-router-dom";

import Button from "@material-ui/core/Button";
import "../styles/viewTransaction.css";

class NewTransaction extends Component {
  constructor(porps) {
    super(porps);
    this.state = {
      transactions: [],
      serachEstablishment: "",
    };
    this.showListTransaction = this.showListTransaction.bind(this);
  }

  componentDidMount() {
    this.getStorage();
  }
  componentDidUpdate() {
    localStorage.setItem(
      "transaction",
      JSON.stringify(this.state.transactions)
    );
  }
  async getStorage() {
    await this.setState({
      transactions: JSON.parse(localStorage.getItem("transaction")),
    });
  }
  newArray(value) {
    const array = this.state.transactions;
    array.splice(value, 1);

    this.setState({
      transactions: array,
    });
  }
  showListTransaction() {
    const state = this.state;

    if (state.serachEstablishment === "") {
      return state.transactions.map((item, key) => {
        return (
          <tr key={key}>
            <td>{item.establishment}</td>
            <td>{item.client}</td>
            <td>{item.value}</td>
            <td>{item.description}</td>
            <td onClick={() => this.newArray(key)}>Excluir</td>
          </tr>
        );
      });
    } else {
      return state.transactions.map((item, key) => {
        return state.serachEstablishment === item.establishment ? (
          <tr key={key}>
            <td>{item.establishment}</td>
            <td>{item.client}</td>
            <td>{item.value}</td>
            <td>{item.description}</td>
            <td onClick={() => this.newArray(key)}>Excluir</td>
          </tr>
        ) : (
          ""
        );
      });
    }
  }

  estabelecimento() {
    const state = this.state;

    return state.transactions.map((item, key) => {
      return <option key={key}>{item.establishment}</option>;
    });
  }

  render() {
    // const list = this.showListTransaction();

    return (
      <div className="viewTransactionContainer">
        <div>
          <input
            className="findInput"
            list="browsers"
            onChange={(e) =>
              this.setState({
                serachEstablishment: e.target.value,
              })
            }
            placeholder="Estabelecimento"
          />
          <div>
            <datalist id="browsers">{this.estabelecimento()}</datalist>
          </div>
        </div>

        <table>
          <tr>
            <th>Empresa</th>
            <th>Cliente</th>
            <th>Valor</th>
            <th>Descrição</th>
            <th>Deletar</th>
          </tr>
          {this.showListTransaction()}
        </table>

        <div className="divButton">
          <Button variant="contained" color="secondary">
            <Link to="/">Realizar Venda</Link>
          </Button>
        </div>
      </div>
    );
  }
}

export default NewTransaction;
