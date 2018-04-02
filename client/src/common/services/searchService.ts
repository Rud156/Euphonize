import BaseRequest from './baseRequest';

class SearchService extends BaseRequest {
  getSearchResults = (searchQuery: string, errorMessage?: string) => {
    return this.getDataFromService(`/search?search_query=${searchQuery}`, errorMessage);
  };
}

export default SearchService;
