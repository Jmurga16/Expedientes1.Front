import { HttpParams } from "@angular/common/http";

export class HttpParamsUtility {
  public static buildHttpParams(data: any): HttpParams {
    let params = new HttpParams();
    params = this.populateHttpParams(params, data, "");
    return params;
  }

  private static populateHttpParams(
    params: HttpParams,
    data: any,
    currentPath: string
  ) {
    Object.keys(data).forEach((key) => {
      if (data[key] instanceof Object) {
        if (data[key] instanceof Date)
          params = params.set(`${currentPath}${key}`, data[key].toISOString());
        else if(data[key] instanceof Array)
          params = this.populateArray(params, data[key], `${currentPath}${key}`);
        else
          params = this.populateHttpParams(params, data[key], `${currentPath}${key}.`);
      } else {
        if (data[key]) 
          params = params.set(`${currentPath}${key}`, data[key]);
      }
    });
    return params;
  }

  private static populateArray(params: HttpParams, data: any, currentPath: string){
    Object.keys(data).forEach((key) => {
      if (data[key] instanceof Object) {
        if (data[key] instanceof Date)
          params = params.set(`${currentPath}[${key}]`, data[key].toISOString());
        else if(data[key] instanceof Array)
          params = this.populateArray(params, data[key], `${currentPath}[${key}]`);
        else
          params = this.populateHttpParams(params, data[key], `${currentPath}[${key}].`);
      } else if (data[key]) 
          params = params.set(`${currentPath}[${key}]`, data[key]);
    });
    return params;
  } 
}
