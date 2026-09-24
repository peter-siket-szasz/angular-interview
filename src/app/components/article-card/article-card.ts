import { Component } from '@angular/core';
import { Article } from '../../models/article';

/** Presentational component: displays a single article and a Save/Remove button. */
@Component({
  selector: 'app-article-card',
  imports: [],
  templateUrl: './article-card.html',
  styleUrl: './article-card.css',
})
export class ArticleCard {
  // TODO (Task 4a): required input `article` of type `Article`.
  // TODO (Task 4b): input `saved` of type boolean, defaults to `false`.
  // TODO (Task 4c): output `saveToggled` that emits the `Article` when the button is clicked.
}
