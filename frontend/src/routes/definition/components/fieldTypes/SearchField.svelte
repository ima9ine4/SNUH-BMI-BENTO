<script>
  export let fieldName = "";
  export let tableName = "";
  export let existingData = null;
  export let onSelectionChange = () => {};

  let searchQuery = "";
  let selectedItems = [];
  let searchResults = []; // 검색 결과를 별도로 관리
  let hasSearched = false; // 검색을 실행했는지 여부
  let hasError = false;
  let errorMessage = "";

  // 샘플 검색 결과 데이터 (실제로는 API에서 가져올 예정)
  const sampleSearchResults = [
    { id: "1", value: "고혈압", category: "질환" },
    { id: "2", value: "당뇨병", category: "질환" },
    { id: "3", value: "심장병", category: "질환" },
    { id: "4", value: "폐렴", category: "질환" },
    { id: "5", value: "감기", category: "질환" },
    { id: "6", value: "독감", category: "질환" },
    { id: "7", value: "천식", category: "질환" },
    { id: "8", value: "위염", category: "질환" },
    { id: "9", value: "관절염", category: "질환" },
    { id: "10", value: "우울증", category: "질환" }
  ];

  // 검색 실행 함수
  function executeSearch() {
    if (searchQuery.trim().length === 0) {
      searchResults = [];
      hasSearched = false;
      return;
    }

    // 실제로는 여기서 API 호출을 할 예정
    searchResults = sampleSearchResults.filter(item => 
      item.value.toLowerCase().includes(searchQuery.toLowerCase())
    );
    hasSearched = true;
  }

  // Enter 키로 검색 실행
  function handleKeydown(event) {
    if (event.key === 'Enter') {
      executeSearch();
    }
  }

  // 기존 데이터 복원
  $: if (existingData && existingData.selectedItems) {
    selectedItems = [...existingData.selectedItems];
  }

  // 항목 선택/해제
  function toggleItem(item) {
    const index = selectedItems.findIndex(selected => selected.id === item.id);
    if (index > -1) {
      selectedItems = selectedItems.filter((_, i) => i !== index);
    } else {
      selectedItems = [...selectedItems, item];
    }
  }

  // 선택된 항목인지 확인
  function isSelected(item) {
    return selectedItems.some(selected => selected.id === item.id);
  }

  // 선택된 항목 제거
  function removeSelected(item) {
    selectedItems = selectedItems.filter(selected => selected.id !== item.id);
  }

  // 모든 선택 해제
  function clearAll() {
    selectedItems = [];
  }

  function updateConditions() {
    if (selectedItems.length === 0) {
      if (onSelectionChange) {
        const conditions = {
          fieldName,
          tableName,
          operator: {},
          summary: null,
          displayText: '검색 조건 없음',
          selectedItems: [],
          hasError: false
        };
        onSelectionChange(conditions);
      }
      return;
    }

    const summaryText = `${selectedItems.length}개 항목 선택됨`;
    const itemList = selectedItems.map(item => item.value).join(', ');

    if (onSelectionChange) {
      const conditions = {
        fieldName,
        tableName,
        operator: {
          in: selectedItems.map(item => item.value)
        },
        summary: summaryText,
        displayText: `검색 항목: ${itemList}`,
        selectedItems: [...selectedItems],
        hasError: false
      };
      onSelectionChange(conditions);
    }
  }

  // 선택된 항목 변경 시 조건 업데이트
  $: if (selectedItems) {
    updateConditions();
  }
</script>

<div class="px-6 pb-6 space-y-4">
  <div class="space-y-4">
    <!-- 검색 입력 -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">검색어 입력</label>
      <div class="flex gap-2">
        <div class="relative flex-1">
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="검색할 키워드를 입력하세요..."
            class="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            on:keydown={handleKeydown}
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
        <button
          on:click={executeSearch}
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          검색
        </button>
      </div>
    </div>

    <!-- 검색 결과 -->
    {#if hasSearched}
      <div class="border border-gray-200 rounded-md max-h-60 overflow-y-auto">
        <div class="p-3 bg-gray-50 border-b border-gray-200">
          <span class="text-sm font-medium text-gray-700">검색 결과 ({searchResults.length}개)</span>
        </div>
        {#if searchResults.length > 0}
          <div class="divide-y divide-gray-100">
            {#each searchResults as item}
              <div 
                class="p-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between transition-colors"
                on:click={() => toggleItem(item)}
                role="button"
                tabindex="0"
              >
                <div class="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={isSelected(item)}
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    readonly
                  />
                  <div>
                    <div class="text-sm font-medium text-gray-900">{item.value}</div>
                    <div class="text-xs text-gray-500">{item.category}</div>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <div class="p-4 text-center text-gray-500 text-sm">
            '{searchQuery}'에 대한 검색 결과가 없습니다.
          </div>
        {/if}
      </div>
    {/if}

    <!-- 선택된 항목 표시 -->
    {#if selectedItems.length > 0}
      <div class="border border-gray-200 rounded-md">
        <div class="p-3 bg-blue-50 border-b border-gray-200 flex items-center justify-between">
          <span class="text-sm font-medium text-blue-800">선택된 항목 ({selectedItems.length}개)</span>
          <button
            on:click={clearAll}
            class="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            모두 삭제
          </button>
        </div>
        <div class="p-3 max-h-40 overflow-y-auto">
          <div class="flex flex-wrap gap-2">
            {#each selectedItems as item}
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {item.value}
                <button
                  on:click={() => removeSelected(item)}
                  class="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none"
                >
                  <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </span>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
