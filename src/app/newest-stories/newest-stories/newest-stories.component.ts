import { Component, OnInit } from '@angular/core';
import { NewsService } from 'src/app/services/news.service';



@Component({
  selector: 'app-newest-stories',
  templateUrl: './newest-stories.component.html',
  styleUrls: ['./newest-stories.component.css']
})
export class NewestStoriesComponent implements OnInit 
{
  stories: any[] = [];
  page: number = 1;
  pageSize: number = 20;
  searchQuery: string = '';
  loading = false;
  filteredStories: any[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.loadStories();
  }
  loadStories() {
    this.loading = true;
    this.newsService.getNewestStories(this.page, this.pageSize).subscribe((stories) => {
      this.stories = stories;
      this.applySearch();
      this.loading = false; 
    });
  }

  searchStories() {
    this.newsService.searchStories(this.searchQuery).subscribe((stories) => {
      this.stories = stories;
    });
  }

  applySearch() {
    const query = this.searchQuery.toLowerCase();
    this.filteredStories = this.stories.filter(story =>
      story.title?.toLowerCase().includes(query)
    );
  }

  nextPage() {
    this.page++;
    this.loadStories();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadStories();
    }
  }

}
