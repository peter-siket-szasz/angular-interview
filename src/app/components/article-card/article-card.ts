import { TitleCasePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Article } from '../../models/article';
import { TruncatePipe } from '../../pipes/truncate.pipe';

/** Presentational component: displays a single article and a Save/Remove button. */
@Component({
  selector: 'app-article-card',
  imports: [TitleCasePipe, TruncatePipe],
  templateUrl: './article-card.html',
  styleUrl: './article-card.css',
})
export class ArticleCard {
  readonly article = input.required<Article>();
  readonly saved = input(false);
  readonly saveToggled = output<Article>();
}
