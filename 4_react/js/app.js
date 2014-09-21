/** @jsx React.DOM */
// Michal Wszolek - basket demo app - React

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
  updateQuantity: function(item, quantityChange) {
    var items = this.state.items;
    items[item.id].quantity += quantityChange;
    this.setState({items: items});
  },
  render: function() {
    var total = this.state.items.map(function(a){return a.quantity*a.unit_price;}).reduce(function(a,b) {return a+b;});
    
    var basketNodes = this.state.items.filter(function(item){
      return item.quantity>0;
    }).map(function(item){
      return <BasketItem item={item} key={item.id}
        onIncrease={this.updateQuantity.bind(this, item, 1)}
        onDecrease={this.updateQuantity.bind(this, item, -1)}
        onRemove={this.updateQuantity.bind(this, item, -item.quantity)} />;
    }, this);
    
    var basket = basketNodes.length==0 ? null : <div id="basket">
        <h2>your basket</h2>
        <div>
          {basketNodes}
        </div>
        total: <span className="price-cart">€{total}</span>
      </div>;
    
    var offerNodes = this.state.items.map(function(item){
      return <OfferItem item={item} key={item.id} onAdd={this.updateQuantity.bind(this, item)} />;
    }, this);
    
    return <div>
      <h1>Basket demo application - React</h1>
      {basket}
      <h2>our offer</h2>
      <div>
        {offerNodes}
      </div>
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
    return <div className="row offer-row">
      <div className="col-sm-2 product-name">{item.name}</div>
      <div className="col-sm-2 price-tag">€{item.unit_price}</div>
      <div className="input-group col-sm-4">
        <input type="text" className="quantity form-control" placeholder="quantity" ref="quantity" />
        <span className="input-group-btn">
          <button className="add btn btn-default" type="button" onClick={this.handleAdd}><span className="glyphicon glyphicon-shopping-cart"></span> Add</button>
        </span>
      </div>
    </div>;
  }
});

var BasketItem = React.createClass({
  render: function() {
    var item = this.props.item;
    return <div className="row basket-row">
      <div className="col-sm-4 product-name">{item.name}</div>
      <div className="col-sm-2">
        <a onClick={this.props.onDecrease.bind(null)}><span className="glyphicon glyphicon-minus"></span></a>&nbsp;
        <span className="badge">{item.quantity}</span>&nbsp;
        <a onClick={this.props.onIncrease.bind(null)}><span className="glyphicon glyphicon-plus"></span></a>
      </div><div className="col-sm-4">
        <span className="price-cart">€{ item.quantity*item.unit_price }</span> (€{item.unit_price} per unit)
      </div><div className="col-sm-2">
        <button type="button" className="btn btn-default btn-sm" onClick={this.props.onRemove.bind(null)}>
          <span className="glyphicon glyphicon-remove glyphicon-red"></span> Remove
        </button>
      </div>
    </div>;
  }
});

React.renderComponent(
  <BasketApplication />,
  document.getElementById('container')
);
