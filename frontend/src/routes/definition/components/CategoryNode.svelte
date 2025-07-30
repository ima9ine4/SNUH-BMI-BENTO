<script>
    import CategoryNode from './CategoryNode.svelte';
    export let cat;
    export let expanded;
    export let toggle;
    export let isLeaf;
    export let handleDragStart;
    export let depth = 1;
    export let search = '';
    export let highlight = (text, search) => text;
    export let tableName = null;
</script>

<li class="mb-1 select-none">
    {#if cat.columns}
        <button class="flex items-center w-full px-2 py-1 rounded text-gray-800 hover:bg-blue-50 transition-colors font-medium"
                style="padding-left: {depth * 12}px; font-size: {depth === 1 ? '1rem' : '0.97rem'}; font-weight: {depth === 1 ? 500 : 400};"
                on:click={() => toggle(cat.name)}>
            <svg class="w-4 h-4 text-gray-400 transform transition-transform {expanded[cat.name] ? 'rotate-90' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            <span class="flex-1 ml-2 text-left">{@html highlight(cat.name, search)}</span>
        </button>
        {#if expanded[cat.name]}
            <ul class="ml-2 mt-1 border-l border-gray-100 pl-2 pb-2">
                {#each cat.columns as child}
                    <CategoryNode
                        cat={child}
                        {expanded}
                        {toggle}
                        {isLeaf}
                        {handleDragStart}
                        depth={depth + 1}
                        {search}
                        {highlight}
                        {tableName}
                    />
                {/each}
            </ul>
        {/if}
    {:else}
        <div class="flex items-center w-full">
            <span
                draggable="true"
                on:dragstart={(e) => handleDragStart(e, cat, tableName)}
                class="block w-full px-2 py-1 rounded text-gray-700 hover:bg-blue-100 transition-colors text-sm cursor-grab group"
                style="padding-left: {depth * 12}px; font-size: 0.75rem;"
                role="button"
                tabindex="0"
            >
                <div class="flex items-center justify-between w-full">
                    <!-- 컬럼명 -->
                    <span class="flex-1 text-left">
                        {@html highlight(cat.name, search)}
                    </span>
                    <!-- 컬럼타입 -->
                    {#if cat.type}
                        <div class="flex items-center gap-1 ml-2 flex-shrink-0">
                            {#if cat.type === 'select'}
                                <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <title>{cat.type}</title>
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
                                    <path d="M9 12l2 2 4-4" stroke-width="2"/>
                                </svg>
                            {:else if cat.type === 'date' || cat.type === 'datetime'}
                                <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <title>{cat.type}</title>
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
                                    <line x1="16" y1="2" x2="16" y2="6" stroke-width="2"/>
                                    <line x1="8" y1="2" x2="8" y2="6" stroke-width="2"/>
                                    <line x1="3" y1="10" x2="21" y2="10" stroke-width="2"/>
                                </svg>
                            {:else if cat.type === 'upload'}
                                <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <title>{cat.type}</title>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 0l-2-2m2 2l2-2"/>
                                </svg>
                            {:else if cat.type === 'lookup'}
                                <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <title>{cat.type}</title>
                                    <rect x="3" y="3" width="18" height="18" stroke-width="2"/>
                                    <line x1="3" y1="9" x2="21" y2="9" stroke-width="2"/>
                                    <line x1="9" y1="3" x2="9" y2="21" stroke-width="2"/>
                                    <line x1="15" y1="3" x2="15" y2="21" stroke-width="2"/>
                                </svg>
                            {:else if cat.type === 'range'}
                                <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <title>{cat.type}</title>
                                    <line x1="3" y1="12" x2="21" y2="12" stroke-width="2"/>
                                    <circle cx="6" cy="12" r="2" fill="currentColor"/>
                                    <circle cx="18" cy="12" r="2" fill="currentColor"/>
                                    <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                                </svg>
                            {:else if cat.type === 'Y/N'}
                                <span class="w-3.5 h-3.5 flex items-center justify-center text-[5.5px] font-bold text-gray-400 border border-gray-400 rounded" title="Y/N">Y/N</span>
                            {/if}
                        </div>
                    {/if}
                </div>
            </span>
        </div>
    {/if}
</li>