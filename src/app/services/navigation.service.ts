import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Category, Order, Payment, PaymentMethod, User } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  baseurl = "https://localhost:7229/api/Shopping/";

  constructor(private http: HttpClient) { }

  getCategoryList() {
    let url = this.baseurl + 'GetCategoryList';
    return this.http.get<any[]>(url).pipe(
      map((categories) => 
        categories.map((category) => {
          let mappedCategory: Category = {
            id: category.id,
            category: category.category,
            subCategory: category.subCategory,
          };
          return mappedCategory;
        })
      )
    );
  }

  getProducts(category: string, subCategory: string, count: number) {
    return this.http.get<any[]>(this.baseurl + 'GetProducts', {
      params: new HttpParams()
        .set('category', category)
        .set('subCategory', subCategory)
        .set('count', count),
    });
  }

  getProduct(id: number) {
    let url = this.baseurl + "GetProduct/" + id;

    return this.http.get(url);
  }

  registerUser(user: User) {
    let url = this.baseurl + "RegisterUser";

    return this.http.post(url, user, {responseType: 'text'});
  }

  loginUser(email: string, password: string) {
    let url = this.baseurl + 'LoginUser';
    return this.http.post(
      url,
      {Email: email, Password: password},
      {responseType: 'text'}
      );
  }

  submitReview(userId: number, productId: number, review: string) {
    let obj: any = {
      User: {
        Id: userId,
      },
      Product: {
        Id: productId,
      },
      Value: review,
    }

    let url = this.baseurl + 'InsertReview';

    return this.http.post(url, obj, {responseType: 'text'});
  }

  getAllProductReviews(productId: number) {
    let url = this.baseurl + 'GetProductReviews/' + productId;
    return this.http.get(url);
  }

  addToCart(userId: number, productId: number) {
    let url = this.baseurl + 'InsertCartItem/' + userId + '/' + productId;
    return this.http.post(url, null, {responseType: 'text'});
  }

  getActiveCartOfUser(userId: number) {
    let url = this.baseurl + 'GetActiveCartOfUser/' + userId;
    return this.http.get<any>(url);
  }

  getAllPreviousCarts(userId: number) {
    let url = this.baseurl + "GetAllPreviousCartOfUser/" + userId;
    return this.http.get(url);
  }

  getPaymentMethod() {
    let url = this.baseurl + "GetPaymentMethod";
    return this.http.get<PaymentMethod[]>(url);
  }

  insertPayment(payment: Payment) {
    return this.http.post(this.baseurl + 'InsertPayment', payment, {responseType: 'text'});
  }

  insertOrder(order: Order) {
    return this.http.post(this.baseurl + 'InsertOrder', order);
  }
}
