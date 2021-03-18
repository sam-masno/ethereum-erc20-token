import React from 'react';
import ReactDOM from 'react-dom';

const test = async () => {
  await fetch('www.google.com')
  console.log('fetched')
}

const App = () => {
  test();
  return (
    <div>
      <h1>app works</h1>
    </div>
  )
}

ReactDOM.render(<App/>, document.getElementById('app'));