<script>
	import { onMount, onDestroy } from "svelte";
	import { PUBLIC_API_URI } from '$env/static/public';

  export let fieldName = "";
  export let tableName = "";
  export let existingData = null; // 기존 선택된 데이터
  export let onSelectionChange = () => {}; // 선택 상태 변경 시 호출되는 콜백
  
  let selectedItems = []; // 선택된 항목들

  // 기존 데이터가 있으면 초기값으로 설정
  $: if (existingData && existingData.selectedItems) {
    selectedItems = [...existingData.selectedItems];
  }

  // API 관련 상태
  let isLoading = false;
  let apiData = [];
  let totalCount = 0;
  let currentPage = 0;
  const pageSize = 100;

  // 검색 관련 상태
  let searchKeyword = ""; // 통합 검색
  let searchConceptId = "";
  let searchConceptName = "";
  let searchSnuhId = "";
  let searchSnuhName = "";
  let searchVocabulary = "";
  
  let openAccordion = {}; // 선택된 항목 아코디언 토글 열림 상태 추적

  // API 호출 함수
  async function fetchConceptData(page = 0) {
    isLoading = true;
    
    try {
      const requestBody = {
        table: tableName,
        column: fieldName,
        query: searchKeyword || "",
        source_code: searchSnuhId || "",
        source_code_description: searchSnuhName || "",
        target_concept_id: searchConceptId || "",
        target_concept_name: searchConceptName || "",
        vocabulary_id: searchVocabulary || "",
        domain: "",
        page: page,
        limit: pageSize
      };

      const response = await fetch(`${PUBLIC_API_URI}/concept/search`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('API 호출 실패');
      }

      const data = await response.json();
      apiData = data.concepts || [];
      totalCount = data.total || 0;
      currentPage = page;

    } catch (error) {
      console.error('API 호출 오류:', error);
      apiData = [];
      totalCount = 0;
    } finally {
      isLoading = false;
    }
  }

  // 검색 실행 함수
  function handleSearch() {
    fetchConceptData(0);
  }

  // 페이지 변경 함수
  function handlePageChange(page) {
    fetchConceptData(page);
  }

  // 전체 페이지 수 계산
  $: totalPages = Math.ceil(totalCount / pageSize);

  // 선택된 항목을 target_concept_id 기준으로 그룹핑
  $: selectedGrouped = selectedItems.reduce((acc, item) => {
    if (!acc[item.target_concept_id]) acc[item.target_concept_id] = { conceptName: item.target_concept_name, snuhs: [] };
    acc[item.target_concept_id].snuhs.push({ snuhId: item.source_code, snuhName: item.source_code_description });
    return acc;
  }, {});

  function toggleAccordion(conceptId) {
    openAccordion = {
      ...openAccordion,
      [conceptId]: !openAccordion[conceptId]
    }
  }

  // 항목 선택/해제
  function toggleItem(item) {
    const sameConceptItems = apiData.filter(data => data.target_concept_id === item.target_concept_id);
    const isCurrentlySelected = selectedItems.some(selected => selected.target_concept_id === item.target_concept_id);
    
    if (isCurrentlySelected) {
      // 같은 target_concept_id를 가진 모든 항목 제거
      selectedItems = selectedItems.filter(selected => selected.target_concept_id !== item.target_concept_id);
    } else {
      // 같은 target_concept_id를 가진 모든 항목 추가
      selectedItems = [...selectedItems, ...sameConceptItems];
    }
  }

  // 선택된 항목 제거
  function removeSelected(item) {
    selectedItems = selectedItems.filter(selected => selected.target_concept_id !== item.target_concept_id);
  }

  // 항목이 선택되었는지 확인
  function isSelected(item) {
    return selectedItems.some(selected => selected.target_concept_id === item.target_concept_id);
  }

  // selectedItems가 변경될 때마다 부모에게 알림
  $: if (onSelectionChange) {
    const conceptCount = Object.keys(selectedGrouped).length;
    const itemCount = selectedItems.length;

    const conditions = {
      fieldName,
      tableName,
      selectedItems: [...selectedItems],
      conceptCount: conceptCount,
      itemCount: itemCount,
      summary: conceptCount > 0 ? `컨셉 ${conceptCount}개 선택됨` : null
    };
    onSelectionChange(conditions);
  }

  onMount(() => {
    document.body.style.overflow = 'hidden'; // 모달 열릴 때 스크롤 방지
    // 초기 데이터 로드
    fetchConceptData(0);
  });

  onDestroy(() => {
    document.body.style.overflow = ''; // 모달 닫힐 때 스크롤 복원
  });
</script>

