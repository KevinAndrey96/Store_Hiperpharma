'use strict'
const Product = use('App/Models/Product')
const Category = use('App/Models/Category')
const { raw } = require('objection');

class ProductController {
    
    

    async index({ params, view }) {

        

        const product = await Product.find(params.id);
        product.price=this.formatCurrency("es-CO", "COP", 0, product.price);

        const relateds= await Product.query().where("category","=",product.category).where("id","!=",product.id).fetch()
  
        //console.log(relateds)
        return view.render("product_detail", {product, relateds: relateds.toJSON()});
      }
      formatCurrency (locales, currency, fractionDigits, number) {
        var formatted = new Intl.NumberFormat(locales, {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: fractionDigits
        }).format(number);
        return formatted;
      }
      async bycat({request, response,params, view})
      {
        //console.log(request.params.id)
        const category = await Category.find(params.id)
        const products = await Product.query().where("category","=",category.name).fetch()
        var products2=[]
        for(const product of products.toJSON())
        {
            product.price=this.formatCurrency("es-CO", "COP", 0, product.price);
            products2.push(product)
        }
        return view.render('products_list', { products: products2, category: category })
      }
      
      async cart({request, response, view})
      {
        
        return view.render("cart");
      }
      async get({request, response, params})
      {
        const id=request.input("id");
        //console.log("llegó: "+id)
        const product=await Product.find(id)
        product.price2=this.formatCurrency("es-CO", "COP", 0, product.price);
        
        var product2={}
        product2.id=product.id
        product2.name=product.name
        product2.code=product.code
        product2.category=product.category
        product2.price=product.price
        product2.short_description=product.short_description
        product2.long_description=product.long_description

        const axios = use('axios');        
        axios.get('https://hiperpharma.com/'+product.id+'.png')
        .then(function (response) {
            
            product.image="https://hiperpharma.com/"+product.id+".png"
            product2.image="https://hiperpharma.com/"+product.id+".png"
        })
          .catch(function (error) {
            
            product.image="https://hiperpharma.com/placeholder.png"
            product2.image="https://hiperpharma.com/placeholder.png"
            
          })
          
          
          
          
        return product
      }
      
      async checkout({request, response, view})
      {
        var cart=request.input("CART")
        cart=JSON.parse(cart)
        console.log("llegó "+cart.cart)
        var products=[]
        var total=0
        for(const cart2 of cart.cart)
        {
          const product=await Product.findOrFail(parseInt(cart2.Product))
          var carrito={}
          carrito.id=product.id
          carrito.name=product.name
          carrito.code=product.code
          carrito.quantity=cart2.Quantity
          carrito.price=parseInt(carrito.quantity)*parseInt(product.price)
          carrito.prettyprice=this.formatCurrency("es-CO", "COP", 0, carrito.price)
          total=total+parseInt(carrito.price)
          products.push(carrito)
          console.log(product)
        }
        var prettyprices={}
        prettyprices.subtotal=this.formatCurrency("es-CO", "COP", 0,total)
        prettyprices.shipping=this.formatCurrency("es-CO", "COP", 0, 0)
        prettyprices.total=this.formatCurrency("es-CO", "COP", 0,total+0)

        var prices={}
        prices.subtotal=prices.subtotal+total
        prices.shipping= 0
        prices.total=prices.subtotal+prices.shipping
        
        return view.render("checkout", {cart: products, prices: prices, prettyprices:prettyprices});
      }

}

module.exports = ProductController
