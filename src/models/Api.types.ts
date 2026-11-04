//Envoltorio estandar de la API (ApiResponse<T>)
export type ApiResponse<T> = {
  success: boolean;
  message: string | null;
  data: T | null;
  errors: string[] | null;
};

//types de paginado de la API 
export type PagedRequest = {
  pageNumber: number;
  pageSize: number;
}

//pageSize 0 le pide a la API todos los registros, sin paginar
export const TODOS_LOS_REGISTROS: PagedRequest = { pageNumber: 1, pageSize: 0 };

export type PagedResult<T> = {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};