<!-- 모달 메인 UI -->
<div class="flex flex-col h-full min-h-0 w-full overflow-hidden">
  <div class="flex w-full h-full px-4">
    <!-- 좌측: 전체 데이터 테이블 -->
    <div class="basis-2/3 min-w-0 shrink-0 border border-gray-200 rounded-lg flex flex-col min-h-0 mr-4">
      <!-- 검색 영역 -->
      <div class="bg-gray-50 px-4 pb-0 pt-2 border-b border-gray-200 rounded-t-lg">
        <div class="flex items-center justify-between gap-2 mb-2">
          <span class="text-sm font-medium text-gray-700">{apiData.length} / {totalCount} 건</span>
          <div class="flex items-center gap-2">
            <p>
              <span class="text-xs text-red-600">*</span>
              <span class="text-xs text-gray-600">검색 후 엔터를 눌러주세요</span>
            </p>
            <div class="relative">
              <svg class="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input 
                type="text" 
                bind:value={searchKeyword}
                placeholder="통합 검색"
                class="w-48 h-8 pl-8 pr-4 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-xs"
                on:keydown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 테이블 헤더 -->
      <div class="flex items-center px-2 py-2 bg-gray-100 border-b border-gray-200 text-xs font-medium text-gray-700 text-center">
        <div class="w-[5%] text-center">□</div>
        <div class="w-[15%]">Concept ID</div>
        <div class="w-[25%]">Concept Name</div>
        <div class="w-[15%]">SNUH ID</div>
        <div class="w-[25%]">SNUH Name</div>
        <div class="w-[15%]">Vocabulary</div>
      </div>

      <!-- 열별 검색창 -->
      <div class="flex items-center px-2 py-2 bg-white border-b border-gray-200 text-xs text-gray-700 text-center">
        <div class="w-[5%]">
          <div class="relative">
            <svg class="w-4 h-4 absolute left-1.5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
        
        <div class="w-[15%] px-0.5">
          <input
            type="text"
            class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            placeholder="concept id"
            bind:value={searchConceptId}
            on:keydown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <div class="w-[25%] px-0.5">
          <input
            type="text"
            class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            placeholder="concept name"
            bind:value={searchConceptName}
            on:keydown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <div class="w-[15%] px-0.5">
          <input
            type="text"
            class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            placeholder="snuh id"
            bind:value={searchSnuhId}
            on:keydown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <div class="w-[25%] px-0.5">
          <input
            type="text"
            class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            placeholder="snuh name"
            bind:value={searchSnuhName}
            on:keydown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <div class="w-[15%] px-0.5">
          <input
            type="text"
            class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            placeholder="vocabulary"
            bind:value={searchVocabulary}
            on:keydown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
      </div>
  
      <!-- 테이블 본문 -->
      <div class="flex-1 overflow-y-auto min-h-0">
        {#if isLoading}
          <div class="flex items-center justify-center py-8">
            <div class="text-center">
              <svg class="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="text-sm text-gray-500">데이터를 불러오는 중...</p>
            </div>
          </div>
        {:else if apiData.length === 0}
          <div class="flex items-center justify-center py-8 text-gray-400">
            <div class="text-center">
              <svg class="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <p class="text-sm">검색 결과가 없습니다</p>
            </div>
          </div>
        {:else}
          {#each apiData as item}
            <div class="flex items-start px-2 py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors text-sm cursor-pointer text-center"
                  on:click={() => toggleItem(item)}
                  on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleItem(item)}
                  role="button"
                  tabindex="0"
                  >
              <div class="w-[5%] self-center">
                <input 
                  type="checkbox" 
                  checked={isSelected(item)}
                  on:change={() => toggleItem(item)}
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
                             <div class="w-[15%] px-1.5 font-medium text-gray-900 line-clamp-3 whitespace-normal break-words self-center" title={item.target_concept_id}>{item.target_concept_id}</div>
               <div class="w-[25%] px-1.5 text-gray-700 text-left self-center" title={item.target_concept_name}>{item.target_concept_name}</div>
               <div class="w-[15%] px-1.5 font-medium text-gray-900 line-clamp-3 whitespace-normal break-words self-center" title={item.source_code}>{item.source_code}</div>
               <div class="w-[25%] px-1.5 text-gray-700 text-left self-center" title={item.source_code_description}>{item.source_code_description}</div>
               <div class="w-[15%] px-1.5 text-gray-700 line-clamp-3 whitespace-normal break-words self-center" title={item.vocabulary_id}>{item.vocabulary_id}</div>
            </div>
          {/each}
        {/if}
      </div>

      <!-- 페이지네이션 -->
      {#if totalPages > 1}
        <div class="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div class="text-sm text-gray-700">
            페이지 {currentPage + 1} / {totalPages} (총 {totalCount}건)
          </div>
          <div class="flex items-center gap-1">
            <!-- 첫 페이지 버튼 -->
            <button 
              aria-label="첫 페이지"
              tabindex="0"
              class="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              on:click={() => handlePageChange(0)}
              disabled={currentPage === 0 || isLoading}
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
              </svg>
            </button>
            
            <!-- 이전 페이지 버튼 -->
            <button 
              aria-label="이전 페이지"
              tabindex="0"
              class="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              on:click={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0 || isLoading}
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            
            <!-- 페이지 번호들 -->
            {#each Array.from({length: Math.min(5, totalPages)}, (_, i) => {
              const startPage = Math.max(0, Math.min(currentPage - 2, totalPages - 5));
              return startPage + i;
            }) as pageNum}
              <button 
                class="px-3 py-1 text-sm border rounded {pageNum === currentPage ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-100'}"
                on:click={() => handlePageChange(pageNum)}
                disabled={isLoading}
              >
                {pageNum + 1}
              </button>
            {/each}
            
            <!-- 다음 페이지 버튼 -->
            <button 
              aria-label="다음 페이지"
              tabindex="0"
              class="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              on:click={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1 || isLoading}
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
            
            <!-- 마지막 페이지 버튼 -->
            <button 
              aria-label="마지막 페이지"
              tabindex="0"
              class="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              on:click={() => handlePageChange(totalPages - 1)}
              disabled={currentPage === totalPages - 1 || isLoading}
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      {/if}
    </div>

    <!-- 우측: 선택된 항목들 -->
    <div class="basis-1/3 min-w-0 shrink-0 border border-gray-200 rounded-lg flex flex-col overflow-hidden">
      <div class="flex flex-col bg-gray-50 px-4 pt-3 pb-1 border-b border-gray-200 rounded-t-lg">
        <div class="flex flex-row items-center justify-between">
          <h5 class="font-medium text-gray-800 text-sm">선택된 항목</h5>
          <div class="flex flex-col text-right">
            <p class="text-xs text-gray-600">Concept ID {Object.keys(selectedGrouped).length}개</p>
            <p class="text-xs text-gray-600">SNUH ID {selectedItems.length}개</p>
          </div>
        </div>
        <p>
          <span class="text-xs text-red-600">*</span>
          <span class="text-[11px] text-gray-600">SNUH ID가 아닌 Concept ID를 기준으로 적용됩니다.</span>
        </p>
      </div>
      <div class="flex-1 overflow-y-auto p-2 space-y-1 min-h-[300px] overflow-x-hidden">
        {#if selectedItems.length === 0}
          <div class="flex items-center justify-center h-full text-gray-400">
            <div class="text-center">
              <p class="text-sm">선택된 항목이 없습니다</p>
            </div>
          </div>
        {:else}
          {#each Object.entries(selectedGrouped) as [conceptId, group]}
            <div class="border border-blue-200 bg-blue-50 rounded p-2 text-sm space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center min-w-0 gap-2">
                  <!-- 토글 아이콘 -->
                  <button
                    class="text-blue-500 hover:text-blue-700 text-xs flex-shrink-0"
                    on:click={() => toggleAccordion(conceptId)}
                    aria-label="토글"
                    style="padding:0 4px;"
                  >
                    {#if openAccordion[conceptId]}
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    {:else}
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                    {/if}
                  </button>
                  <div class="text-xs text-blue-600 truncate min-w-[25px] max-w-[50px]" title={conceptId}>{conceptId}</div>
                  <div class="font-medium text-blue-800 truncate max-w-[200px] pr-1" title={group.conceptName}>{group.conceptName}</div>
                </div>
                <button
                  aria-label="선택 항목 제거"
                  class="text-blue-500 hover:text-red-500"
                  on:click={() => removeSelected({ target_concept_id: conceptId })}
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {#if openAccordion[conceptId]}
                <div class="px-4">
                  <ul class="list-disc pl-4">
                    {#each group.snuhs as snuh}
                      <div class="flex items-center">
                        <li class="text-xs text-blue-900 truncate w-[50px]" title={`${snuh.snuhId}`}>• {snuh.snuhId}</li>
                        <li class="text-xs text-blue-900 truncate w-[200px]" title={`${snuh.snuhName}`}>{snuh.snuhName}</li>
                      </div>
                    {/each}
                  </ul>
                </div>
              {/if}
            </div>
          {/each}
        {/if}
      </div>
    </div>    
  </div>
</div>