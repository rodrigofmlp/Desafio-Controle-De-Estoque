const axios = require('axios').default;

class products{
    constructor(){
        this.name = document.getElementById('txtName');
        this.brand = document.getElementById('txtBrand');
        this.quantity = document.getElementById('txtQuantity');
        this.checkBox = document.getElementById('checkBox');
        this.btnRegister = document.getElementById('btnRegister');
        this.btnUpdateProduct = document.getElementById('btn-update');
        this.productNameEdit = document.getElementById('txtNameModal');
        this.productBrandEdit =document.getElementById('txtBrandModal');
        this.productQuantityEdit = document.getElementById('txtQuantityModal');
        this.productPerecívelEdit = document.getElementById('checkboxModal');
        this.id = 0;
        this.events();
    }

    events(){
        this.btnRegister.onclick = (event) => this.productValidate(event);
        this.btnUpdateProduct.onclick = (event) => this.updateProduct(this.id);
    }

    updateProduct(id){
        let product = {
            name: this.productNameEdit.value,
            brand: this.productBrandEdit.value,
            quantity: this.productQuantityEdit.value,
            perecível: this.productPerecívelEdit.value,
        }
        axios.put(`http://localhost:3000/products/${id}`, product)
        .then(response =>{
            console.log(response);
        })
        .catch(error =>{
            console.log(error);
        })
    }

    getProducts(){
        axios.get('http://localhost:3000/products')
        .then((response)=>{
            this.recoveryProducts(response.data.products);
        })
        .catch((error)=>{
            console.log(error);
        })
    };

    recoveryProducts(data){
        for(product of data){
            const html = this.layoutProduct(product.name, product.brand, product.quantity, product.pericível, product.id);
            this.insertHtml(html);
        }
        document.querySelectorAll('.delete-product').forEach(button =>{
            button.onclick = event => this.deleteProduct(button.id);
        });

        document.querySelectorAll('.edit-product').forEach(button =>{
            button.onclick = event => this.getProduct(button.id);
        })
    };

    getProduct(id){
        axios.get(`http://localhost:3000/products`)
        .then(response =>{
            console.log(response.data.product[0]);
            this.id = id;
            this.productNameEdit.value = response.data.product[0].name;
            this.productBrandEdit.value = response.data.product[0].brand;
            this.productQuantityEdit.value = response.data.product[0].quantity;
            this.productPerecívelEdit.value = response.data.product[0].perecível;
        })
        .catch(error =>{
            console.log(error);
        })
    };

    deleteProduct(id){
        axios.delete(`http://localhost:3000/products/${id}`)
        .then(response =>{
            alert(response.data.result);
        })
        .catch(error =>{
            console.log(error);
        })
    }


    layoutProduct(name, brand, quantity, pericível, id){
        const html =`
        <div class='col mt-t'>
            <div class='card'>
                <div class='product-body'>
                    <h3 class='product-name'>${name}</h3>
                    <p class='product-brand'>${brand}</h3>
                    <p class='product-quantity'>${quantity}</h3>
                    <p class='product-check'>${pericível? 'É pericível' : 'É não pericível'}</h3>
                    <button type="button" class="btn btn-danger delete-product" id="${id}">Deletar</button>
                    <button type="button" class="btn btn-primary edit-product" id="${id}" data-toggle="modal" data-target="#exampleModalCenter">
                    Editar
                    </button>
                </div>
            </div>
        </div>
        `;

        return html;       
    };

    productValidate(event){
        event.preventDefault();
        if(this.name.value && this.brand.value && this.quantity.value){
            const product = {
                name: this.name,
                brand: this.brand,
                quantity: this.quantity,
                perecível: this.checkBox
            }
            this.createProduct(product);
        }else{
            alert('Preencha todos os dados.');
        }
    };

    insertHtml(html){
        document.getElementById('productsBoard').innerHTML += html;
    }

    createProduct(product){
        axios.post(`http://localhost:3000/products`, product)
            .then((response)=>{
                const html = this.layoutProduct(product.name, product.brand, product.quantity, product.pericível)
                this.insertHtml(html);
            })
            .catch((error)=>{
                 console.log(error);
            })
    };

}

new products();