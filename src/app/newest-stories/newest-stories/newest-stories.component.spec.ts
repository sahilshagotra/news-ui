import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { NewestStoriesComponent } from './newest-stories.component';
import { HttpClientModule } from '@angular/common/http';
import { NewsService } from 'src/app/services/news.service';

describe('NewestStoriesComponent', () => {
  let component: NewestStoriesComponent;
  let fixture: ComponentFixture<NewestStoriesComponent>;
  let httpMock: HttpTestingController;
  let newsService: NewsService;

  const mockStories = [
    { id:1, title: 'Test Story 1', url: 'http://example.com/1' },
    { id:2, title: 'Test Story 2', url: 'http://example.com/2' },
    { id: 3, title: 'Searchable Test Story 3', url: 'http://example.com/3' },
    { id: 4, title: 'Test Story 4' },
    
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewestStoriesComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [NewsService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewestStoriesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    newsService = TestBed.inject(NewsService);
  });

  it('should create the component', fakeAsync(() => {
    fixture.detectChanges();
    const req = httpMock.expectOne('https://localhost:7192/api/News/newest?page=1&pageSize=20');
    expect(req.request.method).toBe('GET');
    req.flush(mockStories);
    tick();

    expect(component).toBeTruthy();
  }));

  it('should fetch stories and filter stories with URL', fakeAsync(() => {
    component.loadStories();

    const req = httpMock.expectOne('https://localhost:7192/api/News/newest?page=1&pageSize=20');
    req.flush(mockStories);

    tick();
    expect(component.stories.length).toBe(3);
    expect(component.stories.every(story => !!story.url)).toBeTrue();
  }));

  it('should paginate to the next page', fakeAsync(() => {
    component.page = 1;
    component.nextPage();
    const req = httpMock.expectOne('https://localhost:7192/api/News/newest?page=2&pageSize=20');
    req.flush(mockStories);
    tick();
    expect(component.page).toBe(2);
  }));

  it('should paginate to the previous page', fakeAsync(() => {
    component.page = 2;
    component.prevPage();
    const req = httpMock.expectOne('https://localhost:7192/api/News/newest?page=1&pageSize=20');
    req.flush(mockStories);
    tick();
    expect(component.page).toBe(1);
  }));

  it('should apply search and fetch filtered stories', fakeAsync(() => {
    component.searchQuery = 'Searchable';
    component.applySearch();
    const req = httpMock.expectOne('https://localhost:7192/api/News/newest?page=1&pageSize=20&query=Searchable');
    expect(req.request.method).toBe('GET');
    req.flush([mockStories[2]]);
    tick();
    expect(component.stories.length).toBe(1);
    expect(component.stories[0].title).toBe('Searchable Test Story 3');
  }));

  it('should handle pagination with search query', fakeAsync(() => {
    component.searchQuery = 'Searchable';
    component.page = 1;
    component.nextPage();
    const req = httpMock.expectOne('https://localhost:7192/api/News/newest?page=2&pageSize=20&query=Searchable');
    req.flush([]);
    tick();
    expect(component.page).toBe(2);
  }));


  afterEach(() => {
    httpMock.verify();
  });
});
