const { DatePicker } = antd;

const App = React.createClass({
  render() {
    return (
      <div style={{margin: 10}}>
        <DatePicker />
      </div>
    );
  }
});

ReactDOM.render(<App />, document.getElementById('container'));
