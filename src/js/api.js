import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const KEY = '38346186-0e7383a20635be2cd3597c465';

export async function fetchImages(query, page, perPage) {
  const resp = await axios.get(
    `?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  return resp;
}