import { Component, OnInit } from '@angular/core';
import { Story } from 'src/app/models/story';
import { NewsService } from 'src/app/services/news.service';



@Component({
  selector: 'app-newest-stories',
  templateUrl: './newest-stories.component.html',
  styleUrls: ['./newest-stories.component.css']
})
export class NewestStoriesComponent implements OnInit 
{
  stories: Story[] = [];
  page: number = 1;
  pageSize: number = 20;
  searchQuery: string = '';
  loading = false;
  hasMore: boolean = true;

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.loadStories();
  }
  loadStories() {
    this.loading = true;
    this.newsService.getNewestStories(this.page, this.pageSize, this.searchQuery).subscribe({
      next: (stories) => {
      this.stories = stories.filter(story=>story.url);
      this.hasMore=stories.length===this.pageSize;
      this.loading = false; 
    },
    error: () => {
      this.loading = false;
    }
  });
  }

  applySearch(): void {
  this.page=1;
  this.loadStories();
  }

  nextPage(): void 
  {
    if(this.hasMore){
    this.page++;
    this.loadStories();
  }
}

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadStories();
    }
  }

}
