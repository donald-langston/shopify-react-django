import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Product from './Product';
import Checkout from './Checkout';
import SuccessPage from './SuccessPage';
import SiteNavBar from './SiteNavBar';
import Footer from './Footer';


function App() {

  return (
    <div>
      <SiteNavBar />
      <Switch>
        <Route exact path="/">
          <Product />
        </Route>
        <Route path="/checkout">
          <Checkout />
        </Route>
        <Route path="/success">
          <SuccessPage />
        </Route>
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
