// Michal Wszolek - basket demo app - Backbone.js

$(function(){
	
	var Product = Backbone.Model.extend();

	var OfferCollection = Backbone.Collection.extend({
		model: Product,
		in_basket: function() {
			return this.filter(function(item) {
				return item.get('quantity') > 0;
			});
		}
	});

  var products = [
    { name: "smartphone", quantity: 0, unit_price: 200 },
    { name: "tablet", quantity: 0, unit_price: 350 },
    { name: "netbook", quantity: 0, unit_price: 400 },
    { name: "laptop", quantity: 0, unit_price: 1000 }
  ];

	var Offer = new OfferCollection(products);

	var OfferView = Backbone.View.extend({
		tagName: "li",
		template: _.template($('#offer-item-template').html()),

		events: {
      "click .add"   : "addToBasket"
    },

    addToBasket: function(){
    	var additional_quantity = parseInt(this.$el.find(".quantity").val());
    	if(!isNaN(additional_quantity) && additional_quantity>0) {
    		this.model.set({quantity: this.model.get("quantity") + additional_quantity });
    	}
    },

		render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
	});

	var BasketView = Backbone.View.extend({
		tagName: "li",
		template: _.template($('#basket-item-template').html()),

		events: {
      "click .increase"   : "increase",
      "click .decrease"   : "decrease",
      "click .remove"   	: "removeFromBasket",
    },

    increase: function(){
    	this.model.set({quantity: this.model.get("quantity")+1});
    },

    decrease: function(){
    	this.model.set({quantity: this.model.get("quantity")-1});
    },

    removeFromBasket: function(){
    	this.model.set({quantity: 0});
    },

		render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },
	});



	var AppView = Backbone.View.extend({
		el: "#basket-app",

		initialize: function(){
			this.basket = $('#basket');	
			this.basket_list = $('#basket-list');
			this.total_price = $('#total-price');

			Offer.each(function(item) {
	      var view = new OfferView({model: item});
	      this.$("#offer-list").append(view.render().el);
	    });

	    this.listenTo(Offer, 'all', this.render);

			this.render();

		},

		render: function() {
      if (Offer.in_basket().length) {
        this.basket.show();
      } else {
        this.basket.hide();
      }

      if(this.basket_list[0].children.length != Offer.in_basket().length) {
      	this.basket_list.empty();

	      new OfferCollection(Offer.in_basket()).each(function(item) {
		      var view = new BasketView({model: item});
		      this.$("#basket-list").append(view.render().el);
		    });
			}

      var total = 0;
			Offer.each(function(item) {
				total += item.get("quantity")*item.get("unit_price");
			});
      this.total_price.text(total);
    },

	});

	var App = new AppView;

});
