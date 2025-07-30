<script>
  import LookupField from './fieldTypes/LookupField.svelte';
  export let showModal = false;
  export let fieldData = null; // { fieldName, tableName, fieldType }
  export let existingData = null; // 기존 선택된 데이터
  export let onApply = () => {};
  export let onClose = () => {};
  let selectedData = null;

  // 필드 타입별 width/height 결정 (타입 추가 예정)
  $: modalWidth = fieldData?.fieldType === 'lookup' ? '1000px'
                  : fieldData?.fieldType === 'select' ? '400px'
                  : '600px';
  $: modalHeight = fieldData?.fieldType === 'lookup' ? '90vh'
                  : fieldData?.fieldType === 'select' ? 'auto'
                  : 'auto';

  function handleClose() {
    selectedData = null;
    onClose();
  }
  
  function handleApply() {
    if (selectedData) {
      onApply(selectedData);
    }
  }

  function handleSelectionChange(data) {
    selectedData = data;
  }

</script>

{#if showModal && fieldData}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col"
         style="width: {modalWidth}; height: {modalHeight}; max-width: 100vw; max-height: 95vh;">

      <!-- 상단 공통 헤더 -->
      <div class="px-6 pt-6 pb-3 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <div class="flex gap-4">
            <h3 class="text-lg font-semibold text-gray-800">{fieldData.fieldName} 설정</h3>
            <p class="text-sm text-gray-600 mt-1">
              <span class="font-medium text-blue-600">{fieldData.tableName}</span> 테이블  |
              <span class="font-medium text-green-600">{fieldData.fieldName}</span>  필드
            </p>
          </div>
          <button class="text-gray-400 hover:text-gray-600" on:click={handleClose} aria-label="닫기">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- 실제 입력 UI -->
      <div class="flex-1 overflow-hidden px-6 py-6">
        {#if fieldData.fieldType === 'lookup'}
          <LookupField
            fieldName={fieldData.fieldName}
            tableName={fieldData.tableName}
            existingData={existingData}
            onSelectionChange={handleSelectionChange}
          />
        {:else}
          <div class="flex flex-col items-center justify-center h-full">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
              </svg>
            </div>
            <h4 class="text-lg font-medium text-gray-800 mb-2">{fieldData.fieldName}</h4>
            <p class="text-gray-600 mb-4">이 필드 타입({fieldData.fieldType})에 대한 설정이 준비 중입니다.</p>
          </div>
        {/if}
      </div>

      <!-- 하단 공통 버튼 -->
      <div class="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
        <button
          class="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm font-medium"
          on:click={handleClose}
          aria-label="취소"
        >
          취소
        </button>
        <button
          class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
          on:click={handleApply}
          aria-label="적용"
        >
          적용
        </button>
      </div>
    </div>
  </div>
{/if} 