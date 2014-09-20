/**
 * Michal Wszolek - basket demo app - React
 * @jsx React.DOM
 */

var BasketApplication = React.createClass({
  getInitialState: function() {
    return {
      items: [
        {id: 0, name:'smartphone', quantity: 0, unit_price: 200},
        {id: 1, name:'tablet', quantity: 0, unit_price: 350},
        {id: 2, name:'netbook', quantity: 0, unit_price: 400},
        {id: 3, name:'laptop', quantity: 0, unit_price: 1000},
      ]}
  },
  updateQuantity: function(item, newQuantity) {
    var items = this.state.items;
    items[item.id].quantity = newQuantity;
    this.setState({items: items});
  },
  addItemToBasket: function(item, quantity) {
    var items = this.state.items;
    items[item.id].quantity += quantity;
    this.setState({items: items});
  },
  render: function() {
    var total = this.state.items.map(function(a){return a.quantity*a.unit_price;}).reduce(function(a,b) {return a+b;});
    
    var basketNodes = this.state.items.filter(function(item){
      return item.quantity>0;
    }, this).map(function(item){
      return <BasketItem item={item} key={item.id}
        onIncrease={this.updateQuantity.bind(this, item, item.quantity+1)} 
        onDecrease={this.updateQuantity.bind(this, item, item.quantity-1)} 
        onRemove={this.updateQuantity.bind(this, item, 0)} />;
    }, this);
    
    var basket = basketNodes.length ? <div id="basket">
        <h2>your basket</h2>
        <ul id="basket-list">
          {basketNodes}
        </ul>
        total: €{total} <input type="button" value="clear-basket" />
      </div> : null;
    
    var offerNodes = this.state.items.map(function(item){
      return <OfferItem item={item} key={item.id} onAdd={this.addItemToBasket.bind(this, item)} />;
    }, this);
    
    return <div>
      <h1>Basket demo application - React</h1>
      {basket}
      <h2>our offer</h2>
      <ul id="offer-list">
        {offerNodes}
      </ul>
    </div>;
  }
});

var OfferItem = React.createClass({
  handleAdd: function() {
    var quantity = parseInt(this.refs.quantity.getDOMNode().value);
    if(!isNaN(quantity) && quantity>0) {
      this.props.onAdd(quantity);
    }
  },
  render: function() {
    var item = this.props.item;
    return <li>
      {item.name}, €{item.unit_price} <input type="text" className="quantity" placeholder="quantity" ref="quantity" /> <a className="add" onClick={this.handleAdd}>add</a>
    </li>;
  }
});

var BasketItem = React.createClass({
  render: function() {
    var item = this.props.item;
    return <li>
      {item.name}, {item.quantity} * €{item.unit_price} = €{ item.quantity * item.unit_price }
      &nbsp;<a className="increase" onClick={this.props.onIncrease.bind(null)}>+</a>
      &nbsp;<a className="decrease" onClick={this.props.onDecrease.bind(null)}>-</a>
      &nbsp;<a className="remove" onClick={this.props.onRemove.bind(null)}>remove</a>
    </li>;
  }
});

React.renderComponent(
  <BasketApplication />,
  document.getElementById('container')
);
