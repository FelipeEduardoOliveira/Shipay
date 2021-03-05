import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import NumberFormat from "react-number-format";
import "../styles/NewTransaction.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class NewTransaction extends Component {
  constructor(porps) {
    super(porps);
    this.state = {
      client: "",
      value: "",
      establishment: "",
      description: "",
      errorMensage: "",
      transactions: [],
    };
  }
  componentDidMount() {
    this.setState({
      transactions: JSON.parse(localStorage.getItem("transaction")),
    });
  }
  handleSubmit(e) {
    console.log("chegou");
    e.preventDefault();
    this.validEmptyField();
  }

  validEmptyField() {
    const state = this.state;

    if (state.establishment === "") {
      return this.setState({
        errorMensage: "Digite o numero do estabelecimento",
      });
    }

    if (state.client === "") {
      this.setState({ errorMensage: "Digite o numero do cliente" });

      return;
    }
    if (state.value === "") {
      this.setState({ errorMensage: "Digite o valor da compra" });
      return;
    }
    this.isValidCPF(state.client, state.establishment);
  }

  isValidCPF(cpf, cnpj) {
    if (typeof cpf !== "string") return false;
    cpf = cpf.replace(/[\s.-]*/gim, "");
    if (cpf.length !== 11)
      return this.setState({ errorMensage: "CPF Incompleto" });
    if (
      !cpf ||
      cpf.length !== 11 ||
      cpf === "00000000000" ||
      cpf === "11111111111" ||
      cpf === "22222222222" ||
      cpf === "=33333333333" ||
      cpf === "44444444444" ||
      cpf === "55555555555" ||
      cpf === "66666666666" ||
      cpf === "77777777777" ||
      cpf === "88888888888" ||
      cpf === "99999999999"
    ) {
      this.setState({ errorMensage: "Não caiu aqui" });
    }
    var soma = 0;
    var resto;
    for (var i = 1; i <= 9; i++)
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10)))
      return this.setState({
        errorMensage: "CPF inválido",
      });
    soma = 0;
    for (i = 1; i <= 10; i++)
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11)))
      return this.setState({ errorMensage: "CPF inválido" });
    this.validarCNPJ(cnpj);
  }

  validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, "");

    if (cnpj === "") return false;

    if (cnpj.length !== 14)
      return this.setState({ errorMensage: "CNPJ Incompleto" });

    // Elimina CNPJs invalidos conhecidos
    if (
      cnpj === "00000000000000" ||
      cnpj === "11111111111111" ||
      cnpj === "22222222222222" ||
      cnpj === "33333333333333" ||
      cnpj === "44444444444444" ||
      cnpj === "55555555555555" ||
      cnpj === "66666666666666" ||
      cnpj === "77777777777777" ||
      cnpj === "88888888888888" ||
      cnpj === "99999999999999"
    )
      return false;

    // Valida DVs
    var tamanho = cnpj.length - 2;
    var numeros = cnpj.substring(0, tamanho);
    var digitos = cnpj.substring(tamanho);
    var soma = 0;
    var pos = tamanho - 7;
    for (var i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    var resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== digitos.charAt(0))
      return this.setState({ errorMensage: "CNPJ inválido" });

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== digitos.charAt(1))
      return this.setState({ errorMensage: "CNPJ inválido" });

    // return true;
    this.saveTransaction();
  }

  async saveTransaction() {
    const newTransaction = {
      value: this.state.value,
      establishment: this.state.establishment,
      client: this.state.client,
      description: this.state.description,
    };
    await this.setState({
      transactions: [...this.state.transactions, newTransaction],
    });

    this.setState({
      value: "",
      establishment: "",
      client: "",
      description: "",
    });
    this.saveStorage();
  }

  saveStorage() {
    localStorage.setItem(
      "transaction",
      JSON.stringify(this.state.transactions)
    );
    this.notify();
  }

  notify() {
    toast.success("🦄 Wow so easy!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  render() {
    return (
      <div className="newTransactionContainer">
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <small>{this.state.errorMensage}</small>
          <div className="divInput">
            <NumberFormat
              label="Estabelecimento"
              customInput={TextField}
              value={this.state.establishment}
              onChange={(e) =>
                this.setState({
                  establishment: e.target.value,
                  errorMensage: "",
                })
              }
              className="input"
              format={"##.###.###/####-##"}
            />

            <NumberFormat
              label="Cliente"
              customInput={TextField}
              value={this.state.client}
              onChange={(e) =>
                this.setState({ client: e.target.value, errorMensage: "" })
              }
              className="input"
              format={"###.###.###-##"}
            />
          </div>

          <div className="divInput">
            <NumberFormat
              label="Valor"
              customInput={TextField}
              value={this.state.value}
              onChange={(e) =>
                this.setState({ value: e.target.value, errorMensage: "" })
              }
              className="input"
              prefix={"R$"}
              decimalSeparator=","
              decimalScale={2}
              allowNegative={false}
            />

            <TextField
              label="Descrição"
              className="input"
              value={this.state.description}
              onChange={(e) =>
                this.setState({ description: e.target.value, errorMensage: "" })
              }
            />
          </div>

          <div className="divButton">
            <Button variant="contained" color="primary" type="submit">
              Finalizar venda
            </Button>
            <Button variant="contained" color="secondary">
              <Link to="/vendas">Vendas realizadas</Link>
            </Button>
          </div>
        </form>

        <footer>
          <p>
            Verificar{" "}
            <a
              style={{ color: "blue " }}
              href="https://github.com/FelipeEduardoOliveira/Shipay"
              // target="_blank"
            >
              Código fonte
            </a>
          </p>
        </footer>
      </div>
    );
  }
}

export default NewTransaction;
