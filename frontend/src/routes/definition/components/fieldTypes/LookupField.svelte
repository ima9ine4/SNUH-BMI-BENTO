<script>
	import { onMount, onDestroy } from "svelte";

  export let fieldName = "";
  export let tableName = "";
  export let onApply = () => {}; // 적용 버튼 콜백
  export let onCancel = () => {}; // 취소 버튼 콜백
  
  // 선택된 항목들
  let selectedItems = [];
  
  // 검색 키워드
  let searchKeyword = "";
  
  // 임시 데이터
  const sampleData = [
      { code: "101", name: "일노병원제", standardId: "2011", standardName: "st일노병원제", vocabulary: "SNOMED" },
      { code: "101", name: "자극요법제", standardId: "202", standardName: "st자극요법제", vocabulary: "SNOMED" },
      { code: "101", name: "비타민 B제(비타민 B1을 제외)", standardId: "203", standardName: "st비타민 B제(비타민 B1을 제외)", vocabulary: "SNOMED" },
      { code: "104", name: "기타당 칼슘흡착제", standardId: "204", standardName: "st기타당 칼슘흡착제", vocabulary: "SNOMED" },
      { code: "105", name: "기타당 생물학적 제제", standardId: "205", standardName: "st기타당 생물학적 제제", vocabulary: "SNOMED" },
      { code: "106", name: "항독소 및 항독소비타민철정", standardId: "206", standardName: "st항독소 및 항독소비타민철정", vocabulary: "SNOMED" },
      { code: "107", name: "각질계, 융털제", standardId: "207", standardName: "st각질계, 융털제", vocabulary: "SNOMED" },
      { code: "108", name: "설파제", standardId: "208", standardName: "st설파제", vocabulary: "SNOMED" },
      { code: "109", name: "기타당 항데르기요하", standardId: "209", standardName: "st기타당 항데르기요하", vocabulary: "SNOMED" },
      { code: "110", name: "진통.진정.수면.수면제", standardId: "210", standardName: "st진통.진정.수면.수면제", vocabulary: "SNOMED" },
      { code: "111", name: "부신호르몬제", standardId: "211", standardName: "st부신호르몬제", vocabulary: "SNOMED" },
      { code: "112", name: "혈액응고저지제", standardId: "212", standardName: "st혈액응고저지제", vocabulary: "SNOMED" },
      { code: "113", name: "호흡촉진제", standardId: "213", standardName: "st호흡촉진제", vocabulary: "SNOMED" },
      { code: "114", name: "일노병원제", standardId: "214", standardName: "st일노병원제", vocabulary: "SNOMED" },
      { code: "115", name: "자극요법제", standardId: "215", standardName: "st자극요법제", vocabulary: "SNOMED" },
      { code: "116", name: "비타민 B제(비타민 B1을 제외)", standardId: "216", standardName: "st비타민 B제(비타민 B1을 제외)", vocabulary: "SNOMED" },
      { code: "117", name: "기타당 칼슘흡착제", standardId: "217", standardName: "st기타당 칼슘흡착제", vocabulary: "SNOMED" },
      { code: "118", name: "기타당 생물학적 제제", standardId: "218", standardName: "st기타당 생물학적 제제", vocabulary: "SNOMED" },
      { code: "119", name: "항독소 및 항독소비타민철정", standardId: "219", standardName: "st항독소 및 항독소비타민철정", vocabulary: "SNOMED" },
      { code: "120", name: "각질계, 융털제", standardId: "220", standardName: "st각질계, 융털제", vocabulary: "SNOMED" },
      { code: "121", name: "설파제", standardId: "221", standardName: "st설파제", vocabulary: "SNOMED" },
      { code: "122", name: "기타당 항데르기요하", standardId: "222", standardName: "st기타당 항데르기요하", vocabulary: "SNOMED" },
      { code: "123", name: "진통.진정.수면.수면제", standardId: "223", standardName: "st진통.진정.수면.수면제", vocabulary: "SNOMED" },
      { code: "124", name: "부신호르몬제", standardId: "224", standardName: "st부신호르몬제", vocabulary: "SNOMED" },
      { code: "125", name: "혈액응고저지제", standardId: "225", standardName: "st혈액응고저지제", vocabulary: "SNOMED" },
      { code: "126", name: "호흡촉진제", standardId: "226", standardName: "st호흡촉진제", vocabulary: "SNOMED" }
  ];

  // 필터링된 데이터
  $: filteredData = sampleData.filter(item => 
    !searchKeyword || 
    item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    item.code.includes(searchKeyword)
  );

  // 항목 선택/해제
  function toggleItem(item) {
    const index = selectedItems.findIndex(selected => selected.code === item.code);
    if (index >= 0) {
      selectedItems = selectedItems.filter(selected => selected.code !== item.code);
    } else {
      selectedItems = [...selectedItems, item];
    }
  }

  // 선택된 항목 제거
  function removeSelected(item) {
    selectedItems = selectedItems.filter(selected => selected.code !== item.code);
  }

  // 항목이 선택되었는지 확인
  function isSelected(item) {
    return selectedItems.some(selected => selected.code === item.code);
  }

  // 적용 버튼 핸들러
  function handleApply() {
    const conditions = {
      fieldName,
      tableName,
      selectedItems: [...selectedItems],
      displayText: selectedItems.length > 0 
        ? `${selectedItems.length}개 선택됨 (${selectedItems.map(item => item.name).join(', ')})`
        : '선택된 항목 없음'
    };
    onApply(conditions);
  }

  // 취소 버튼 핸들러
  function handleCancel() {
    selectedItems = [];
    searchKeyword = "";
    onCancel();
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
  <div class="flex w-full h-full px-4 box-border">
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
        <div class="w-[6.25%] text-center">□</div>
        <div class="w-[12.5%]">Standard ID</div>
        <div class="w-[25%]">Standard Name</div>
        <div class="w-[12.5%]">SNUH ID</div>
        <div class="w-[25%]">SNUH Name</div>
        <div class="w-[18.75%]">vocabulary</div>
      </div>

      <!-- 열별 검색창 -->
      <div class="flex items-center px-2 py-2 bg-white border-b border-gray-200 text-xs text-gray-700 text-center">
        <div class="w-[6.25%]">
          <div class="relative">
            <svg class="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
        
        <div class="w-[12.5%] px-0.5">
          <input
            type="text"
            class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            placeholder="standard id"
            bind:value={searchKeyword}
          />
        </div>
        
        <div class="w-[25%] px-0.5">
          <input
            type="text"
            class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            placeholder="standard name"
            bind:value={searchKeyword}
          />
        </div>
        
        <div class="w-[12.5%] px-0.5">
          <input
            type="text"
            class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            placeholder="snuh id"
            bind:value={searchKeyword}
          />
        </div>
        
        <div class="w-[25%] px-0.5">
          <input
            type="text"
            class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            placeholder="snuh name"
            bind:value={searchKeyword}
          />
        </div>
        
        <div class="w-[18.75%] px-0.5">
          <input
            type="text"
            class="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            placeholder="vocabulary"
            bind:value={searchKeyword}
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
          <div class="w-[6.25%] self-center">
            <input 
              type="checkbox" 
              checked={isSelected(item)}
              on:change={() => toggleItem(item)}
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div class="w-[12.5%] px-0.5 font-medium text-gray-900 line-clamp-3 whitespace-normal break-words self-center" title={item.standardId}>{item.standardId}</div>
          <div class="w-[25%] px-0.5 text-gray-700 text-left self-center" title={item.standardName}>{item.standardName}</div>
          <div class="w-[12.5%] px-0.5 font-medium text-gray-900 line-clamp-3 whitespace-normal break-words self-center" title={item.code}>{item.code}</div>
          <div class="w-[25%] px-0.5 text-gray-700 text-left self-center" title={item.name}>{item.name}</div>
          <div class="w-[18.75%] px-0.5 text-gray-700 line-clamp-3 whitespace-normal break-words self-center" title={item.vocabulary}>{item.vocabulary}</div>
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
      <div class="flex flex-row justify-between bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
        <h5 class="font-medium text-gray-800 text-sm">선택된 항목</h5>
        <p class="text-xs text-gray-600 mt-1">{selectedItems.length}개</p>
      </div>
      <div class="flex-1 overflow-y-auto p-2 space-y-1 min-h-[300px] overflow-x-hidden">
        {#if selectedItems.length === 0}
          <div class="flex items-center justify-center h-full text-gray-400">
            <div class="text-center">
              <p class="text-sm">선택된 항목이 없습니다</p>
            </div>
          </div>
        {:else}
          {#each selectedItems as item}
            <div class="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded text-sm hover:bg-blue-100 transition-colors">
              <div class="flex-1 min-w-0">
                <div class="font-medium text-blue-800 truncate min-w-0 whitespace-nowrap overflow-hidden text-ellipsis" title={item.standardName}>{item.standardName}</div>
                <div class="text-xs text-blue-600 truncate min-w-0 whitespace-nowrap overflow-hidden text-ellipsis" title={item.standardId}>{item.standardId}</div>
              </div>
              <button 
                aria-label="선택 항목 제거"
                class="text-blue-500 hover:text-red-500 transition-colors ml-2 flex-shrink-0"
                on:click={() => removeSelected(item)}
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          {/each}
        {/if}
      </div>
    </div>    
  </div>
</div>