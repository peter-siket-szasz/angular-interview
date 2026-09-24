import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Article } from '../../models/article';
import { ArticleService } from '../../services/article.service';
import { ReadingListService } from '../../services/reading-list.service';
import { ArticleCard } from '../article-card/article-card';

/** Smart/container component: loads the articles and connects them to the reading list. */
@Component({
  selector: 'app-article-list',
  imports: [ArticleCard],
  templateUrl: './article-list.html',
  styleUrl: './article-list.css',
})
export class ArticleList {
  private readonly articleService = inject(ArticleService);
  protected readonly readingList = inject(ReadingListService);

  /** `undefined` while the request is pending. */
  protected readonly articles = toSignal(this.articleService.getArticles());

  protected onSaveToggled(article: Article): void {
    this.readingList.toggle(article.id);
  }
}
