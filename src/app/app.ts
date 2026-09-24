import { Component, inject } from '@angular/core';
import { ArticleList } from './components/article-list/article-list';
import { ReadingListService } from './services/reading-list.service';

@Component({
  imports: [ArticleList],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly readingList = inject(ReadingListService);
}
