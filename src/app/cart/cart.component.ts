import { Component, OnInit } from '@angular/core';
import { Cart, Payment } from '../models/models';
import { NavigationService } from '../services/navigation.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  userCart: Cart = {
    id:0,
    user: this.utilityService.getUser(),
    cartItems: [],
    ordered: false,
    orderedOn:'',
  }

  userPaymentInfo: Payment = {
    id: 0,
    user: this.utilityService.getUser(),
    paymentMethod: {
      id: 0,
      type: '',
      provider: '',
      available: false,
      reason: '',
    },
    totalAmount: 0,
    shipingCharges: 0,
    amountReduced: 0,
    amountPaid:0,
    createdAt: '',
  }

  usersPreviousCarts: Cart[] = [];

  constructor(public utilityService: UtilityService,
      private navService: NavigationService
    ) { }

  ngOnInit(): void {
    //Get Cart
    this.navService
      .getActiveCartOfUser(this.utilityService.getUser().id)
      .subscribe((res: any) => {
        this.userCart = res;

        //calculate Payment
        this.utilityService.calculatePayment(this.userCart, this.userPaymentInfo);
    });

    // Get Previous Carts
    this.navService
      .getAllPreviousCarts(this.utilityService.getUser().id)
      .subscribe((res: any) => {
        this.usersPreviousCarts = res;
      });
  }
}
