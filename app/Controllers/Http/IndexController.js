'use strict'
const Product = use('App/Models/Product')
const Category = use('App/Models/Category')
class IndexController {
    formatCurrency (locales, currency, fractionDigits, number) {
        var formatted = new Intl.NumberFormat(locales, {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: fractionDigits
        }).format(number);
        return formatted;
      }
    async index({request, response, view})
    {
        const cats1= await Product.query().where("category","=","ENJUAGES-BUCALES").orWhere("category","LIKE","CREMAS DENTALES NI%").fetch()
        var rescat1=[]
        for(const product of cats1.toJSON())
        {
            product.price=this.formatCurrency("es-CO", "COP", 0, product.price);
            rescat1.push(product)
        }
        //
        const cats2= await Product.query().where("category","=","Cosmetica").fetch()
        var rescat2=[]
        
        for(const product of cats2.toJSON())
        {
            product.price=this.formatCurrency("es-CO", "COP", 0, product.price);
            rescat2.push(product)
        }
        //
        const cats3= await Product.query().where("category","=","Cuidado para el cabello").fetch()
        var rescat3=[]
        
        for(const product of cats3.toJSON())
        {
            product.price=this.formatCurrency("es-CO", "COP", 0, product.price);
            rescat3.push(product)
        }
        ////
        const cats4= await Product.query().where("category","=","Cuidado para la piel").fetch()
        var rescat4=[]
        
        for(const product of cats4.toJSON())
        {
            product.price=this.formatCurrency("es-CO", "COP", 0, product.price);
            rescat4.push(product)
        }
        ////
        const cats5= await Product.query().where("category","=","Cuidado oral").fetch()
        var rescat5=[]
        
        for(const product of cats5.toJSON())
        {
            product.price=this.formatCurrency("es-CO", "COP", 0, product.price);
            rescat5.push(product)
        }

        const categories= await Category.all()
        //console.log(rescat5)


        return view.render("index",{cats1: rescat1,cats2: rescat2,cats3: rescat3,cats4: rescat4,cats5: rescat5, categories: categories.toJSON()})
    }
    async categories({request, response, view})
    {
        const categories= await Category.all()
        return view.render("categories",{categories: categories.toJSON()})
    }
}

module.exports = IndexController
