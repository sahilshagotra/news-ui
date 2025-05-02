import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { NewestStoriesComponent } from './newest-stories.component';
import { HttpClientModule } from '@angular/common/http';

describe('NewestStoriesComponent', () => {
  let component: NewestStoriesComponent;
  let fixture: ComponentFixture<NewestStoriesComponent>;
  let httpMock: HttpTestingController;

  const mockStories = [
    { title: 'Test Story 1', url: 'http://example.com/1' },
    { title: 'Test Story 2', url: 'http://example.com/2' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewestStoriesComponent],
      imports: [HttpClientTestingModule, FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewestStoriesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create the component', fakeAsync(() => {
    fixture.detectChanges();
    const req = httpMock.expectOne('https://localhost:7192/api/News/newest?page=1&pageSize=20');
    req.flush(mockStories);
    tick();

    expect(component).toBeTruthy();
  }));

  it('should fetch stories and update filteredStories', fakeAsync(() => {
    component.loadStories();

    const req = httpMock.expectOne('https://localhost:7192/api/News/newest?page=1&pageSize=20');
    expect(req.request.method).toBe('GET');
    req.flush(mockStories);

    tick();
    expect(component.stories.length).toBe(2);
    expect(component.filteredStories.length).toBe(2);
  }));

  it('should filter stories based on search query', fakeAsync(() => {
    component.stories = mockStories;
    component.searchQuery = '1';
    component.applySearch();

    expect(component.filteredStories.length).toBe(1);
    expect(component.filteredStories[0].title).toContain('1');
  }));

  afterEach(() => {
    httpMock.verify();
  });
});
