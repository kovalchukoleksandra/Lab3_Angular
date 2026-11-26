import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map, of } from 'rxjs';

export interface Product {
  id: string | number;
  _id?: string;
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
  private apiUrl = 'https://lab5-nodejs-tkhy.onrender.com/products';
  
  allProducts = signal<Product[]>([]);

  constructor(private http: HttpClient) {}

  private normalize(p: any): Product {
    return {
      ...p,
      id: p._id || p.id,
      title: p.name || p.title
    };
  }

  list(): Observable<Product[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(items => items.map(item => this.normalize(item))),
      tap(remoteProducts => {
        this.allProducts.set(remoteProducts);
      })
    );
  }

  get(id: string | number): Observable<Product> {
    const found = this.allProducts().find(p => String(p.id) === String(id));
    if (found) {
      return of(found);
    }
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(item => this.normalize(item))
    );
  }

  create(product: Omit<Product, 'id'>): Observable<Product> {
    const payload = {
      name: product.name || product.title,
      price: Number(product.price),
      category: product.category || 'electronics',
      description: product.description || ''
    };

    return this.http.post<any>(this.apiUrl, payload).pipe(
      map(created => this.normalize(created)),
      tap(normalized => {
        this.addLocalProduct(normalized);
      })
    );
  }

  update(id: string | number, product: Partial<Product>): Observable<Product> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, product).pipe(
      map(updated => this.normalize(updated)),
      tap(normalized => {
        this.allProducts.update(list =>
          list.map(item => (String(item.id) === String(id) ? normalized : item))
        );
      })
    );
  }

  delete(id: string | number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.allProducts.update(list => list.filter(item => String(item.id) !== String(id)));
      })
    );
  }

  addLocalProduct(newProduct: Product) {
    this.allProducts.update(list => [newProduct, ...list]);
  }
}