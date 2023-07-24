import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createMarkupImeges } from './js/createMarkup';
import { fetchImages } from './js/api';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.btn-more');

let query = '';
let page = 1;
const perPage = 40;

searchForm.addEventListener('submit', onSearch);
loadMoreButton.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  page = 1;
  query = e.currentTarget.searchQuery.value.trim();
  clearFormGallery();
  loadMoreButton.classList.add('is-hidden');
  if (query === '') {
    noInfoForSearch();
    return;
  }
  
  fetchImages(query, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        alertNoContentFound();
      } else {
        createMarkupImeges(data.hits);
        const lightbox = new SimpleLightbox('.gallery a', {
          captionDelay: 250,
        }).refresh();
        addTotalInfoCounter(data);

        if (data.totalHits > perPage) {
          loadMoreButton.classList.remove('is-hidden');
        }
      }
    })
    .catch(error => console.log(error));
}

function onLoadMore() {
  page += 1;
  fetchImages(query, page, perPage)
    .then(({ data }) => {
        createMarkupImeges(data.hits);
      const lightbox = new SimpleLightbox('.gallery a', {
        captionDelay: 250,
      }).refresh();

      const totalPages = Math.ceil(data.totalHits / perPage);

      if (page === totalPages) {
        loadMoreButton.classList.add('is-hidden');
        endOfContent();
      }
    })
    .catch(error => console.log(error));
}

function clearFormGallery() {
  gallery.innerHTML = '';
}

function addTotalInfoCounter(data) {
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

function noInfoForSearch() {
  Notiflix.Notify.failure('Please specify your search query.');
}

function endOfContent() {
  Notiflix.Notify.warning(
    "We're sorry, but you've reached the end of search results."
  );
}

function alertNoContentFound() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}