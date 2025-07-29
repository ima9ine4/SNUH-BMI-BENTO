<script>
	import { onMount, onDestroy } from "svelte";

  export let fieldName = "";
  export let tableName = "";
  export let onSelectionChange = () => {}; // 선택 상태 변경 시 호출되는 콜백
  
  let selectedItems = []; // 선택된 항목들

  let searchKeyword = ""; // 통합 검색
  let searchConceptId = "";
  let searchConceptName = "";
  let searchSnuhId = "";
  let searchSnuhName = "";
  let searchVocabulary = "";
  
  let openAccordion = {}; // 선택된 항목 아코디언 토글 열림 상태 추적
  
  // 임시 데이터
  const sampleData = [
      { snuhId: "101", snuhName: "일노병원제", conceptId: "201", conceptName: "st일노병원제", vocabulary: "SNOMED" },
      { snuhId: "102", snuhName: "자극요법제", conceptId: "201", conceptName: "st일노병원제", vocabulary: "SNOMED" },
      { snuhId: "103", snuhName: "비타민 B제(비타민 B1을 제외)", conceptId: "201", conceptName: "st일노병원제", vocabulary: "SNOMED" },
      { snuhId: "104", snuhName: "기타당 칼슘흡착제", conceptId: "204", conceptName: "st기타당 칼슘흡착제", vocabulary: "SNOMED" },
      { snuhId: "105", snuhName: "기타당 생물학적 제제", conceptId: "205", conceptName: "st기타당 생물학적 제제", vocabulary: "SNOMED" },
      { snuhId: "106", snuhName: "항독소 및 항독소비타민철정", conceptId: "206", conceptName: "st항독소 및 항독소비타민철정정정정정정", vocabulary: "SNOMED" },
      { snuhId: "107", snuhName: "각질계, 융털제", conceptId: "207", conceptName: "st각질계, 융털제", vocabulary: "SNOMED" },
      { snuhId: "108", snuhName: "설파제", conceptId: "208", conceptName: "st설파제", vocabulary: "SNOMED" },
      { snuhId: "109", snuhName: "기타당 항데르기요하", conceptId: "209", conceptName: "st기타당 항데르기요하", vocabulary: "SNOMED" },
      { snuhId: "110", snuhName: "진통.진정.수면.수면제", conceptId: "210", conceptName: "st진통.진정.수면.수면제", vocabulary: "SNOMED" },
      { snuhId: "111", snuhName: "부신호르몬제", conceptId: "211", conceptName: "st부신호르몬제", vocabulary: "SNOMED" },
      { snuhId: "112", snuhName: "혈액응고저지제", conceptId: "212", conceptName: "st혈액응고저지제", vocabulary: "SNOMED" },
      { snuhId: "113", snuhName: "호흡촉진제", conceptId: "213", conceptName: "st호흡촉진제", vocabulary: "SNOMED" },
      { snuhId: "114", snuhName: "일노병원제", conceptId: "214", conceptName: "st일노병원제", vocabulary: "SNOMED" },
      { snuhId: "115", snuhName: "자극요법제", conceptId: "215", conceptName: "st자극요법제", vocabulary: "SNOMED" },
      { snuhId: "116", snuhName: "비타민 B제(비타민 B1을 제외)", conceptId: "216", conceptName: "st비타민 B제(비타민 B1을 제외)", vocabulary: "SNOMED" },
      { snuhId: "117", snuhName: "기타당 칼슘흡착제", conceptId: "217", conceptName: "st기타당 칼슘흡착제", vocabulary: "SNOMED" },
      { snuhId: "118", snuhName: "기타당 생물학적 제제", conceptId: "218", conceptName: "st기타당 생물학적 제제", vocabulary: "SNOMED" },
      { snuhId: "119", snuhName: "항독소 및 항독소비타민철정", conceptId: "219", conceptName: "st항독소 및 항독소비타민철정", vocabulary: "SNOMED" },
      { snuhId: "120", snuhName: "각질계, 융털제", conceptId: "220", conceptName: "st각질계, 융털제", vocabulary: "SNOMED" },
      { snuhId: "121", snuhName: "설파제", conceptId: "221", conceptName: "st설파제", vocabulary: "SNOMED" },
      { snuhId: "122", snuhName: "기타당 항데르기요하", conceptId: "222", conceptName: "st기타당 항데르기요하", vocabulary: "SNOMED" },
      { snuhId: "123", snuhName: "진통.진정.수면.수면제", conceptId: "223", conceptName: "st진통.진정.수면.수면제", vocabulary: "SNOMED" },
      { snuhId: "124", snuhName: "부신호르몬제", conceptId: "224", conceptName: "st부신호르몬제", vocabulary: "SNOMED" },
      { snuhId: "125", snuhName: "혈액응고저지제", conceptId: "225", conceptName: "st혈액응고저지제", vocabulary: "SNOMED" },
      { snuhId: "126", snuhName: "호흡촉진제", conceptId: "226", conceptName: "st호흡촉진제", vocabulary: "SNOMED" }
  ];

  // 필터링된 데이터
  $: filteredData = sampleData.filter(item => 
    !searchKeyword || 
    item.conceptId.includes(searchConceptId) ||
    item.conceptName.includes(searchConceptName) ||
    item.snuhId.includes(searchSnuhId) ||
    item.snuhName.includes(searchSnuhName) ||
    item.vocabulary.includes(searchVocabulary)
  );

  // 선택된 항목을 conceptId 기준으로 그룹핑
  $: selectedGrouped = selectedItems.reduce((acc, item) => {
    if (!acc[item.conceptId]) acc[item.conceptId] = { conceptName: item.conceptName, snuhs: [] };
    acc[item.conceptId].snuhs.push({ snuhId: item.snuhId, snuhName: item.snuhName });
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
    const sameConceptItems = sampleData.filter(data => data.conceptId === item.conceptId);
    const isCurrentlySelected = selectedItems.some(selected => selected.conceptId === item.conceptId);
    
    if (isCurrentlySelected) {
      // 같은 conceptId를 가진 모든 항목 제거
      selectedItems = selectedItems.filter(selected => selected.conceptId !== item.conceptId);
    } else {
      // 같은 conceptId를 가진 모든 항목 추가
      selectedItems = [...selectedItems, ...sameConceptItems];
    }
  }

  // 선택된 항목 제거
  function removeSelected(item) {
    selectedItems = selectedItems.filter(selected => selected.conceptId !== item.conceptId);
  }

  // 항목이 선택되었는지 확인
  function isSelected(item) {
    return selectedItems.some(selected => selected.conceptId === item.conceptId);
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
        <div class="flex items-center gap-2 mb-2">
          <span class="text-sm font-medium text-gray-700">{filteredData.length} / {sampleData.length} 건</span>
          <div class="flex-1"></div>
          <div class="relative">
            <svg class="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input 
              type="text" 
              bind:value={searchKeyword}
              placeholder="통합 검색"
              class="w-full h-6 pl-8 pr-4 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-xs"
            />
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
          />
        </div>
        
        <div class="w-[25%] px-0.5">
          <input
            type="text"
            class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            placeholder="concept name"
            bind:value={searchConceptName}
          />
        </div>
        
        <div class="w-[15%] px-0.5">
          <input
            type="text"
            class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            placeholder="snuh id"
            bind:value={searchSnuhId}
          />
        </div>
        
        <div class="w-[25%] px-0.5">
          <input
            type="text"
            class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            placeholder="snuh name"
            bind:value={searchSnuhName}
          />
        </div>
        
        <div class="w-[15%] px-0.5">
          <input
            type="text"
            class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            placeholder="vocabulary"
            bind:value={searchVocabulary}
          />
        </div>
      </div>
  
      <!-- 테이블 본문 -->
      <div class="flex-1 overflow-y-auto min-h-0">
      {#each filteredData as item}
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
          <div class="w-[15%] px-1.5 font-medium text-gray-900 line-clamp-3 whitespace-normal break-words self-center" title={item.conceptId}>{item.conceptId}</div>
          <div class="w-[25%] px-1.5 text-gray-700 text-left self-center" title={item.conceptName}>{item.conceptName}</div>
          <div class="w-[15%] px-1.5 font-medium text-gray-900 line-clamp-3 whitespace-normal break-words self-center" title={item.snuhId}>{item.snuhId}</div>
          <div class="w-[25%] px-1.5 text-gray-700 text-left self-center" title={item.snuhName}>{item.snuhName}</div>
          <div class="w-[15%] px-1.5 text-gray-700 line-clamp-3 whitespace-normal break-words self-center" title={item.vocabulary}>{item.vocabulary}</div>
        </div>
      {/each}
        
        {#if filteredData.length === 0}
          <div class="flex items-center justify-center py-8 text-gray-400">
            <div class="text-center">
              <svg class="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <p class="text-sm">검색 결과가 없습니다</p>
            </div>
          </div>
        {/if}
        </div>
    </div>

    <!-- 우측: 선택된 항목들 -->
    <div class="basis-1/3 min-w-0 shrink-0 border border-gray-200 rounded-lg flex flex-col overflow-hidden">
      <div class="flex flex-row items-center justify-between bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
        <h5 class="font-medium text-gray-800 text-sm">선택된 항목</h5>
        <div class="flex flex-col text-right">
          <p class="text-xs text-gray-600">Concept ID {Object.keys(selectedGrouped).length}개</p>
          <p class="text-xs text-gray-600">SNUH ID {selectedItems.length}개</p>
        </div>
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
                  on:click={() => removeSelected({ conceptId })}
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