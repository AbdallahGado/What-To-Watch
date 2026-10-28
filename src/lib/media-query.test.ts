import { describe, expect, it } from 'vitest';
import { MediaQueryError, parseMediaQuery, parseMediaResults } from './media-query';

describe('parseMediaQuery', () => {
  it('uses browse defaults when no parameters are supplied', () => {
    expect(parseMediaQuery(new URLSearchParams())).toEqual({
      type: 'movie',
      genre: 'all',
      sort: 'popularity.desc',
      page: 1,
    });
  });

  it('parses supported TV filters and pagination', () => {
    expect(
      parseMediaQuery(
        new URLSearchParams({
          type: 'tv',
          genre: '10765',
          sort: 'first_air_date.desc',
          page: '4',
        })
      )
    ).toEqual({
      type: 'tv',
      genre: '10765',
      sort: 'first_air_date.desc',
      page: 4,
    });
  });

  it.each([
    'type=person',
    'type=movie&sort=first_air_date.desc',
    'genre=abc',
    'page=0',
    'page=1.5',
    'page=501',
  ])('rejects unsupported query parameters (%s)', (query) => {
    expect(() => parseMediaQuery(new URLSearchParams(query))).toThrow(MediaQueryError);
  });
});

describe('parseMediaResults', () => {
  it('accepts an array of TMDB media results', () => {
    expect(
      parseMediaResults([
        {
          id: 11,
          title: 'Example',
          overview: 'A short synopsis.',
          poster_path: null,
          backdrop_path: '/backdrop.jpg',
          vote_average: 7.5,
          media_type: 'movie',
        },
      ])
    ).toHaveLength(1);
  });

  it.each([null, {}, [{ id: 'invalid' }], [null]])(
    'rejects an invalid media response (%s)',
    (response) => {
      expect(() => parseMediaResults(response)).toThrow(
        'The media service returned an invalid response.'
      );
    }
  );
});
