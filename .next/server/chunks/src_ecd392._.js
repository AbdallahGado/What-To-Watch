module.exports = {

"[project]/src/app/data/mockData.ts [app-route] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "ACTORS": ()=>ACTORS,
    "CONTENT": ()=>CONTENT,
    "GENRES": ()=>GENRES,
    "MOODS": ()=>MOODS,
    "TOP_RATED": ()=>TOP_RATED,
    "TRENDING": ()=>TRENDING
});
const MOODS = [
    {
        id: 'happy',
        label: 'Feel Good',
        emoji: '😊',
        color: 'bg-yellow-500'
    },
    {
        id: 'sad',
        label: 'Emotional',
        emoji: '😢',
        color: 'bg-blue-500'
    },
    {
        id: 'excited',
        label: 'Thrilling',
        emoji: '🤩',
        color: 'bg-red-500'
    },
    {
        id: 'chill',
        label: 'Relaxed',
        emoji: '😌',
        color: 'bg-green-500'
    },
    {
        id: 'romantic',
        label: 'Romantic',
        emoji: '🥰',
        color: 'bg-pink-500'
    },
    {
        id: 'scared',
        label: 'Spooky',
        emoji: '😱',
        color: 'bg-purple-500'
    },
    {
        id: 'thoughtful',
        label: 'Mind-bending',
        emoji: '🤔',
        color: 'bg-indigo-500'
    }
];
const GENRES = [
    'Action',
    'Sci-Fi',
    'Drama',
    'Comedy',
    'Thriller',
    'Horror',
    'Romance',
    'Adventure'
];
const ACTORS = [
    {
        id: '1',
        name: 'Timothée Chalamet',
        image: 'https://images.unsplash.com/photo-1618673827854-0065d21af001?auto=format&fit=crop&w=300&q=80'
    },
    {
        id: '2',
        name: 'Zendaya',
        image: 'https://images.unsplash.com/photo-1659303979849-26016aebf76a?auto=format&fit=crop&w=300&q=80'
    },
    {
        id: '3',
        name: 'Oscar Isaac',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
    },
    {
        id: '4',
        name: 'Florence Pugh',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
    }
];
const CONTENT = [
    {
        id: '1',
        title: 'Dune: Part Two',
        type: 'movie',
        rating: 8.9,
        year: 2024,
        poster: 'https://images.unsplash.com/photo-1653045474061-075ba29db54f?auto=format&fit=crop&w=500&q=80',
        backdrop: 'https://images.unsplash.com/photo-1653045474061-075ba29db54f?auto=format&fit=crop&w=1920&q=80',
        genres: [
            'Sci-Fi',
            'Adventure',
            'Drama'
        ],
        duration: '2h 46m',
        description: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
        cast: [
            ACTORS[0],
            ACTORS[1],
            ACTORS[2],
            ACTORS[3]
        ],
        director: 'Denis Villeneuve',
        moods: [
            'excited',
            'thoughtful'
        ]
    },
    {
        id: '2',
        title: 'The Dark Knight',
        type: 'movie',
        rating: 9.0,
        year: 2008,
        poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?auto=format&fit=crop&w=500&q=80',
        backdrop: 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?auto=format&fit=crop&w=1920&q=80',
        genres: [
            'Action',
            'Thriller',
            'Crime'
        ],
        duration: '2h 32m',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        cast: [
            ACTORS[0]
        ],
        director: 'Christopher Nolan',
        moods: [
            'excited',
            'scared'
        ]
    },
    {
        id: '3',
        title: 'Interstellar',
        type: 'movie',
        rating: 8.7,
        year: 2014,
        poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&q=80',
        backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
        genres: [
            'Sci-Fi',
            'Drama',
            'Adventure'
        ],
        duration: '2h 49m',
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        cast: [
            ACTORS[2]
        ],
        director: 'Christopher Nolan',
        moods: [
            'thoughtful',
            'sad',
            'excited'
        ]
    },
    {
        id: '4',
        title: 'La La Land',
        type: 'movie',
        rating: 8.0,
        year: 2016,
        poster: 'https://images.unsplash.com/photo-1719405524206-30751869956f?auto=format&fit=crop&w=500&q=80',
        backdrop: 'https://images.unsplash.com/photo-1719405524206-30751869956f?auto=format&fit=crop&w=1920&q=80',
        genres: [
            'Romance',
            'Drama',
            'Music'
        ],
        duration: '2h 8m',
        description: 'While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.',
        cast: [
            ACTORS[0]
        ],
        director: 'Damien Chazelle',
        moods: [
            'romantic',
            'happy',
            'sad'
        ]
    },
    {
        id: '5',
        title: 'Cyberpunk: Edgerunners',
        type: 'series',
        rating: 8.3,
        year: 2022,
        poster: 'https://images.unsplash.com/photo-1674159057061-394f68e750a5?auto=format&fit=crop&w=500&q=80',
        backdrop: 'https://images.unsplash.com/photo-1674159057061-394f68e750a5?auto=format&fit=crop&w=1920&q=80',
        genres: [
            'Sci-Fi',
            'Action',
            'Animation'
        ],
        duration: '1 Season',
        description: 'In a dystopia riddled with corruption and cybernetic implants, a talented but reckless street kid strives to become a mercenary outlaw — an edgerunner.',
        cast: [],
        moods: [
            'excited',
            'sad'
        ]
    },
    {
        id: '6',
        title: 'Drive',
        type: 'movie',
        rating: 7.8,
        year: 2011,
        poster: 'https://images.unsplash.com/photo-1658754640103-4e28e7c7a6a4?auto=format&fit=crop&w=500&q=80',
        backdrop: 'https://images.unsplash.com/photo-1658754640103-4e28e7c7a6a4?auto=format&fit=crop&w=1920&q=80',
        genres: [
            'Action',
            'Drama'
        ],
        duration: '1h 40m',
        description: 'A mysterious Hollywood stuntman and mechanic moonlights as a getaway driver and finds himself in trouble when he helps out his neighbor.',
        cast: [
            ACTORS[2]
        ],
        moods: [
            'excited',
            'chill'
        ]
    },
    {
        id: '7',
        title: 'Midnight in Paris',
        type: 'movie',
        rating: 7.7,
        year: 2011,
        poster: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&q=80',
        backdrop: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1920&q=80',
        genres: [
            'Romance',
            'Fantasy',
            'Comedy'
        ],
        duration: '1h 34m',
        description: 'While on a trip to Paris with his fiancée\'s family, a nostalgic screenwriter finds himself mysteriously going back to the 1920s everyday at midnight.',
        cast: [],
        moods: [
            'chill',
            'romantic',
            'happy'
        ]
    }
];
const TRENDING = [
    CONTENT[0],
    CONTENT[2],
    CONTENT[4],
    CONTENT[1]
];
const TOP_RATED = [
    CONTENT[1],
    CONTENT[0],
    CONTENT[2],
    CONTENT[3]
];

})()),
"[project]/src/lib/tmdb.ts [app-route] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "getDiscoverMovies": ()=>getDiscoverMovies,
    "getDiscoverTv": ()=>getDiscoverTv,
    "getMovieDetails": ()=>getMovieDetails,
    "getMovieVideos": ()=>getMovieVideos,
    "getNowPlayingMovies": ()=>getNowPlayingMovies,
    "getPersonDetails": ()=>getPersonDetails,
    "getPopularPeople": ()=>getPopularPeople,
    "getSmartRecommendations": ()=>getSmartRecommendations,
    "getTmdbApiKey": ()=>getTmdbApiKey,
    "getTopRatedMovies": ()=>getTopRatedMovies,
    "getTopRatedTv": ()=>getTopRatedTv,
    "getTrending": ()=>getTrending,
    "getTvDetails": ()=>getTvDetails,
    "getTvVideos": ()=>getTvVideos,
    "getUpcomingMovies": ()=>getUpcomingMovies,
    "hasTmdbApiKey": ()=>hasTmdbApiKey,
    "searchMulti": ()=>searchMulti
});
var __TURBOPACK__commonjs__external__fs__ = __turbopack_external_require__("fs", true);
var __TURBOPACK__commonjs__external__path__ = __turbopack_external_require__("path", true);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$data$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/app/data/mockData.ts [app-route] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
;
;
// TMDB API client - server-only utilities for fetching movie/TV data.
// All functions are async and should be called only from server components or API routes.
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const DEFAULT_REVALIDATE_SECONDS = 3600; // Increased to 1 hour for better performance
let cachedApiKey = process.env.TMDB_API_KEY ?? null;
let didReadEnvFile = false;
let didWarnMissing = false;
function readApiKeyFromEnvFile() {
    try {
        const envPath = __TURBOPACK__commonjs__external__fs__["default"].resolve(process.cwd(), '.env.local');
        if (!__TURBOPACK__commonjs__external__fs__["default"].existsSync(envPath)) return null;
        const raw = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$data$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TRENDING"].readFileSync(envPath, 'utf8');
        const match = raw.match(/TMDB_API_KEY\s*=\s*\"?([^\"\n\r]+)\"?/);
        return match && match[1] ? match[1].trim() : null;
    } catch  {
        return null;
    }
}
function getTmdbApiKey() {
    if (cachedApiKey) return cachedApiKey;
    if (!didReadEnvFile) {
        didReadEnvFile = true;
        const fromFile = readApiKeyFromEnvFile();
        if (fromFile) {
            cachedApiKey = fromFile;
            process.env.TMDB_API_KEY = fromFile;
            return cachedApiKey;
        }
    }
    if (!didWarnMissing) {
        console.warn('TMDB_API_KEY is not set. TMDB requests will fail. Set it in .env.local.');
        didWarnMissing = true;
    }
    return null;
}
function hasTmdbApiKey() {
    return Boolean(getTmdbApiKey());
}
// Development mock data fallback (used only when TMDB key is missing)
const FORCE_MOCK = process.env.USE_MOCK_DATA === 'true';
const USE_MOCK = FORCE_MOCK ? true : !hasTmdbApiKey();
function assignMediaType(items, mediaType) {
    return items.map((item)=>({
            ...item,
            media_type: item.media_type ?? mediaType
        }));
}
// Request deduplication cache to prevent duplicate API calls
const requestCache = new Map();
async function tmdbFetch(path, searchParams, options = {}) {
    const apiKey = getTmdbApiKey();
    if (!apiKey) {
        if (options.fallback !== undefined) return options.fallback;
        throw new Error('TMDB_API_KEY is not set.');
    }
    const url = new URL(`${TMDB_BASE_URL}${path}`);
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('language', 'en-US');
    if (searchParams) {
        Object.entries(searchParams).forEach(([key, value])=>{
            if (value !== undefined) {
                url.searchParams.set(key, String(value));
            }
        });
    }
    const cacheKey = url.toString();
    // Return cached promise if request is in flight to deduplicate requests
    if (requestCache.has(cacheKey)) {
        return requestCache.get(cacheKey);
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(()=>controller.abort(), 8000); // 8s timeout
    try {
        const fetchPromise = fetch(url.toString(), {
            next: {
                revalidate: options.revalidate ?? DEFAULT_REVALIDATE_SECONDS
            },
            signal: controller.signal
        }).then(async (res)=>{
            clearTimeout(timeoutId);
            if (!res.ok) {
                if (options.fallback !== undefined) {
                    return options.fallback;
                }
                throw new Error(`TMDB request failed: ${res.status} ${res.statusText}`);
            }
            return res.json();
        }).catch((error)=>{
            clearTimeout(timeoutId);
            // Remove from cache on error
            requestCache.delete(cacheKey);
            if (options.fallback !== undefined) {
                console.warn(`TMDB fetch failed for ${path}, using fallback.`, error.message);
                return options.fallback;
            }
            throw error;
        });
        requestCache.set(cacheKey, fetchPromise);
        // Clean up cache after request completes
        fetchPromise.finally(()=>{
            requestCache.delete(cacheKey);
        });
        return fetchPromise;
    } catch (err) {
        clearTimeout(timeoutId);
        if (options.fallback !== undefined) return options.fallback;
        throw err;
    }
}
async function getTrending() {
    if (USE_MOCK) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$data$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TOP_RATED"].map((c)=>({
                id: Number(c.id),
                media_type: c.type === 'series' ? 'tv' : 'movie',
                title: c.title,
                overview: c.description,
                poster_path: c.poster ?? null,
                backdrop_path: c.backdrop ?? null,
                vote_average: c.rating
            }));
    }
    const data = await tmdbFetch('/trending/all/week', undefined, {
        fallback: {
            results: []
        }
    });
    return data.results.filter((item)=>item.media_type === 'movie' || item.media_type === 'tv');
}
async function getTopRatedMovies() {
    if (USE_MOCK) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$data$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ACTORS"].map((c)=>({
                id: Number(c.id),
                media_type: 'movie',
                title: c.title,
                overview: c.description,
                poster_path: c.poster ?? null,
                backdrop_path: c.backdrop ?? null,
                vote_average: c.rating
            }));
    }
    const data = await tmdbFetch('/movie/top_rated', undefined, {
        fallback: {
            results: []
        }
    });
    return assignMediaType(data.results, 'movie');
}
async function getPopularPeople() {
    if (USE_MOCK) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$data$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CONTENT"].map((a, idx)=>({
                id: idx + 1,
                name: a.name,
                profile_path: a.image ?? null,
                known_for_department: 'Acting'
            }));
    }
    const data = await tmdbFetch('/person/popular', undefined, {
        fallback: {
            results: []
        }
    });
    return data.results;
}
async function searchMulti(query) {
    const data = await tmdbFetch('/search/multi', {
        query,
        include_adult: 0
    }, {
        fallback: {
            results: []
        }
    });
    return data.results.filter((item)=>item.media_type === 'movie' || item.media_type === 'tv');
}
async function getMovieDetails(id) {
    if (USE_MOCK) {
        const c = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$data$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CONTENT"].find((x)=>x.id === String(id) || Number(x.id) === Number(id));
        if (!c) return null;
        return {
            id: Number(c.id),
            media_type: c.type === 'series' ? 'tv' : 'movie',
            title: c.title,
            overview: c.description,
            poster_path: c.poster ?? null,
            backdrop_path: c.backdrop ?? null,
            vote_average: c.rating,
            release_date: `${c.year}-01-01`,
            videos: {
                results: [
                    {
                        key: 'dQw4w9WgXcQ',
                        type: 'Trailer'
                    }
                ]
            },
            credits: {
                cast: c.cast.map((a)=>({
                        id: Number(a.id),
                        name: a.name,
                        profile_path: a.image ?? null
                    })),
                crew: []
            },
            similar: {
                results: []
            }
        };
    }
    const data = await tmdbFetch(`/movie/${id}`, {
        append_to_response: 'videos,credits,similar'
    }, {
        fallback: null
    });
    if (!data || !data.id) return null;
    const similar = data.similar?.results ? {
        results: assignMediaType(data.similar.results, 'movie')
    } : data.similar;
    return {
        ...data,
        media_type: data.media_type ?? 'movie',
        similar
    };
}
async function getTvDetails(id) {
    if (USE_MOCK) {
        const c = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$data$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ACTORS"].find((x)=>x.type === 'series' && (x.id === String(id) || Number(x.id) === Number(id)));
        if (!c) return null;
        return {
            id: Number(c.id),
            media_type: 'tv',
            name: c.title,
            overview: c.description,
            poster_path: c.poster ?? null,
            backdrop_path: c.backdrop ?? null,
            vote_average: c.rating,
            first_air_date: `${c.year}-01-01`,
            videos: {
                results: [
                    {
                        key: 'dQw4w9WgXcQ',
                        type: 'Trailer'
                    }
                ]
            },
            credits: {
                cast: c.cast.map((a)=>({
                        id: Number(a.id),
                        name: a.name,
                        profile_path: a.image ?? null
                    })),
                crew: []
            },
            similar: {
                results: []
            }
        };
    }
    const data = await tmdbFetch(`/tv/${id}`, {
        append_to_response: 'videos,credits,similar'
    }, {
        fallback: null
    });
    if (!data || !data.id) return null;
    const similar = data.similar?.results ? {
        results: assignMediaType(data.similar.results, 'tv')
    } : data.similar;
    return {
        ...data,
        media_type: data.media_type ?? 'tv',
        similar
    };
}
async function getPersonDetails(id) {
    if (USE_MOCK) {
        const actor = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$data$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CONTENT"].find((a)=>a.id === String(id));
        if (!actor) return null;
        return {
            id: Number(actor.id),
            name: actor.name,
            profile_path: actor.image ?? null,
            known_for_department: 'Acting',
            combined_credits: {
                cast: []
            }
        };
    }
    const data = await tmdbFetch(`/person/${id}`, {
        append_to_response: 'combined_credits'
    }, {
        fallback: null
    });
    return data && data.id ? data : null;
}
async function getUpcomingMovies() {
    if (USE_MOCK) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$data$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CONTENT"].slice(3, 6).map((c)=>({
                id: Number(c.id),
                media_type: 'movie',
                title: c.title,
                overview: c.description,
                poster_path: c.poster ?? null,
                backdrop_path: c.backdrop ?? null,
                vote_average: c.rating
            }));
    }
    const data = await tmdbFetch('/movie/upcoming', undefined, {
        fallback: {
            results: []
        }
    });
    return assignMediaType(data.results, 'movie');
}
async function getNowPlayingMovies() {
    if (USE_MOCK) {
        return CONTENT.slice(5, 7).map((c)=>({
                id: Number(c.id),
                media_type: 'movie',
                title: c.title,
                overview: c.description,
                poster_path: c.poster ?? null,
                backdrop_path: c.backdrop ?? null,
                vote_average: c.rating
            }));
    }
    const data = await tmdbFetch('/movie/now_playing', undefined, {
        fallback: {
            results: []
        }
    });
    return assignMediaType(data.results, 'movie');
}
async function getTopRatedTv() {
    const data = await tmdbFetch('/tv/top_rated', undefined, {
        fallback: {
            results: []
        }
    });
    return assignMediaType(data.results, 'tv');
}
async function getDiscoverMovies(genre, sort = 'popularity.desc', page = 1) {
    const params = {
        sort_by: sort,
        include_adult: 0,
        include_video: 'true',
        'vote_count.gte': 50,
        page: page
    };
    if (genre && genre !== 'all') {
        params.with_genres = genre;
    }
    const data = await tmdbFetch('/discover/movie', params, {
        fallback: {
            results: []
        }
    });
    return assignMediaType(data.results, 'movie');
}
async function getDiscoverTv(genre, sort = 'popularity.desc', page = 1) {
    const params = {
        sort_by: sort,
        include_adult: 0,
        'vote_count.gte': 50,
        page: page
    };
    if (genre && genre !== 'all') {
        params.with_genres = genre;
    }
    const data = await tmdbFetch('/discover/tv', params, {
        fallback: {
            results: []
        }
    });
    return assignMediaType(data.results, 'tv');
}
async function getMovieVideos(id) {
    try {
        if (USE_MOCK) {
            // Provide a dummy trailer key for mock content so hero can try to load video
            return [
                {
                    key: 'dQw4w9WgXcQ',
                    type: 'Trailer'
                }
            ];
        }
        const data = await tmdbFetch(`/movie/${id}/videos`, undefined, {
            fallback: {
                results: []
            }
        });
        return data.results ?? [];
    } catch  {
        return [];
    }
}
async function getTvVideos(id) {
    try {
        if (USE_MOCK) {
            return [
                {
                    key: 'dQw4w9WgXcQ',
                    type: 'Trailer'
                }
            ];
        }
        const data = await tmdbFetch(`/tv/${id}/videos`, undefined, {
            fallback: {
                results: []
            }
        });
        return data.results ?? [];
    } catch  {
        return [];
    }
}
;
// ... existing code ...
export async function getSmartRecommendations(input) {
    const { type, mood, genres: userGenres, runtimeMinutes, withFriends, language } = input;
    const config = MOOD_CONFIGS[mood] || MOOD_CONFIGS.chill;
    const targetGenres = Array.from(new Set([
        ...config.genres,
        ...userGenres
    ]));
    const voteAverageGte = Math.max(config.voteAverageGte, withFriends ? 7.2 : 6.0);
    const voteCountGte = withFriends ? 500 : 100;
    const commonParams = {
        with_genres: targetGenres.join(','),
        'vote_average.gte': voteAverageGte,
        'vote_count.gte': voteCountGte,
        sort_by: 'popularity.desc'
    };
    if (language === 'english') {
        commonParams.with_original_language = 'en';
    }
    if (config.era) {
        commonParams['primary_release_date.gte'] = `${config.era.start}-01-01`;
        commonParams['primary_release_date.lte'] = `${config.era.end}-12-31`;
    }
    // Fetch a larger pool of items to score (e.g., top 40)
    const fetchPool = async (mediaType)=>{
        const params = {
            ...commonParams
        };
        if (mediaType === 'movie' && runtimeMinutes) {
            params['with_runtime.lte'] = runtimeMinutes;
        }
        const data = await tmdbFetch(`/discover/${mediaType}`, params, {
            fallback: {
                results: []
            }
        });
        return assignMediaType(data.results, mediaType);
    };
    let pool = [];
    if (type === 'movie') {
        pool = await fetchPool('movie');
    } else if (type === 'tv') {
        pool = await fetchPool('tv');
    } else {
        const [movies, tv] = await Promise.all([
            fetchPool('movie'),
            fetchPool('tv')
        ]);
        pool = [
            ...movies,
            ...tv
        ];
    }
    // Score the results
    const scoredResults = pool.map((item)=>{
        let score = 0;
        // 1. Genre Overlap (30 pts)
        const itemGenres = item.genre_ids || [];
        const matchedGenres = targetGenres.filter((g)=>itemGenres.includes(g));
        score += matchedGenres.length / targetGenres.length * 30;
        // 2. Rating & Popularity (20 pts)
        score += (item.vote_average || 0) * 1.5; // (Avg 7-8 -> 10.5-12 pts)
        score += Math.min((item.vote_count || 0) / 2000, 5); // (Max 5 pts)
        // 3. User specifics (10 pts)
        if (userGenres.some((g)=>itemGenres.includes(g))) score += 10;
        // 4. Group Fit (5 pts)
        if (withFriends && (item.vote_average || 0) > 7.5) score += 5;
        return {
            ...item,
            matchScore: score
        };
    });
    // Sort and take top 12
    return scoredResults.sort((a, b)=>(b.matchScore || 0) - (a.matchScore || 0)).slice(0, 12);
}

})()),
"[project]/src/app/api/tmdb/videos/route.ts [app-route] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "GET": ()=>GET
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tmdb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/lib/tmdb.ts [app-route] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
;
const JSON_CACHE_HEADERS = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
};
async function GET(req) {
    try {
        // If TMDB API key isn't configured, return empty list (dev mode/fallback)
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tmdb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasTmdbApiKey"])()) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json([], {
                status: 200,
                headers: JSON_CACHE_HEADERS
            });
        }
        const url = new URL(req.url);
        const id = url.searchParams.get('id');
        const type = url.searchParams.get('type');
        if (!id || !type) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Missing id or type'
            }, {
                status: 400
            });
        }
        const numericId = Number(id);
        if (Number.isNaN(numericId)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid id'
            }, {
                status: 400
            });
        }
        let videos;
        if (type === 'movie') {
            videos = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tmdb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMovieVideos"])(numericId);
        } else {
            videos = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tmdb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTvVideos"])(numericId);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(videos, {
            headers: JSON_CACHE_HEADERS
        });
    } catch (err) {
        console.error('TMDB videos API error', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal error'
        }, {
            status: 500
        });
    }
}

})()),

};

//# sourceMappingURL=src_ecd392._.js.map