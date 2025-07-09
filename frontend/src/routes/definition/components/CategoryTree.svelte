<script>
    import CategoryNode from './CategoryNode.svelte';
    import { categories } from '../data/categories.js';

    let expanded = {};
    for (const cat of categories) {
        expanded[cat.table] = false;
        if (cat.columns) {
            for (const child of cat.columns) {
                if (child.columns) expanded[child.name] = true;
            }
        }
    }

    let search = '';

    function toggle(table) {
        expanded[table] = !expanded[table];
    }

    function isLeaf(item) {
        return !item.columns;
    }

    function handleDragStart(event, item, tableName = null) {
        // 테이블명과 필드명을 JSON으로 전달
        const dragData = {
            tableName: tableName || item.table || '알 수 없음',
            fieldName: item.name || item.table
        };
        event.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    }

    function filterTree(tree, keyword) {
        if (!keyword) return tree;
        keyword = keyword.toLowerCase();
        return tree
            .map(cat => {
            // 테이블명 매치
            if (cat.table && cat.table.toLowerCase().includes(keyword)) return cat;
            // 컬럼명 매치
            if (cat.columns) {
                const filteredCols = cat.columns
                .map(col => {
                    if (col.name && col.name.toLowerCase().includes(keyword)) return col;
                    if (col.columns) {
                    const filteredSub = filterTree([col], keyword);
                    if (filteredSub.length > 0) return { ...col, columns: filteredSub[0].columns };
                    }
                    return null;
                })
                .filter(Boolean);
                if (filteredCols.length > 0) return { ...cat, columns: filteredCols };
            }
            return null;
            })
            .filter(Boolean);
    }

    function highlight(text, keyword) {
        console.log('keyword', keyword);
        console.log('text', text);
        if (!keyword) return text;
        const idx = text.toLowerCase().indexOf(keyword.toLowerCase());
        if (idx === -1) return text;
        return [
            text.slice(0, idx),
            `<span class='text-blue-600 bg-blue-100 rounded'>${text.slice(idx, idx + keyword.length)}</span>`,
            text.slice(idx + keyword.length)
        ].join('');
    }

    $: filteredCategories = filterTree(categories, search);

    let autoExpanded = {};

    // 검색 중이면 매칭되는 테이블/컬럼의 토글을 모두 열기
    $: if (search) {
        const newExpanded = {};
        for (const cat of filteredCategories) {
            newExpanded[cat.table] = true;
            if (cat.columns) {
                for (const child of cat.columns) {
                    if (child.columns) newExpanded[child.name] = true;
                }
            }
        }
        autoExpanded = newExpanded;
    }else{
        autoExpanded = {};
    }
</script>

<aside class="min-w-64 max-w-72 bg-white border-r border-gray-200 h-screen overflow-y-auto p-4 flex flex-col">
    <h2 class="text-xl font-semibold text-blue-700 mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
        테이블 및 컬럼
    </h2>
    <input
        type="text"
        class="mb-4 w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        placeholder="검색할 항목을 입력하세요."
        bind:value={search}
    />
    <ul class="list-none p-0 w-full">
        {#each filteredCategories as cat}
            <li class="mb-0 border-b border-gray-100">
                <button
                class="flex items-center w-full px-2 py-2 rounded-lg font-semibold text-gray-900 hover:bg-blue-50 transition-colors"
                on:click={() => toggle(cat.table)}
                type="button"
                >
                    {#if cat.columns}
                        <svg class="w-5 h-5 text-gray-400 transform transition-transform {(search ? autoExpanded[cat.table] : expanded[cat.table]) ? 'rotate-90' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                    {/if}
                    <span class="flex-1 text-left ml-2 text-sm">
                        {@html highlight(cat.table, search)}
                    </span>
                </button>
                {#if cat.columns && (search ? autoExpanded[cat.table] : expanded[cat.table])}
                    <ul class="ml-4 mt-1 border-l border-gray-100 pl-2">
                        {#each cat.columns as child}
                            <CategoryNode
                                cat={child}
                                expanded={search ? autoExpanded : expanded}
                                {toggle}
                                {isLeaf}
                                handleDragStart={(e, item) => handleDragStart(e, item, cat.table)}
                                depth={1}
                                search={search}
                                highlight={highlight}
                                tableName={cat.table}
                            />
                        {/each}
                    </ul>
                {/if}
            </li>
        {/each}
    </ul>
</aside>
