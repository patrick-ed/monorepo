import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer, of, concat } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

export interface SiteStatus {
  url: string;
  name: string;
  status: 'UP' | 'DOWN' | 'LOADING';
  latency: number;
}

export interface Site{
  url: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class SiteMonitoringService {

  googleDns: Site = {url: 'https://dns.google/resolve?name=patrickdd.com', name: 'dns.google'} // Control variable

  // TODO: Uncomment when CORS is sorted out.
  // admin: Site = {url: 'https://admin.patrickdd.com/api/v1/public/ping', name: 'admin.patrickdd.com'}
  // portfolio: Site = {url: 'https://portfolio.patrickdd.com/api/v1/ping', name: 'portfolio.patrickdd.com'}
  // template: Site = {url: 'https://template.patrickdd.com/api/v1/ping', name: 'template.patrickdd.com'}

  private readonly sites = [this.googleDns];

  constructor(private http: HttpClient) {}

  getSiteStatuses(): Observable<SiteStatus[]> {
    return timer(0, 300000).pipe( // Check every 5 minutes (300000 ms)
      switchMap(() => {
        const loadingStatuses: SiteStatus[] = this.sites.map(site => ({
          url: site.url,
          name: site.name,
          status: 'LOADING',
          latency: 0
        }));

        const loadingObservable = of(loadingStatuses);
        const pingObservables = this.sites.map(site => this.pingSite(site));
        const resultsObservable = combineLatest(pingObservables);

        return concat(loadingObservable, resultsObservable);
      })
    );
  }

  private pingSite(site: Site): Observable<SiteStatus> {

    const startTime = Date.now();
    const url = site.url;

    return this.http.get(url, { observe: 'response', responseType: 'text' }).pipe(
      map(() => {
        const latency = Date.now() - startTime;
        const response: SiteStatus = {name: site.name,url: url, status: 'UP', latency: latency}
        return response;
      }),
      catchError(() => {
        const latency = Date.now() - startTime;
        const response: SiteStatus = {name: site.name,url: url, status: 'DOWN', latency: latency}
        return of(response);
      })
    );
  }
}
