<script>
  export let fieldName = "";
  export let tableName = "";
  export let existingData = null;
  export let onSelectionChange = () => {};
  export let fieldType = ""; // "range_int", "range_float"

  let minValue = "";
  let maxValue = "";
  let minOperator = "gte"; // "gt" (초과), "gte" (이상)
  let maxOperator = "lte"; // "lt" (미만), "lte" (이하)
  let hasError = false;
  let errorMessage = "";

  // 연산자 옵션
  const minOperatorOptions = [
    { value: 'gte', label: '이상', symbol: '≥' },
    { value: 'gt', label: '초과', symbol: '>' }
  ];

  const maxOperatorOptions = [
    { value: 'lte', label: '이하', symbol: '≤' },
    { value: 'lt', label: '미만', symbol: '<' }
  ];

  // 필드 타입에 따른 설정
  $: isIntType = fieldType === "range_int";
  $: isFloatType = fieldType === "range_float";
  $: inputStep = isIntType ? "1" : "0.01";
  $: inputType = "number";

  // 기존 데이터 복원
  $: if (existingData && existingData.operator) {
    restoreFromExistingData(existingData.operator);
  }

  // 범위 유효성 검증
  $: {
    if (minValue !== "" && maxValue !== "") {
      const min = parseFloat(minValue);
      const max = parseFloat(maxValue);
      
      if (isNaN(min) || isNaN(max)) {
        hasError = true;
        errorMessage = "올바른 숫자를 입력해주세요.";
      } else if (isIntType && (!Number.isInteger(min) || !Number.isInteger(max))) {
        hasError = true;
        errorMessage = "정수만 입력 가능합니다.";
      } else {
        // 연산자에 따른 범위 검증
        let isValidRange = true;
        if (minOperator === 'gte' && maxOperator === 'lte') {
          isValidRange = min <= max;
        } else if (minOperator === 'gt' && maxOperator === 'lt') {
          isValidRange = min < max;
        } else if (minOperator === 'gte' && maxOperator === 'lt') {
          isValidRange = min < max;
        } else if (minOperator === 'gt' && maxOperator === 'lte') {
          isValidRange = min < max;
        }
        
        if (!isValidRange) {
          hasError = true;
          errorMessage = "범위 조건이 올바르지 않습니다.";
        } else {
          hasError = false;
          errorMessage = "";
        }
      }
    } else {
      hasError = false;
      errorMessage = "";
    }
  }

  function restoreFromExistingData(operator) {
    if (operator.gte !== undefined) {
      minValue = operator.gte.toString();
      minOperator = "gte";
    } else if (operator.gt !== undefined) {
      minValue = operator.gt.toString();
      minOperator = "gt";
    }
    
    if (operator.lte !== undefined) {
      maxValue = operator.lte.toString();
      maxOperator = "lte";
    } else if (operator.lt !== undefined) {
      maxValue = operator.lt.toString();
      maxOperator = "lt";
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
          displayText: '범위 조건 오류',
          hasError: true
        };
        onSelectionChange(conditions);
      }
      return;
    }

    if (minValue === "" && maxValue === "") {
      if (onSelectionChange) {
        const conditions = {
          fieldName,
          tableName,
          operator: {},
          summary: null,
          displayText: '범위 조건 없음',
          hasError: false
        };
        onSelectionChange(conditions);
      }
      return;
    }

    let operator = {};
    let summaryText = "";

    // 숫자 변환 및 연산자 적용
    if (minValue !== "") {
      const min = isIntType ? parseInt(minValue) : parseFloat(minValue);
      operator[minOperator] = min;
    }

    if (maxValue !== "") {
      const max = isIntType ? parseInt(maxValue) : parseFloat(maxValue);
      operator[maxOperator] = max;
    }

    // 표시 텍스트 생성
    if (minValue !== "" && maxValue !== "") {
      const minLabel = minOperatorOptions.find(opt => opt.value === minOperator)?.label || "이상";
      const maxLabel = maxOperatorOptions.find(opt => opt.value === maxOperator)?.label || "이하";
      summaryText = `${minValue} ${minLabel} ~ ${maxValue} ${maxLabel}`;
    } else if (minValue !== "") {
      const minLabel = minOperatorOptions.find(opt => opt.value === minOperator)?.label || "이상";
      summaryText = `${minValue} ${minLabel}`;
    } else if (maxValue !== "") {
      const maxLabel = maxOperatorOptions.find(opt => opt.value === maxOperator)?.label || "이하";
      summaryText = `${maxValue} ${maxLabel}`;
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

  // 값 변경 시 조건 업데이트
  $: if ((minValue !== "" || maxValue !== "" || minOperator || maxOperator) && !hasError) {
    updateConditions();
  } else if (hasError) {
    updateConditions(); // 에러 상태도 업데이트
  }
</script>

<div class="px-6 pb-6 space-y-4">
  <div class="space-y-4">
    <!-- 타입 표시 -->
    <div class="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
      {#if isIntType}
        정수 범위 입력
      {:else if isFloatType}
        실수 범위 입력
      {:else}
        숫자 범위 입력
      {/if}
    </div>

    <!-- 최솟값 입력 -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">최솟값 조건</label>
      <div class="flex flex-row items-center gap-2">
        <div class="flex-1">
          <input
            type={inputType}
            step={inputStep}
            bind:value={minValue}
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent {hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}"
            placeholder={isIntType ? "정수 입력" : "숫자 입력"}
          />
        </div>
        <div class="w-20">
          <select
            bind:value={minOperator}
            class="w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent {hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} text-sm"
          >
            {#each minOperatorOptions as option}
              <option value={option.value}>{option.symbol} {option.label}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>

    <!-- 최댓값 입력 -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">최댓값 조건</label>
      <div class="flex flex-row items-center gap-2">
        <div class="flex-1">
          <input
            type={inputType}
            step={inputStep}
            bind:value={maxValue}
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent {hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}"
            placeholder={isIntType ? "정수 입력" : "숫자 입력"}
          />
        </div>
        <div class="w-20">
          <select
            bind:value={maxOperator}
            class="w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent {hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} text-sm"
          >
            {#each maxOperatorOptions as option}
              <option value={option.value}>{option.symbol} {option.label}</option>
            {/each}
          </select>
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
  {#if (minValue !== "" || maxValue !== "") && !hasError}
    <div class="mt-4 p-3 bg-blue-50 rounded-lg">
      <div class="text-sm text-blue-800">
        <span class="font-medium">설정된 조건:</span>
        <span class="ml-2">
          {#if minValue !== "" && maxValue !== ""}
            <strong>{minValue}</strong> {minOperatorOptions.find(opt => opt.value === minOperator)?.label} ~ <strong>{maxValue}</strong> {maxOperatorOptions.find(opt => opt.value === maxOperator)?.label}
          {:else if minValue !== ""}
            <strong>{minValue}</strong> {minOperatorOptions.find(opt => opt.value === minOperator)?.label}
          {:else if maxValue !== ""}
            <strong>{maxValue}</strong> {maxOperatorOptions.find(opt => opt.value === maxOperator)?.label}
          {/if}
        </span>
      </div>
    </div>
  {/if}
</div> 