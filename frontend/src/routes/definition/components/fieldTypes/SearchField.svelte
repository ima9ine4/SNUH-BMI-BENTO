<script>
  import { onMount, onDestroy } from "svelte";
  import { PUBLIC_API_URI } from '$env/static/public';

  export let fieldName = "";
  export let tableName = "";
  export let existingData = null;
  export let onSelectionChange = () => {};

  let keyword = "";
  let selectedOperator = "contains"; // 기본값: 포함
  let selectedKeyword = null; // 등록된 문자열
  let isLoading = false;
  let keywordCount = null; // 문자열 데이터 건수

  // 추가 연산자 옵션
  const operatorOptions = [
    { value: "contains", label: "포함된 문자열 추가" },
    { value: "not_contains", label: "포함되지 않은 문자열 추가" },
    { value: "starts_with", label: "시작하는 문자열 추가" },
  ];

  // 문자열 추가 함수
  async function addKeyword() {
    if (!keyword.trim()) return;

    const newKeyword = {
      keyword: keyword.trim(),
      operator: selectedOperator,
      operatorLabel: operatorOptions.find(opt => opt.value === selectedOperator)?.label || ""
    };

    // 기존 문자열이 있으면 교체 (하나만 등록 가능)
    selectedKeyword = newKeyword;
    keywordCount = null; // 기존 건수 정보 초기화
    
    // 데이터 건수 확인
    await checkKeywordCount(newKeyword);
    
    // 입력 필드 초기화
    keyword = "";
  }

  // 문자열별 데이터 건수 확인 API
  async function checkKeywordCount(keywordItem) {
    isLoading = true;
    
    try {
      const requestBody = {
        table_name: tableName,
        column_table: fieldName,
        query: {
          [keywordItem.operator]: keywordItem.keyword
        }
      };
      
      const response = await fetch(`${PUBLIC_API_URI}/text-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.status}`);
      }
      
      const data = await response.json();
      
      keywordCount = {
        count: data.queryCount[0].total || 0,
        total: data.totalCount[0].total || 0
      };
       
     } catch (error) {
      console.error('API 호출 오류:', error);
      keywordCount = {
        error: true,
        message: '건수 확인에 실패했습니다.'
      };
     } finally {
      isLoading = false;
     }
   }

  // 문자열 제거
  function removeKeyword() {
    selectedKeyword = null;
    keywordCount = null;
  }

  // 조건 업데이트 함수
  function updateConditions() {
    if (!selectedKeyword) {
      if (onSelectionChange) {
        const conditions = {
          fieldName,
          tableName,
          operator: {},
          summary: '문자열 없음',
          displayText: '문자열 없음'
        };
        onSelectionChange(conditions);
      }
      return;
    }

    let operatorPrefix = '';
    switch (selectedKeyword.operator) {
      case 'contains':
        operatorPrefix = '포함: ';
        break;
      case 'not_contains':
        operatorPrefix = '제외: ';
        break;
      case 'starts_with':
        operatorPrefix = '시작: ';
        break;
      default:
        operatorPrefix = '포함: ';
    }
    
    const summaryText = `${operatorPrefix}${selectedKeyword.keyword}`;

    if (onSelectionChange) {
      const conditions = {
        fieldName,
        tableName,
        operator: {
          keywords: [{
            keyword: selectedKeyword.keyword,
            operator: selectedKeyword.operator
          }]
        },
        summary: summaryText,
        displayText: `${operatorPrefix}${selectedKeyword.keyword}`
      };
      onSelectionChange(conditions);
    }
  }

  // 선택된 문자열 변경 시 조건 업데이트
  $: if (selectedKeyword !== undefined) {
    updateConditions();
  }
  
  // 초기 상태에서도 조건 업데이트 (기존 데이터가 없을 때)
  $: if (existingData && selectedKeyword === null) {
    updateConditions();
  }

  onMount(() => {
    document.body.style.overflow = 'hidden';
    
    // 컴포넌트 마운트 시 기존 데이터가 있으면 복원
    if ( existingData && existingData.operator && existingData.operator.keywords && existingData.operator.keywords.length > 0) {
      const existingItem = existingData.operator.keywords[0];
      selectedKeyword = {
        keyword: existingItem.keyword || '',
        operator: existingItem.operator || 'contains',
        operatorLabel: operatorOptions.find(opt => opt.value === (existingItem.operator || 'contains'))?.label || ''
      };
      selectedOperator = existingItem.operator || 'contains';
      
      if (selectedKeyword.keyword) {
        checkKeywordCount(selectedKeyword);
      }
    }
  });

  onDestroy(() => {
    document.body.style.overflow = '';
  });
