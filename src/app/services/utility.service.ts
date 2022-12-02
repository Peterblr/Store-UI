import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subject } from 'rxjs';
import { Cart, Payment, Product, User } from '../models/models';
import { NavigationService } from './navigation.service';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  changeCart = new Subject();

  constructor(private jwt: JwtHelperService,
    private navService: NavigationService
    ) { }

  applyDiscount(price: number, discount: number): number {
    let finalPrice: number = price - price * (discount / 100);

    return finalPrice;
  }

  // JWT Helper Service : npm i @auth0/angular-jwt

  getUser(): User {
    let token = this.jwt.decodeToken();
    let user: User = {
      id: token.id,
      firstName: token.firstName,
      lastName: token.lastName,
      address: token.address,
      mobile: token.mobile,
      email: token.email,
      password: '',
      createdAt: token.createdAt,
      modifiedAt: token.modifiedAt,
    };
    return user;
  }

  setUser(token: string) {
    localStorage.setItem('user', token);
  }

  isLoggedIn() {
    return localStorage.getItem('user') ? true : false;
  }

  logoutUser() {
    localStorage.removeItem('user');
  }

  addToCart(product: Product) {
    let productId = product.id;
    let userId = this.getUser().id;

    this.navService.addToCart(userId, productId).subscribe((res) => {
      if (res.toString() === 'inserted')
        {
          this.changeCart.next(1);
        }
    })
  }

  calculatePayment(cart: Cart, payment: Payment) {
    payment.totalAmount = 0;
    payment.amountPaid = 0;
    payment.amountReduced = 0;

    for (let cartItem of cart.cartItems) {
      payment.totalAmount += cartItem.product.price;

      payment.amountReduced += cartItem.product.price - this.applyDiscount(
        cartItem.product.price, cartItem.product.offer.discount
      );

      payment.amountPaid += this.applyDiscount(
        cartItem.product.price,
        cartItem.product.offer.discount
      );
    }

    payment.shipingCharges = payment.amountPaid * 0.1;
  }

  calculatePricePaid(cart: Cart) {
    let pricePaid = 0;
    for (let cartItem of cart.cartItems) {
      pricePaid += this.applyDiscount(cartItem.product.price, cartItem.product.offer.discount);
    }
    return pricePaid;
  }
}
