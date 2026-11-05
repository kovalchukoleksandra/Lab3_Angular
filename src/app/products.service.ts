import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of } from 'rxjs';

export interface Product {
  id: number;
  title?: string;
  name?: string;
  price: number;
  category: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'https://fakestoreapi.com/products';
  
  allProducts = signal<Product[]>([]);

  constructor(private http: HttpClient) {}

  list(): Observable<Product[]> {
    if (this.allProducts().length > 0) {
      return of(this.allProducts());
    }

    return this.http.get<Product[]>(this.apiUrl).pipe(
      tap(remoteProducts => {
        this.allProducts.set(remoteProducts);
      })
    );
  }

  get(id: number): Observable<Product> {
    const found = this.allProducts().find(p => p.id === id);
    if (found) {
      return of(found);
    }
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  addLocalProduct(newProduct: Product) {
    this.allProducts.update(list => [newProduct, ...list]);
  }
}