/**
 * Michal Wszolek - basket demo app - React
 * @jsx React.DOM
 */

var BasketApplication = React.createClass({

	getInitialState: function() {
		return {
			items: [
  			{id: 0, name:'smartphone', quantity: 1, unit_price: 200},
    		{id: 1, name:'tablet', quantity: 0, unit_price: 350},
    	  {id: 2, name:'netbook', quantity: 2, unit_price: 400},
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
    var total = 0;
  	this.state.items.forEach( function(item, idx) {
	    total += item.quantity * item.unit_price;
	  });

	  var basketNodes = this.state.items.filter(function(item){
  		return item.quantity>0;
  	}, this).map(function(item){
			return <BasketItem item={item}
				onIncrease={this.updateQuantity.bind(this, item, item.quantity+1)} 
				onDecrease={this.updateQuantity.bind(this, item, item.quantity-1)} 
				onRemove={this.updateQuantity.bind(this, item, 0)} />;
		}, this);

		var offerNodes = this.state.items.map(function(item){
			return <OfferItem item={item} onAdd={this.addItemToBasket.bind(this, item)} />;
		}, this);

    return <div>
	  	<h1>plokin demo basket app - React</h1>
	    <div id="basket">
	    	<h2>your basket</h2>
	    	<ul id="basket-list">
		    	{basketNodes}
	      </ul>
	    	total: €{total} <input type="button" value="clear-basket" />
	    </div>
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
		if(!isNaN(quantity)) {
      this.props.onAdd(quantity);
    }
	},
  render: function() {
  	var item = this.props.item;
    return <li>
			{item.name}, €{item.unit_price} <input type="text" class="quantity" placeholder="quantity" ref="quantity" /> <a class="add" onClick={this.handleAdd}>add</a>
		</li>;
  }
});

var BasketItem = React.createClass({
  render: function() {
  	var item = this.props.item;
    return <li>
			{item.name}, {item.quantity} * €{item.unit_price} = €{ item.quantity * item.unit_price }
			&nbsp;<a class="increase" onClick={this.props.onIncrease.bind(null)}>+</a>
			&nbsp;<a class="decrease" onClick={this.props.onDecrease.bind(null)}>-</a>
			&nbsp;<a class="remove" onClick={this.props.onRemove.bind(null)}>remove</a>
    </li>;
  }
});

React.renderComponent(
  <BasketApplication />,
  document.getElementById('container')
);
