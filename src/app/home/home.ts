import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Restaurant } from './interfaces/restaurant.interfaces';
import { RestaurantService } from './services/restaurant.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  restaurants;

  constructor(private restaurantService: RestaurantService) {
    this.restaurants = toSignal(this.restaurantService.getAll(), { initialValue: [] as Restaurant[] });
  }
}
