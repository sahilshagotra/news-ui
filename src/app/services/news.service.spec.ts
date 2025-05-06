import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NewsService } from './news.service';
import { Story } from '../models/story';

describe('NewsService', () => {
  let service: NewsService;
  let httpMock: HttpTestingController;

  const mockStories: Story[] = [
    { id:1, title: 'Test Story 1', url: 'http://example.com/1' },
    { id:2, title: 'Test Story 2', url: 'http://example.com/2' },
    { id:3, title: 'Searchable Test Story 3', url: 'http://example.com/3' },
    { id: 4, title: 'Test Story 4' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [NewsService]
    });

    service = TestBed.inject(NewsService);    
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch newest stories and filtr by search query', () => {
    const searchQuery = 'Searchable';
    service.getNewestStories(1, 20, searchQuery).subscribe(stories => {
      expect(stories.length).toBe(1);
      expect(stories[0].title).toBe('Searchable Test Story 3');
    });
    const req = httpMock.expectOne('https://localhost:7192/api/News/newest?page=1&pageSize=20&query=' + encodeURIComponent(searchQuery));
    expect(req.request.method).toBe('GET');
    const filtered = mockStories.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));
    req.flush(filtered);
  });

  it('should paginate to the next page', () => {
    service.getNewestStories(2, 20, '').subscribe(stories => {
      expect(stories.length).toBe(4); 
      expect(stories[0].title).toBe('Test Story 1');
    });

    const req = httpMock.expectOne('https://localhost:7192/api/News/newest?page=2&pageSize=20');
    expect(req.request.method).toBe('GET');
    req.flush(mockStories);
  });

  it('should paginate with search query', () => {
    const searchQuery = 'Searchable';
    service.getNewestStories(2, 20, searchQuery).subscribe(stories => {
      expect(stories.length).toBe(1);  // Filtered stories on page 2
      expect(stories[0].title).toBe('Searchable Test Story 3');
    });

    const req = httpMock.expectOne('https://localhost:7192/api/News/newest?page=2&pageSize=20&query=' + encodeURIComponent(searchQuery));
    expect(req.request.method).toBe('GET');
    req.flush([mockStories[2]]);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
