import React, { Component } from "react";
import "./App.css";

class App extends Component {
  state = {
    toDos: [],
    current: "",
    start: true
  };

  enterHandler = event => {
    let storedToDos = this.state.toDos;
    if (event.key === "Enter") {
      this.toDosend();
      storedToDos.push({ toDo: this.state.current });
      this.setState({ toDos: storedToDos });
      this.setState({ current: "" });
      console.log(this.state.toDos);
    }
  };

  changeHandler = event => {
    this.setState({ current: event.target.value });
  };

  delete = index => {
    const dToDo = this.state.toDos[index].toDo;
    this.setState(this.state.toDos.splice(index, 1));
    this.deleteToDo(dToDo);
  };

  deleteToDo = async dToDo => {
    await fetch("http://localhost:3004/delete", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        toDo: dToDo
      })
    });
  };

  toDoGet = async () => {
    const response = await fetch("http://localhost:3004/data");
    const total = await response.json();
    this.setState({ toDos: total.data });
    console.log(this.state.toDos);
  };

  toDosend = async () => {
    await fetch("http://localhost:3004/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        toDo: this.state.current
      })
    });
    this.toDoGet();
  };

  componentDidMount() {
    if (this.state.start === true) {
      this.toDoGet();
      this.setState({ start: false });
    }
  }

  render() {
    return (
      <div>
        <h1>To-do-List</h1>
        <input
          type="text"
          className="Input"
          value={this.state.current}
          onChange={event => this.changeHandler(event)}
          onKeyDown={event => this.enterHandler(event)}
        ></input>
        {this.state.toDos.map((num, index) => {
          return (
            <div key={index} className="List">
              <p>{num.toDo}</p>
              <button className="delete" onClick={() => this.delete(index)}>
                x
              </button>
              <p>{num.created_at}</p>
            </div>
          );
        })}
      </div>
    );
  }
}

export default App;
