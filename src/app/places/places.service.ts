import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { take, map, delay, tap } from 'rxjs/operators';

import { Place } from './places.model';
import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Washington, D.C.',
      "The nation's capital has a lot going for it. Iconic landmarks like the Lincoln Memorial and the Washington Monument allow you to sightsee for days.",
      'https://travel.usnews.com/dims4/USNEWS/27e33ca/2147483647/resize/445x280%5E%3E/crop/445x280/quality/85/?url=https://travel.usnews.com/images/lincoln_memorial_and_reflecting_pool_main_445x280_Z3hHCXm.jpg',
      500.00,
      new Date('2020-01-01'),
      new Date('2025-12-31'),
      'acb'
    ),
    new Place(
      'p2',
      'Yellowstone',
      "America's first national park provides plenty of attractions to excite nature lovers, from steaming geysers to bubbling hot springs to hiking trails that stretch more than 900 miles.",
      'https://travel.usnews.com/dims4/USNEWS/e984691/2147483647/resize/445x280%5E%3E/crop/445x280/quality/85/?url=https://travel.usnews.com/images/yellowstone_main-edited-16_445x280_zgAcX0I.jpg',
      99.99,
      new Date('2020-01-01'),
      new Date('2025-12-31'),
      'qrx'
    ),
    new Place(
      'p3',
      'Grand Teton National Park',
      "In Grand Teton National Park, Wyoming's snow-topped Teton Mountains rub elbows with the Snake River, Jackson and Jenny lakes, wildflower fields, swamps and more.",
      'https://travel.usnews.com/dims4/USNEWS/792850e/2147483647/resize/445x280%5E%3E/crop/445x280/quality/85/?url=https://travel.usnews.com/images/sunset_getty_resized_445x280_YKWzliy.jpg',
      99.99,
      new Date('2020-01-01'),
      new Date('2025-12-31'),
      'acb'
    ),
    new Place(
      'p4',
      'Grand Canyon',
      "To experience some of the most inspiring views America has to offer, plan a trip to Grand Canyon National Park. The Colorado River weaves its way through the 277-mile-long canyon, making it a top destination for whitewater rafting.",
      'https://travel.usnews.com/dims4/USNEWS/7d95859/2147483647/resize/445x280%5E%3E/crop/445x280/quality/85/?url=https://travel.usnews.com/images/grand_canyon_main_2014_-_shutterstock-kojihirano_kUxSzuP.jpg',
      99.99,
      new Date('2020-01-01'),
      new Date('2025-12-31'),
      'acb'
    ),
    new Place(
      'p5',
      'Glacier National Park',
      "Glaciers are the main draw of this national park, but its more than 700 lakes, two mountain ranges and multiple waterfalls are equally impressive.",
      'https://travel.usnews.com/dims4/USNEWS/49f7191/2147483647/resize/445x280%5E%3E/crop/445x280/quality/85/?url=https://travel.usnews.com/images/main_getty_resized_445x280_b8LdAje.jpg',
      99.99,
      new Date('2020-01-01'),
      new Date('2025-12-31'),
      'qrx'
    )
  ]);
  
  get places () {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService) {}

  getPlace(id:string) {
    return this.places.pipe(take(1), map(places => {
      return {...places.find(p =>p.id ===id) };
    }));
  }

  addPlace( title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    //only take one object and cancel the subscription
    //so that you get the lastest list of places
    return this.places.pipe(
      take(1), 
      delay(1000), 
      tap(places => {
        this._places.next(places.concat(newPlace));
      })
    );
  }

  updatePlace(placeId: string, title: string, description: string) {
    return this.places.pipe(
      take(1),
      delay(1000),
      tap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        const updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        this._places.next(updatedPlaces);
      })
    );
  }
}
