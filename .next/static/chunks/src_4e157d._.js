(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_4e157d._.js", {

"[project]/src/lib/clerk-appearance.ts [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "clerkAppearance": ()=>clerkAppearance,
    "clerkEnabled": ()=>clerkEnabled
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
const clerkEnabled = Boolean(("TURBOPACK compile-time value", "pk_test_Y29zbWljLWdydWItMTQuY2xlcmsuYWNjb3VudHMuZGV2JA"));
const clerkAppearance = {
    variables: {
        colorPrimary: '#7c5cff',
        colorBackground: '#0b0d11',
        colorText: '#f8fafc',
        colorTextSecondary: 'rgba(255, 255, 255, 0.6)',
        colorInputBackground: 'rgba(255, 255, 255, 0.08)',
        colorInputText: '#f8fafc',
        borderRadius: '18px',
        fontFamily: 'var(--font-display), var(--font-sans)'
    },
    elements: {
        card: 'bg-[#0b0d11] border border-white/10 shadow-2xl shadow-black/40',
        navbar: 'bg-transparent border-b border-white/10',
        headerTitle: 'text-white font-display',
        headerSubtitle: 'text-white/60',
        formButtonPrimary: 'bg-white text-background hover:bg-brand-50 shadow-lg shadow-white/10 rounded-2xl',
        formFieldLabel: 'text-white/70',
        formFieldInput: 'bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-2xl focus:border-brand-400 focus:ring-brand-400/40',
        dividerLine: 'bg-white/10',
        dividerText: 'text-white/40'
    }
};

})()),
"[project]/src/features/watchlist/store.ts [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "useWatchlistStore": ()=>useWatchlistStore
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
'use client';
;
const keyFor = (id, mediaType)=>`${mediaType}:${id}`;
;
const useWatchlistStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        items: {},
        add: (item)=>set((state)=>({
                    items: {
                        ...state.items,
                        [keyFor(item.id, item.mediaType)]: item
                    }
                })),
        remove: (id, mediaType)=>set((state)=>{
                const key = keyFor(id, mediaType);
                const { [key]: _removed, ...rest } = state.items;
                return {
                    items: rest
                };
            }),
        toggle: (item)=>{
            const key = keyFor(item.id, item.mediaType);
            const exists = get().items[key];
            if (exists) {
                get().remove(item.id, item.mediaType);
            } else {
                get().add(item);
            }
        },
        isSaved: (id, mediaType)=>Boolean(get().items[keyFor(id, mediaType)]),
        clear: ()=>set({
                items: {}
            })
    }), {
    name: 'watchlist-storage'
}));

})()),
"[project]/src/components/providers.tsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "Providers": ()=>Providers
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_import__("[project]/node_modules/@clerk/nextjs/dist/esm/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$PromisifiedAuthProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__usePromisifiedAuth__as__useAuth$3e$__ = __turbopack_import__("[project]/node_modules/@clerk/nextjs/dist/esm/client-boundary/PromisifiedAuthProvider.js [app-client] (ecmascript) <export usePromisifiedAuth as useAuth>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clerk$2d$appearance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/lib/clerk-appearance.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$watchlist$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/features/watchlist/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
var _s = __turbopack_refresh__.signature(), _s1 = __turbopack_refresh__.signature();
'use client';
;
;
;
;
;
;
;
// Optimized QueryClient configuration for better caching and performance
function createQueryClient() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"]({
        defaultOptions: {
            queries: {
                // Prevents refetch on component remount for 5 minutes
                staleTime: 5 * 60 * 1000,
                // Cache data for 30 minutes
                gcTime: 30 * 60 * 1000,
                // Retry failed requests once
                retry: 1,
                // Reduce network requests with aggressive stale-while-revalidate
                refetchOnWindowFocus: false,
                refetchOnReconnect: true,
                refetchOnMount: false
            },
            mutations: {
                retry: 1
            }
        }
    });
}
function WatchlistSignOutReset() {
    _s();
    const { isSignedIn, isLoaded } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$PromisifiedAuthProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__usePromisifiedAuth__as__useAuth$3e$__["useAuth"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isLoaded) return;
        if (!isSignedIn) {
            const store = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$watchlist$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWatchlistStore"].getState();
            if (Object.keys(store.items).length > 0) {
                store.clear();
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$watchlist$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWatchlistStore"].persist?.clearStorage?.();
        }
    }, [
        isLoaded,
        isSignedIn
    ]);
    return null;
}
_s(WatchlistSignOutReset, "O4S6Eemy9Yhira5woSZGgzYRooQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$PromisifiedAuthProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__usePromisifiedAuth__as__useAuth$3e$__["useAuth"]
    ];
});
_c = WatchlistSignOutReset;
function Providers({ children }) {
    _s1();
    // Memoize QueryClient to prevent recreation on every render
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])(()=>createQueryClient(), []);
    const app = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        attribute: "class",
        defaultTheme: "dark",
        enableSystem: true,
        disableTransitionOnChange: true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
            client: queryClient,
            children: [
                children,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toaster"], {
                    position: "bottom-center",
                    theme: "dark",
                    richColors: true,
                    closeButton: true
                }, void 0, false, {
                    fileName: "[project]/src/components/providers.tsx",
                    lineNumber: 59,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/providers.tsx",
            lineNumber: 57,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/providers.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
    const clerkKey = ("TURBOPACK compile-time value", "pk_test_Y29zbWljLWdydWItMTQuY2xlcmsuYWNjb3VudHMuZGV2JA");
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clerk$2d$appearance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clerkEnabled"] || !clerkKey) {
        return app;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ClerkProvider"], {
        publishableKey: clerkKey,
        appearance: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clerk$2d$appearance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clerkAppearance"],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WatchlistSignOutReset, {}, void 0, false, {
                fileName: "[project]/src/components/providers.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this),
            app
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/providers.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, this);
}
_s1(Providers, "zrvdoGfdEL4xQ2X6q2pwq9Tfz78=");
_c1 = Providers;
var _c, _c1;
__turbopack_refresh__.register(_c, "WatchlistSignOutReset");
__turbopack_refresh__.register(_c1, "Providers");

})()),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname }) => (() => {


})()),
}]);

//# sourceMappingURL=src_4e157d._.js.map