</script>

<div class="px-6 pb-6 space-y-4">
  <div class="space-y-4">
    <!-- 문자열 등록 섹션 -->
    <div>
      <div class="flex items-center gap-2 mb-3">
        <label class="block text-m font-medium text-gray-800">문자열 추가</label>
        <div class="group relative">
          <span class="text-sm text-gray-400 cursor-pointer">ⓘ</span>
          <div class="absolute top-1/2 -translate-y-1/2 left-full ml-2 w-80 bg-gray-800 text-white text-xs font-extralight rounded-lg px-2.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[9999] shadow-lg border border-gray-600">
            <div class="relative">
              현재 설정창에서 문자열은 1개만 추가할 수 있습니다. <br>더 많은 문자열을 추가하려면 현재 설정창을 닫고, <br>필드를 컨테이너에 드래그한 후 새로운 설정창을 열어 추가해주세요.
            </div>
          </div>
        </div>
      </div>
      <div class="space-y-2">
        <!-- 추가 연산자 선택 -->
        <select
          bind:value={selectedOperator}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          {#each operatorOptions as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>

        <!-- 문자열 입력 -->
        <div class="flex gap-2">
          <div class="relative flex-1">
            <input
              type="text"
              bind:value={keyword}
              placeholder="추가할 문자열을 입력하세요"
              class="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              on:keydown={(e) => e.key === 'Enter' && addKeyword()}
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>
          <button
            on:click={addKeyword}
            disabled={!keyword.trim() || isLoading}
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {#if selectedKeyword}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              교체
            {:else}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              추가
            {/if}
          </button>
        </div>
      </div>
    </div>

    <!-- 등록된 문자열 -->
    {#if selectedKeyword}
      <div class="flex items-center justify-between p-3 bg-blue-50 rounded-md border border-blue-200">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-sm font-medium text-gray-900">{selectedKeyword.keyword}</span>
            <span class="text-xs text-gray-600 border border-gray-400 px-1.5 py-0.5 rounded-xl">
              {selectedKeyword.operatorLabel}
            </span>
          </div>
          
          <!-- 데이터 건수 표시 -->
          {#if keywordCount}
            {#if keywordCount.error}
              <div class="text-xs text-red-600">건수 확인 실패</div>
            {:else}
              <div class="text-xs text-gray-600">
                해당 조건 만족 데이터: <span class="font-medium text-blue-600">{keywordCount.count.toLocaleString()}</span>건 
                (전체 <span class="font-medium">{keywordCount.total.toLocaleString()}</span>건 중)
              </div>
            {/if}
          {:else}
            <div class="text-xs text-gray-400">건수 확인 중...</div>
          {/if}
        </div>
        
        <button
          aria-label="문자열 삭제"
          on:click={removeKeyword}
          class="ml-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
          title="문자열 삭제"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
       
    {:else}
      <!-- 문자열이 없을 때 안내 메시지 -->
      <div class="border border-gray-200 rounded-md p-6 text-center">
        <div class="text-gray-400 mb-2">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <p class="text-sm text-gray-500">등록된 문자열이 없습니다.</p>
        <p class="text-xs text-gray-400 mt-1">입력창에 문자열을 입력하고 추가해주세요.</p>
      </div>
    {/if}
  </div>
</div>