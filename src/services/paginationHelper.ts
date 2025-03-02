import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResult } from '../app/models/pagination';
import { map } from 'rxjs';

// the way to add mutiple objects or classes in the same observable
export function getPaginatedResult<T>(
  baseUrl: string,
  params: HttpParams,
  http: HttpClient
) {
  // if you want to create new new PaginatedResult<Member[]>() like this you need to create a class
  //  including the result and pagination
  const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

  return http
    .get<T>(baseUrl, {
      // create this oberve and params because we want to get the response headers
      observe: 'response',
      params,
    })
    .pipe(
      map((response) => {
        paginatedResult.result = response.body as T;

        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(
            // the way to get the pagination headers from the response
            response.headers.get('Pagination') ?? ''
          );
        }
        return paginatedResult;
      })
    );
}

export function getPaginationHeaders(pageNumber: number, pageSize: number) {
  // create this params because we want to send the page number and page size to the server
  let params = new HttpParams();

  params = params.append('pageNumber', pageNumber.toString());
  params = params.append('pageSize', pageSize.toString());

  return params;
}

const PaginationHelper = {
  getPaginatedResult,
  getPaginationHeaders,
};

export default PaginationHelper;
