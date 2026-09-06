import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DUMMY_RESTAURANTS } from '../dummy-restaurants';
import { Restaurant } from './interfaces/restaurant.interfaces';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  restaurants: Restaurant[] = DUMMY_RESTAURANTS;
}
