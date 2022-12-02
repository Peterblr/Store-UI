import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/models';
import { NavigationService } from '../services/navigation.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  view: 'grid' | 'list' = 'list';
  sortby: 'default' | 'htl' | 'lth' = 'default';
  products: Product[] = [];

  constructor(
    private activateRouter: ActivatedRoute,
    private navService: NavigationService,
    private utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    this.activateRouter.queryParams.subscribe((params: any) => {
      let category = params.category;
      let subCategory = params.subCategory;

      if (category && subCategory) 
        this.navService
          .getProducts(category, subCategory, 10)
          .subscribe((res: any) => {
            this.products = res;
          });
    });
  }

  sortByPrice(sortKey: string) {
    this.products.sort((a, b) => {
      if(sortKey === 'default') {
        return a.id > b.id ? 1 : -1;
      }
      (sortKey === 'htl' ? 1 : -1) * 
        (this.utilityService.applyDiscount(a.price, a.offer.discount) > 
        this.utilityService.applyDiscount(b.price, b.offer.discount) 
        ? -1
        : 1);      
      
      return 0;
    });
  }
}
