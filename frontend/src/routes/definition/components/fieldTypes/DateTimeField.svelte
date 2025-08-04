<script>
  export let fieldName = "";
  export let tableName = "";
  export let existingData = null;
  export let onSelectionChange = () => {};

  let startDate = "";
  let startTime = "";
  let endDate = "";
  let endTime = "";
  let hasError = false;
  let errorMessage = "";

  // 기존 데이터 복원
  $: if (existingData && existingData.operator) {
    restoreFromExistingData(existingData.operator);
  }

  // 날짜/시간 유효성 검증
  $: {
    if ((startDate || startTime) && (endDate || endTime)) {
      const startDateTime = new Date(`${startDate || '1900-01-01'}T${startTime || '00:00'}`);
      const endDateTime = new Date(`${endDate || '9999-12-31'}T${endTime || '23:59'}`);
      
      if (startDate && endDate && startTime && endTime && startDateTime > endDateTime) {
        hasError = true;
        errorMessage = "시작일시는 종료일시보다 늦을 수 없습니다.";
      } else {
        hasError = false;
        errorMessage = "";
      }
    } else {
      hasError = false;
      errorMessage = "";
    }
  }

  function restoreFromExistingData(operator) {
    if (operator.gte) {
      const dateTime = new Date(operator.gte);
      startDate = dateTime.toISOString().split('T')[0];
      startTime = dateTime.toTimeString().slice(0, 5);
    }
    if (operator.lte) {
      const dateTime = new Date(operator.lte);
      endDate = dateTime.toISOString().split('T')[0];
      endTime = dateTime.toTimeString().slice(0, 5);
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
          displayText: '날짜시간 조건 오류',
          hasError: true
        };
        onSelectionChange(conditions);
      }
      return;
    }

    if (!startDate && !startTime && !endDate && !endTime) {
      if (onSelectionChange) {
        const conditions = {
          fieldName,
          tableName,
          operator: {},
          summary: null,
          displayText: '날짜시간 조건 없음',
          hasError: false
        };
        onSelectionChange(conditions);
      }
      return;
    }

    let operator = {};
    let summaryText = "";

    // ISO datetime 형식으로 변환
    if (startDate || startTime) {
      const date = startDate || '1900-01-01';
      const time = startTime || '00:00';
      const startDateTime = `${date}T${time}:00`;
      operator.gte = startDateTime;
    }

    if (endDate || endTime) {
      const date = endDate || '9999-12-31';
      const time = endTime || '23:59';
      const endDateTime = `${date}T${time}:59`;
      operator.lte = endDateTime;
    }

    // 표시 텍스트 생성
    if (startDate && startTime && endDate && endTime) {
      summaryText = `${startDate} ${startTime} ~ ${endDate} ${endTime}`;
    } else if (startDate || startTime) {
      const date = startDate || '';
      const time = startTime || '';
      summaryText = `${date} ${time} 이후`.trim();
    } else if (endDate || endTime) {
      const date = endDate || '';
      const time = endTime || '';
      summaryText = `${date} ${time} 이전`.trim();
    }

    if (onSelectionChange) {
      const conditions = {
        fieldName,
        tableName,
        operator,
        summary: summaryText,
        displayText: summaryText,
        hasError: false
      };
      onSelectionChange(conditions);
    }
  }

  // 날짜/시간 변경 시 조건 업데이트
  $: if ((startDate || startTime || endDate || endTime) && !hasError) {
    updateConditions();
  } else if (hasError) {
    updateConditions(); // 에러 상태도 업데이트
  }
</script>

<div class="px-6 pb-6 space-y-4">
  <div class="space-y-4">
    <!-- 시작 날짜시간 -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">시작 일시</label>
      <div class="flex flex-row items-center gap-2">
        <div class="flex-1">
          <input
            type="date"
            bind:value={startDate}
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent {hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}"
            max={endDate || undefined}
          />
        </div>
        <div class="flex-1">
          <input
            type="time"
            bind:value={startTime}
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent {hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}"
          />
        </div>
      </div>
    </div>

    <!-- 종료 날짜시간 -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">종료 일시</label>
      <div class="flex flex-row items-center gap-2">
        <div class="flex-1">
          <input
            type="date"
            bind:value={endDate}
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent {hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}"
            min={startDate || undefined}
          />
        </div>
        <div class="flex-1">
          <input
            type="time"
            bind:value={endTime}
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent {hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}"
          />
        </div>
      </div>
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
  {#if (startDate || startTime || endDate || endTime) && !hasError}
    <div class="mt-4 p-3 bg-blue-50 rounded-lg">
      <div class="text-sm text-blue-800">
        <span class="font-medium">설정된 조건:</span>
        <span class="ml-2">
          {#if startDate && startTime && endDate && endTime}
            <strong>{startDate} {startTime}</strong> ~ <strong>{endDate} {endTime}</strong>
          {:else if startDate || startTime}
            <strong>{startDate || ''} {startTime || ''}</strong> 이후
          {:else if endDate || endTime}
            <strong>{endDate || ''} {endTime || ''}</strong> 이전
          {/if}
        </span>
      </div>
    </div>
  {/if}
</div> 