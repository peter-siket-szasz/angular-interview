import { Article } from '../models/article';

/** Test data used by the specs. Shaped like the JSONPlaceholder `/posts` response. */
export const MOCK_ARTICLES: Article[] = [
  {
    userId: 1,
    id: 1,
    title: 'sunt aut facere repellat provident',
    body:
      'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit ' +
      'molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto',
  },
  {
    userId: 1,
    id: 2,
    title: 'qui est esse',
    body:
      'est rerum tempore vitae sequi sint nihil reprehenderit dolor beatae ea dolores ' +
      'neque fugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis qui aperiam',
  },
  {
    userId: 2,
    id: 3,
    title: 'ea molestias quasi exercitationem',
    body: 'short body',
  },
];
