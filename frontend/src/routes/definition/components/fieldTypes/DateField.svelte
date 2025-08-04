<script>
  export let fieldName = "";
  export let tableName = "";
  export let existingData = null;
  export let onSelectionChange = () => {};

  let startDate = "";
  let endDate = "";
  let hasError = false;
  let errorMessage = "";

  // 기존 데이터 복원
  $: if (existingData && existingData.operator) {
    restoreFromExistingData(existingData.operator);
  }

  // 날짜 유효성 검증
  $: {
    if (startDate && endDate && startDate > endDate) {
      hasError = true;
      errorMessage = "시작날짜는 종료날짜보다 늦을 수 없습니다.";
    } else {
      hasError = false;
      errorMessage = "";
    }
  }

  function restoreFromExistingData(operator) {
    if (operator.gte) {
      startDate = operator.gte;
    }
    if (operator.lte) {
      endDate = operator.lte;
    }
  }

  function updateConditions() {
    // 에러가 있으면 조건을 업데이트하지 않음
    if (hasError) {
      if (onSelectionChange) {
        const conditions = {
          fieldName,
          tableName,
          operator: {},
          summary: null,
          displayText: '날짜 조건 오류',
          hasError: true
        };
        onSelectionChange(conditions);
      }
      return;
    }

    if (!startDate && !endDate) {
      if (onSelectionChange) {
        const conditions = {
          fieldName,
          tableName,
          operator: {},
          summary: null,
          displayText: '날짜 조건 없음',
          hasError: false
        };
        onSelectionChange(conditions);
      }
      return;
    }

    let operator = {};
    let summaryText = "";

    if (startDate && endDate) {
      operator.gte = startDate;
      operator.lte = endDate;
      summaryText = `${startDate} ~ ${endDate}`;
    } else if (startDate) {
      operator.gte = startDate;
      summaryText = `${startDate} 이후`;
    } else if (endDate) {
      operator.lte = endDate;
      summaryText = `${endDate} 이전`;
    }

    if (onSelectionChange) {
      const conditions = {
        fieldName,
        tableName,
        operator,
        summary: summaryText,
        hasError: false
      };
      onSelectionChange(conditions);
    }
  }

  // 날짜 변경 시 조건 업데이트
  $: if ((startDate || endDate) && !hasError) {
    updateConditions();
  } else if (hasError) {
    updateConditions(); // 에러 상태도 업데이트
  }
</script>

<div class="px-6 pb-6 space-y-4">
  <div class="flex flex-row items-center gap-4">
    <!-- 시작 날짜 -->
    <div class="flex-1">
      <label class="block text-sm font-medium text-gray-700 mb-2">시작 일자</label>
      <input
        type="date"
        bind:value={startDate}
        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent {hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}"
        max={endDate || undefined}
      />
    </div>

    <!-- 종료 날짜 -->
    <div class="flex-1">
      <label class="block text-sm font-medium text-gray-700 mb-2">종료 일자</label>
      <input
        type="date"
        bind:value={endDate}
        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent {hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}"
        min={startDate || undefined}
      />
    </div>
  </div>

  <!-- 에러 메시지 -->
  {#if hasError}
    <div class="p-3 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex items-center">
        <svg class="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span class="text-sm text-red-700 font-medium">{errorMessage}</span>
      </div>
    </div>
  {/if}

  <!-- 현재 설정된 조건 미리보기 -->
  {#if (startDate || endDate) && !hasError}
    <div class="mt-4 p-3 bg-blue-50 rounded-lg">
      <div class="text-sm text-blue-800">
        <span class="font-medium">설정된 조건:</span>
        <span class="ml-2">
          {#if startDate && endDate}
            <strong>{startDate}</strong> ~ <strong>{endDate}</strong>
          {:else if startDate}
            <strong>{startDate}</strong> 이후
          {:else if endDate}
            <strong>{endDate}</strong> 이전
          {/if}
        </span>
      </div>
    </div>
  {/if}
</div>