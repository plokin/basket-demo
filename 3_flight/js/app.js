// Michal Wszolek - basket demo app - Flight

$(function() {
  
  var OfferUI = flight.component(function() {
    this.defaultAttrs({
      addSelector: '.add'
    });
    this.addToBasket = function (event, data) {
      var additional_quantity = parseInt($(event.target).closest(".input-group").find('.quantity').val());
      if(!isNaN(additional_quantity) && additional_quantity>0) {
        this.trigger('uiAddToBasketAction', { item_id: $(event.target).closest(".offer-row").data("id"), item_count: additional_quantity });
      }
    };
    this.render = function (event, data) {
      var html = '';
      data.items.forEach( function(item, idx) {
        html += 
        '<div data-id="'+idx+'" class="row offer-row"> \
          <div class="col-sm-2 product-name">'+item.name+'</div> \
          <div class="col-sm-2 price-tag">€'+item.unit_price+'</div> \
          <div class="input-group col-sm-4"> \
            <input type="text" class="quantity form-control" placeholder="quantity"> \
            <span class="input-group-btn"> \
              <button class="add btn btn-default" type="button"><span class="glyphicon glyphicon-shopping-cart"></span> Add</button> \
            </span> \
          </div> \
        </div>';
      });
      this.$node.html(html);
    };
    this.after('initialize', function() {
      this.on('dataOfferLoaded', this.render);
      this.on('click', {addSelector: this.addToBasket});
    });
  });
  
  var BasketUI = flight.component(function() {
    this.defaultAttrs({
      increaseSelector: '.increase',
      decreaseSelector: '.decrease',
      removeSelector:   '.remove'
    });
    this.render = function (event, data) {
      var html = '';
      var total_quantity = 0;
      data.items.filter( function(a){return a.quantity>0;} ).forEach( function(item, idx) {
        total_quantity += item.quantity;
        html += 
        '<div data-id="'+idx+'" class="row basket-row"> \
          <div class="col-sm-4 product-name">'+item.name+'</div> \
          <div class="col-sm-2"> \
            <a class="decrease"><span class="glyphicon glyphicon-minus"></span></a> \
            <span class="badge">'+item.quantity+'</span> \
            <a class="increase"><span class="glyphicon glyphicon-plus"></span></a> \
          </div><div class="col-sm-4"> \
            <span class="price-cart">€'+(item.quantity * item.unit_price)+'</span> (€'+item.unit_price+' per unit) \
          </div><div class="col-sm-2"> \
            <button type="button" class="remove btn btn-default btn-sm"> \
              <span class="glyphicon glyphicon-remove glyphicon-red"></span> Remove \
            </button> \
          </div> \
        </div>';
      });
      this.$node.find('#basket-list').html(html);
      if(total_quantity === 0) {
        this.$node.hide();
      } else {
        this.$node.show();
      }
    };
    this.after('initialize', function() {
      this.on('dataBasketUpdated', this.render);
      this.on('click', {
        increaseSelector: function(event, data) {this.trigger('uiAddToBasketAction', { item_id: $(event.target).closest(".basket-row").data("id"), item_count: 1 });},
        decreaseSelector: function(event, data) {this.trigger('uiAddToBasketAction', { item_id: $(event.target).closest(".basket-row").data("id"), item_count: -1 });},
        removeSelector: function(event, data) {this.trigger('uiRemoveFromBasketAction', { item_id: $(event.target).closest(".basket-row").data("id")});}
      });
    });
  });
  
  var TotalPriceUI = flight.component(function() {
    this.updatePrice = function (event, data) {
      this.$node.html(data.items.map(function(a){return a.quantity*a.unit_price;}).reduce(function(a,b) {return a+b;}));
    };
    this.after('initialize', function() {
      this.on(document, 'dataBasketUpdated', this.updatePrice);
    });
  });
  
  var BasketData = flight.component(function() {
    this.loadOffer = function (event, data) {
      this.attr.items = data.offer;
      this.trigger('#offer-list', 'dataOfferLoaded', { items: this.attr.items });
      this.trigger('#basket', 'dataBasketUpdated', { items: this.attr.items });
    };
    this.changeQuantity = function (event, data) {
      this.attr.items[data.item_id].quantity += data.item_count;
      this.trigger('#basket', 'dataBasketUpdated', { items: this.attr.items });
    };
    this.clearQuantity = function (event, data) {
      this.attr.items[data.item_id].quantity = 0;
      this.trigger('#basket', 'dataBasketUpdated', { items: this.attr.items });
    };
    this.after('initialize', function() {
      this.on('dataOfferProvided', this.loadOffer);
      this.on('uiAddToBasketAction', this.changeQuantity);
      this.on('uiRemoveFromBasketAction', this.clearQuantity);
    });
  });
  
  var OfferSource = flight.component(function() {    
    this.after('initialize', function() {
      var products = {offer:[
        { name: "smartphone", quantity: 0, unit_price: 200 },
        { name: "tablet", quantity: 0, unit_price: 350 },
        { name: "netbook", quantity: 0, unit_price: 400 },
        { name: "laptop", quantity: 0, unit_price: 1000 }
      ]};
      this.trigger('dataOfferProvided', products);
    });
  });
  
  OfferUI.attachTo('#offer-list');
  BasketUI.attachTo('#basket');
  TotalPriceUI.attachTo('#total-price');
  BasketData.attachTo(document);
  OfferSource.attachTo(document);
});
