'use strict'
const Product = use('App/Models/Product')
const Category = use('App/Models/Category')

class ProductController {
    
    

    async index({ params, view }) {

        

        const product = await Product.find(params.id);
        product.price=this.formatCurrency("es-CO", "COP", 0, product.price);
    
        return view.render("product_detail", {product});
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
        return view.render('products_list', { products: products2 })
      }
      
      async cart({request, response, view})
      {
        
        return view.render("cart");
      }
      async get({request, response, params})
      {
        const id=request.input("id");
        console.log("llegó: "+id)
        const product=await Product.find(id)
        product.price2=this.formatCurrency("es-CO", "COP", 0, product.price);
        return product
      }
      

}

module.exports = ProductController
