import { Component, OnInit, Input } from "@angular/core";
import { Product } from "./product";
import { ProductService } from "./productservice";
import { ConfirmationService } from "primeng/api";
import { MessageService } from "primeng/api";
import { Parse } from "parse";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styles: [
    `
      :host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `
  ],
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  productDialog: boolean;

  products: any[] = [];

  product: Product;

  selectedProducts: Product[];

  submitted: boolean;

  objectProduct = new Parse.Object("Product");

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.refreshData();
  }

  onProgress($event, $value) {
    console.log("onProgress ===> ", $event);
    console.log("onProgress ===> ", $value);
  }

  onBeforeUpload($data: any) {
    console.log("onBeforeUpload ====> ", $data);
  }

  onBasicUpload(event) {
    console.log("basic upload ===> ", event);
    this.messageService.add({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded with Basic Mode"
    });
  }

  onUpload(event) {
    console.log("onUpdate ===>");
    console.log(event);
    // console.log(file);
  }

  openNew() {
    this.product = {};
    this.submitted = false;
    this.productDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete the selected products?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.products = this.products.filter(
          val => !this.selectedProducts.includes(val)
        );
        this.selectedProducts = null;
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "Products Deleted",
          life: 3000
        });
      }
    });
  }

  editProduct(product: Product) {
    console.log("start edit product ===>", product);
    this.product = { ...product };
    this.productDialog = true;
  }

  deleteProduct(product: Product) {
    console.log("delele product ===>", product);
    this.confirmationService.confirm({
      message: "Are you sure you want to delete " + product.name + "?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        let queryProduct = new Parse.Query("Product");
        queryProduct
          .get(product.id)
          .then((p: any) => {
            p.destroy()
              .then(pDeleted => {
                console.log("detesfsdfsdf===", pDeleted);
                this.messageService.add({
                  severity: "success",
                  summary: "Successful",
                  detail: "Product Deleted",
                  life: 3000
                });
                this.refreshData();
              })
              .catch(e => {
                console.log(e);
              });
          })
          .catch(e => {
            console.log(e);
          });
      }
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  async saveProduct() {
    this.submitted = true;
    await this.objectProduct.save(this.product);
    this.productDialog = false;
    this.product = {};
    this.messageService.add({
      severity: "success",
      summary: "Successful",
      detail: "Product Saved",
      life: 3000
    });
    this.refreshData();
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createCode(): string {
    let id = "";
    var chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  refreshData() {
    let queryOrder = new Parse.Query("Product");
    queryOrder.limit(100);
    queryOrder.descending("createdAt");
    queryOrder
      .find()
      .then((lst: any[]) => {
        this.products = lst.map(o => {
          return { id: o.id, ...o.attributes };
        });
      })
      .catch(e => console.log(e));
  }
}
