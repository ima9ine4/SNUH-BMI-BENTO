<script>
    import CategoryTree from './components/CategoryTree.svelte';
    import { tick } from 'svelte';

    let cohortName = '';
    let showModal = false;
    let selectedField = null;
    let selectedContainer = null;
    let selectedRow = null;
    let selectedGender = '';
    let startDate = '';
    let endDate = '';

    let rows = [
        {
            id: 1,
            type: 'initial', // initial, AND, NOT
            containers: [
                {
                    id: 1,
                    isEmpty: true,
                    items: [], // { tableName, fieldName, conditions }
                    logic: 'AND'
                }
            ],
            patientCount: 0,
            rowOperator: 'AND' // 이 행 앞에 붙을 연산자
        }
    ];
    let nextRowId = 2;
    let nextContainerId = 2;
    let scrollRefs = {};

    // 행 색상 배열
    const rowColors = [
        { bg: 'bg-blue-50', border: 'border-blue-200', rightBg: 'bg-blue-100', rightBorder: 'border-blue-300', textColor: 'text-blue-600' },
        { bg: 'bg-green-50', border: 'border-green-200', rightBg: 'bg-green-100', rightBorder: 'border-green-300', textColor: 'text-green-600' },
        { bg: 'bg-yellow-50', border: 'border-yellow-200', rightBg: 'bg-yellow-100', rightBorder: 'border-yellow-300', textColor: 'text-yellow-600' },
        { bg: 'bg-purple-50', border: 'border-purple-200', rightBg: 'bg-purple-100', rightBorder: 'border-purple-300', textColor: 'text-purple-600' },
        { bg: 'bg-pink-50', border: 'border-pink-200', rightBg: 'bg-pink-100', rightBorder: 'border-pink-300', textColor: 'text-pink-600' }
    ];

    function toggleRowType(rowId) {
        rows = rows.map(row => {
            if (row.id === rowId) {
                const newType = row.type === 'NOT' ? 'AND' : 'NOT';
                return {
                    ...row,
                    type: newType,
                    rowOperator: newType // 행 타입과 연산자를 동일하게
                };
            }
            return row;
        });
    }

    function addRow() {
        const newRow = {
            id: nextRowId++,
            type: 'AND', // initial, AND, NOT
            containers: [
                {
                    id: nextContainerId++,
                    isEmpty: true,
                    items: [],
                    logic: 'AND'
                }
            ],
            patientCount: 0,
            rowOperator: 'AND'
        };
        rows = [...rows, newRow];
    }

    function ensureEmptyContainer(rowId) {
        rows = rows.map(row => {
            if (row.id === rowId) {
                // 빈 컨테이너가 있는지 확인
                const hasEmptyContainer = row.containers.some(container => container.isEmpty);
                
                if (!hasEmptyContainer) {
                    // 빈 컨테이너가 없으면 추가
                    return {
                        ...row,
                        containers: [...row.containers, {
                            id: nextContainerId++,
                            isEmpty: true,
                            items: [],
                            logic: 'AND'
                        }]
                    };
                }
            }
            return row;
        });
    }

    function removeContainer(rowId, containerId) {
        rows = rows.map(row => {
            if (row.id === rowId) {
                const newContainers = row.containers.filter(c => c.id !== containerId);
                // 최소 하나의 컨테이너는 유지
                if (newContainers.length === 0) {
                    newContainers.push({
                        id: nextContainerId++,
                        isEmpty: true,
                        items: [],
                        logic: 'AND'
                    });
                }
                return { ...row, containers: newContainers };
            }
            return row;
        });
        // 빈 컨테이너가 없으면 추가
        ensureEmptyContainer(rowId);
    }

    function removeRow(rowId) {
        if (rows.length > 1) {
            rows = rows.filter(row => row.id !== rowId);
        }
    }

    function handleDrop(event, rowId, containerId) {
        event.preventDefault();
        const dragDataString = event.dataTransfer.getData('text/plain');
        if (!dragDataString) return;
        
        let tableName, fieldName;
    
        try {
            // JSON 형태로 파싱 시도
            const dragData = JSON.parse(dragDataString);
            tableName = dragData.tableName;
            fieldName = dragData.fieldName;
        } catch (e) {
            // JSON 파싱 실패 시 기존 방식으로 처리
            tableName = "알 수 없음";
            fieldName = dragDataString;
        }
    
        // 드롭된 컨테이너가 빈 컨테이너인지 확인
        const targetRow = rows.find(r => r.id === rowId);
        const targetContainer = targetRow?.containers.find(c => c.id === containerId);
        const wasEmpty = targetContainer?.isEmpty;
    
        rows = rows.map(row => {
            if (row.id === rowId) {
                return {
                    ...row,
                    containers: row.containers.map(container => {
                        if (container.id === containerId) {
                            const newItem = {
                                tableName,
                                fieldName,
                                conditions: null,
                                displayText: fieldName
                            };
                            const newItems = container.isEmpty ? [newItem] : [...container.items, newItem];
                            return {
                                ...container,
                                isEmpty: false,
                                items: newItems
                            };
                        }
                        return container;
                    })
                };
            }
            return row;
        });
    
        // 빈 컨테이너에 드롭했다면 새로운 빈 컨테이너 추가
        if (wasEmpty) {
            ensureEmptyContainer(rowId);
        }
    }

    function removeItemFromContainer(rowId, containerId, itemIndex) {
        rows = rows.map(row => {
            if (row.id === rowId) {
                return {
                    ...row,
                    containers: row.containers.map(container => {
                        if (container.id === containerId) {
                            const newItems = container.items.filter((_, index) => index !== itemIndex);
                            return {
                                ...container,
                                isEmpty: newItems.length === 0,
                                items: newItems
                            };
                        }
                        return container;
                    })
                };
            }
            return row;
        });
        // 아이템 제거 후 빈 컨테이너 보장
        ensureEmptyContainer(rowId);
    }

    function allowDrop(event) {
        event.preventDefault();
    }

    function toggleLogic(rowId, containerId) {
        rows = rows.map(row => {
            if (row.id === rowId) {
                return {
                    ...row,
                    containers: row.containers.map(container => {
                        if (container.id === containerId) {
                            let newLogic;
                            if (container.logic === 'AND') {
                                newLogic = 'OR';
                            } else if (container.logic === 'OR') {
                                newLogic = 'NOT';
                            } else {
                                newLogic = 'AND';
                            }
                            return {
                                ...container,
                                logic: newLogic
                            };
                        }
                        return container;
                    })
                };
            }
            return row;
        });
    }

    function getLogicSymbol(logic) {
        // SVG 벤다이어그램으로 변경
        switch (logic) {
            case 'AND':
                return `<svg class="w-5 h-4" viewBox="0 0 24 16" fill="none">
                    <circle cx="7" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1"/>
                    <circle cx="17" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1"/>
                    <path d="M 11 4 A 6 6 0 0 1 11 12 A 6 6 0 0 1 11 4" fill="currentColor"/>
                </svg>`;
            case 'OR':
                return `<svg class="w-5 h-4" viewBox="0 0 24 16" fill="none">
                    <circle cx="7" cy="8" r="6" fill="currentColor" stroke="currentColor" stroke-width="1"/>
                    <circle cx="17" cy="8" r="6" fill="currentColor" stroke="currentColor" stroke-width="1"/>
                </svg>`;
            case 'NOT':
                return `<svg class="w-5 h-4" viewBox="0 0 24 16" fill="none">
                    <defs>
                        <mask id="notMask">
                            <rect width="24" height="16" fill="white"/>
                            <circle cx="17" cy="8" r="6" fill="black"/>
                        </mask>
                    </defs>
                    <circle cx="7" cy="8" r="6" fill="currentColor" stroke="currentColor" stroke-width="1" mask="url(#notMask)"/>
                    <circle cx="17" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1"/>
                </svg>`;
            default:
                return `<svg class="w-5 h-4" viewBox="0 0 24 16" fill="none">
                    <circle cx="7" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1"/>
                    <circle cx="17" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1"/>
                    <path d="M 11 4 A 6 6 0 0 1 11 12 A 6 6 0 0 1 11 4" fill="currentColor"/>
                </svg>`;
        }
    }

    function getRowColor(index) {
        return rowColors[index % rowColors.length];
    }

    function getGlobalContainerIndex(targetRowIndex, targetContainerIndex) {
        let globalIndex = 0;
        
        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            const row = rows[rowIndex];
            for (let containerIndex = 0; containerIndex < row.containers.length; containerIndex++) {
                const container = row.containers[containerIndex];
                if (!container.isEmpty) {
                    if (rowIndex === targetRowIndex && containerIndex === targetContainerIndex) {
                        return globalIndex;
                    }
                    globalIndex++;
                }
            }
        }
        return globalIndex;
    }

    function getContainerNumber(globalIndex) {
        return (globalIndex + 1).toString();
    }

    function generateFormula() {
        let formula = '';
        let rowFormulas = [];
        
        rows.forEach((row, rowIndex) => {
            // 비어있지 않은 컨테이너들만 필터링
            const nonEmptyContainers = row.containers.filter(container => !container.isEmpty);
            
            if (nonEmptyContainers.length === 0) {
                return; // 빈 행은 건너뛰기
            }
            
            let rowFormula = '';
            
            // 컨테이너 번호들 생성 (전역 인덱스 사용)
            const containerNumbers = nonEmptyContainers.map((container) => {
                const originalIndex = row.containers.indexOf(container);
                return getContainerNumber(getGlobalContainerIndex(rowIndex, originalIndex));
            });
            
            // 컨테이너가 하나뿐인 경우
            if (containerNumbers.length === 1) {
                rowFormula += containerNumbers[0];
            } else {
                // 컨테이너들을 순서대로 두 개씩 괄호로 묶기
                let result = containerNumbers[0];
                
                for (let i = 1; i < containerNumbers.length; i++) {
                    const prevContainerIndex = row.containers.indexOf(nonEmptyContainers[i-1]);
                    const logic = row.containers[prevContainerIndex].logic;
                    
                    // 두 개씩 괄호로 묶기
                    result = `(${result} ${logic} ${containerNumbers[i]})`;
                }
                rowFormula += result;
            }
            rowFormulas.push({
                formula: rowFormula,
                operator: row.rowOperator,
                isFirst: rowIndex === 0
            });
        });
    
        // 행들을 순서대로 두 개씩 괄호로 묶기
        if (rowFormulas.length === 0) {
            return '조건을 설정해주세요';
        } else if (rowFormulas.length === 1) {
            return rowFormulas[0].formula;
        } else {
            let result = rowFormulas[0].formula;
            for (let i = 1; i < rowFormulas.length; i++) {
                const operator = rowFormulas[i].operator;
                if (operator === 'NOT') {
                    result = `(${result} NOT ${rowFormulas[i].formula})`;
                } else {
                    result = `(${result} AND ${rowFormulas[i].formula})`;
                }
            }
            return result;
        }
    }

    function openFieldModal(rowId, containerId, itemIndex) {
        selectedRow = rowId;
        selectedContainer = containerId;
        selectedField = itemIndex;
        showModal = true;
    }

    function applyFieldConditions() {
        if (selectedRow && selectedContainer !== null && selectedField !== null) {
            const currentItem = rows.find(r => r.id === selectedRow)?.containers.find(c => c.id === selectedContainer)?.items[selectedField];
            
            let conditions = '';
            
            if (currentItem?.fieldName === '성별' && selectedGender) {
                conditions = selectedGender;
            } else if (currentItem?.fieldName === '진단일자' && (startDate || endDate)) {
                if (startDate && endDate) {
                    conditions = `${startDate} - ${endDate}`;
                } else if (startDate) {
                    conditions = `${startDate} 이후`;
                } else if (endDate) {
                    conditions = `${endDate} 이전`;
                }
            }
            
            rows = rows.map(row => {
                if (row.id === selectedRow) {
                    return {
                        ...row,
                        containers: row.containers.map(container => {
                            if (container.id === selectedContainer) {
                                return {
                                    ...container,
                                    items: container.items.map((item, index) => {
                                        if (index === selectedField) {
                                            return {
                                                ...item,
                                                conditions
                                            };
                                        }
                                        return item;
                                    })
                                };
                            }
                            return container;
                        })
                    };
                }
                return row;
            });
        }
        closeModal();
    }

    function closeModal() {
        showModal = false;
        selectedField = null;
        selectedContainer = null;
        selectedRow = null;
        selectedGender = '';
        startDate = '';
        endDate = '';
    }
</script>

<div class="flex overflow-hidden">
    <!-- 좌측 사이드 바 -->
    <aside class="fixed h-full left-0 w-72 bg-white border-r border-gray-200 overflow-y-auto">
        <CategoryTree />
    </aside>

    <div class="fixed left-72 w-[calc(100%-288px)] flex items-center px-6 py-2 bg-white border-b border-gray-200 z-20">
        <!-- 상단 버튼 (New Query, Save) -->
        <div class="flex items-center gap-2">
            <button class="px-4 py-1 rounded-2xl bg-white border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-100 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                New Query
            </button>
            <button class="px-4 py-1 rounded-2xl bg-white border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-100 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
                </svg>
                Save
            </button>
        </div>
        <!-- 중앙 코호트 이름 입력창 -->
        <input
            type="text"
            class="ml-6 flex-1 max-w-xs px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="코호트 이름을 입력하세요"
            bind:value={cohortName}
        />
        <!-- 우측 컨테이너 간 연산 식 -->
        <div class="ml-auto flex items-center gap-2">
            <span class="text-xs text-gray-400">{generateFormula()}</span>
        </div>
    </div>
   
    <div class="ml-72 pt-12 flex h-[calc(100vh-60px)] w-full overflow-hidden">
        <!-- 메인 컨텐츠 영역 -->
        <div class="flex-1 overflow-y-auto border-b border-gray-200 w-full">
            <!-- 동적 행들 -->
            {#each rows as row, rowIndex}
                <div class="relative min-h-[120px] {getRowColor(rowIndex).bg} {getRowColor(rowIndex).border} border w-full pr-44">
                    <!-- 좌측 컨테이너 스크롤 영역 -->
                    <div class="flex-1 overflow-x-auto h-full" bind:this={scrollRefs[row.id]}>
                        <div class="flex items-start gap-4 min-h-[120px] min-w-max p-4">
                            <!-- 행 타입 표시 -->
                            <div class="flex flex-col gap-2 min-w-[80px] flex-shrink-0">
                                {#if row.type === 'initial'}
                                    <span class="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded w-fit">Initial Event</span>
                                    <span class="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded w-fit">Index Date</span>
                                {:else}
                                    <button 
                                        class="inline-block {row.type === 'NOT' ? 'bg-gray-600' : 'bg-gray-300'} {row.type === 'NOT' ? 'text-white' : 'text-gray-700'} text-xs px-2 py-1 rounded w-fit hover:opacity-80 transition-opacity"
                                        on:click={() => toggleRowType(row.id)}
                                        title="{row.type === 'NOT' ? 'NOT 해제' : 'NOT 적용'}"
                                    >
                                        {row.type === 'NOT' ? 'NOT' : 'AND'}
                                    </button>
                                {/if}
                            </div>
                        
                            <!-- 컨테이너들 -->
                            {#each row.containers as container, containerIndex}
                                <!-- 컨테이너 -->
                                {#if container.isEmpty}
                                    <div 
                                        class="border-2 border-dashed border-gray-300 rounded-lg p-6 min-w-[450px] w-[450px] min-h-[120px] flex items-center justify-center text-gray-500 text-sm bg-white hover:border-gray-400 transition-colors flex-shrink-0"
                                        on:drop={(e) => handleDrop(e, row.id, container.id)}
                                        on:dragover={allowDrop}
                                        role="button"
                                        tabindex="0"
                                    >
                                        <div class="text-center">
                                            <svg class="w-6 h-6 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                            </svg>
                                            <div>조건을 설정할</div>
                                            <div>조회 항목을 끌어다 놓으세요</div>
                                        </div>
                                    </div>
                                {:else}
                                    <div class="bg-white rounded-lg border border-gray-200 p-4 min-w-[450px] w-[450px] shadow-sm flex-shrink-0">
                                        <div class="flex items-center justify-between mb-3">
                                            <div class="flex items-center gap-2">
                                                <span class="{getRowColor(rowIndex).textColor} font-bold text-sm">{getContainerNumber(getGlobalContainerIndex(rowIndex, containerIndex))}</span>
                                                <span class="text-gray-700 text-sm">컨테이너 {containerIndex + 1}</span>
                                            </div>
                                            <div class="flex items-center gap-1">
                                                <button 
                                                    aria-label="Remove container"
                                                    class="w-4 h-4 text-gray-400 hover:text-red-600" 
                                                    on:click={() => removeContainer(row.id, container.id)}
                                                >
                                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        <!-- 구분선 -->
                                        <div class="border-b border-gray-200"></div>
                                        
                                        <!-- 필드 영역 -->
                                        <div 
                                            class="min-h-[60px] py-2"
                                            on:drop={(e) => handleDrop(e, row.id, container.id)}
                                            on:dragover={allowDrop}
                                            role="button"
                                            tabindex="0"
                                        >
                                            {#if container.items.length === 0}
                                                <div class="text-center text-gray-400 text-sm py-4">
                                                    필드를 여기에 드래그하세요
                                                </div>
                                            {:else}
                                                <div class="space-y-2">
                                                    {#each container.items as item, itemIndex}
                                                        <div class="bg-gray-50 rounded p-2 border border-gray-200">
                                                            <div class="flex items-center justify-between">
                                                                <button 
                                                                    class="flex-1 text-left"
                                                                    on:click={() => openFieldModal(row.id, container.id, itemIndex)}
                                                                >
                                                                    <div class="flex items-center gap-2">
                                                                        <span class="text-xs text-gray-500 w-12 truncate">{item.tableName}</span>
                                                                        <span class="text-sm font-medium text-gray-700">{item.fieldName}</span>
                                                                        {#if item.conditions}
                                                                            <span class="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                                                {item.conditions}
                                                                            </span>
                                                                        {/if}
                                                                    </div>
                                                                </button>
                                                                <div class="flex items-center gap-2 ml-3">
                                                                    <button 
                                                                        aria-label="Remove item"
                                                                        class="text-gray-400 hover:text-red-600"
                                                                        on:click={() => removeItemFromContainer(row.id, container.id, itemIndex)}
                                                                    >
                                                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    {/each}
                                                </div>
                                            {/if}
                                        </div>
                                    </div>
                                {/if}

                                <!-- 로직 연결 (마지막 컨테이너가 아닌 경우) -->
                                {#if containerIndex < row.containers.length - 1}
                                    <div class="flex items-center justify-center min-w-[60px] w-[60px] flex-shrink-0 relative">
                                        <!-- 로직 버튼 -->
                                        <div class="relative z-10">
                                            <button 
                                                class="bg-gray-500 text-white text-sm px-3 py-1.5 rounded-full hover:opacity-80 transition-opacity flex items-center gap-1 shadow-sm relative"
                                                on:click={() => toggleLogic(row.id, container.id)}
                                                title="클릭하여 {container.logic === 'AND' ? 'OR' : container.logic === 'OR' ? 'NOT' : 'AND'}로 변경"
                                            >
                                                <span class="flex items-center">{@html getLogicSymbol(container.logic)}</span>
                                                <span class="text-xs font-medium">{container.logic}</span>
                                            </button>
                                            
                                            <!-- 왼쪽으로 향하는 연결선 -->
                                            <div class="absolute right-full top-1/2 w-3 h-1 bg-gray-300 transform -translate-y-1/2"></div>
                                            
                                            <!-- 오른쪽으로 향하는 연결선 -->
                                            <div class="absolute left-full top-1/2 w-3 h-1 bg-gray-300 transform -translate-y-1/2"></div>
                                        </div>
                                    </div>
                                {/if}
                            {/each}
                            
                            <!-- 빈 컨테이너는 항상 마지막에 하나씩 유지 -->
                            <div class="w-[44px] flex-shrink-0"></div>
                        </div>
                    </div>
                    
                    <!-- 우측 고정 영역 (대상 환자 + 실행 버튼) -->
                    <div class="absolute top-0 right-0 w-44 h-full z-10 {getRowColor(rowIndex).rightBg} {getRowColor(rowIndex).rightBorder} border-l p-4 flex flex-col items-start justify-between">
                        <!-- 상단 실행 버튼 -->
                        <button class="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors" aria-label="Run Query">
                            <svg class="w-5 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M5 4v16l14-8z"/>
                            </svg>
                        </button>
                        
                        <!-- 중앙 대상 환자 정보 -->
                        <div class="text-start flex-1 flex flex-col justify-center">
                            <div class="text-xs text-gray-600">대상 환자</div>
                            <div class="text-xl font-bold {getRowColor(rowIndex).textColor} mb-1">{row.patientCount.toLocaleString()}명</div>
                        </div>
                    
                        <!-- 하단 코호트 확인 버튼 -->
                        <button class="w-full bg-white border border-gray-300 text-gray-700 text-xs py-2 px-3 rounded hover:bg-gray-50 transition-colors">
                            코호트 확인
                        </button>
                    
                        <!-- 행 삭제 버튼 (필요한 경우) -->
                        {#if rows.length > 1}
                            <button 
                                aria-label="Remove row"
                                class="absolute top-2 right-2 text-gray-400 hover:text-red-600 transition-colors"
                                on:click={() => removeRow(row.id)}
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        {/if}
                    </div>
                </div>
            {/each}
            
            <!-- 행 추가 버튼 -->
            <div class="mx-4 my-4 flex justify-center">
                <button 
                    class="flex items-center gap-2 px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white text-gray-600 hover:text-gray-800"
                    on:click={addRow}
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                    새 행 추가
                </button>
            </div>
        </div>
    </div>
</div> 

<!-- 필드 상세 설정 모달 -->
{#if showModal}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-[500px] max-w-md">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">필드 상세 설정</h3>
                <button aria-label="Close" on:click={closeModal} class="text-gray-400 hover:text-gray-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            
            {#if selectedField !== null && selectedRow && selectedContainer !== null}
                {@const currentItem = rows.find(r => r.id === selectedRow)?.containers.find(c => c.id === selectedContainer)?.items[selectedField]}
                
                <div class="mb-6">
                    <div class="text-sm text-gray-600 mb-1">테이블: {currentItem?.tableName}</div>
                    <div class="text-base font-medium mb-4">필드: {currentItem?.fieldName}</div>
                    
                    <!-- 성별 필드 -->
                    {#if currentItem?.fieldName === '성별'}
                        <div class="space-y-3">
                            <div class="text-sm font-medium">성별 선택:</div>
                            <div class="space-y-2">
                                <label class="flex items-center">
                                    <input type="radio" bind:group={selectedGender} value="남성" class="mr-2">
                                    남성
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" bind:group={selectedGender} value="여성" class="mr-2">
                                    여성
                                </label>
                            </div>
                        </div>
                    {:else if currentItem?.fieldName === '진단일자'}
                        <div class="space-y-3">
                            <div class="text-sm font-medium">날짜 범위:</div>
                            <div class="space-y-2">
                                <div>
                                    <label ariaclass="block text-sm text-gray-600 mb-1">시작일:</label>
                                    <input type="date" bind:value={startDate} class="w-full p-2 border rounded">
                                </div>
                                <div>
                                    <label class="block text-sm text-gray-600 mb-1">종료일:</label>
                                    <input type="date" bind:value={endDate} class="w-full p-2 border rounded">
                                </div>
                            </div>
                        </div>
                    {:else}
                        <div class="text-sm text-gray-500 py-4">
                            이 필드에 대한 상세 설정이 준비 중입니다.
                        </div>
                    {/if}
                </div>

                <div class="flex gap-3">
                    <button
                        class="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                        on:click={applyFieldConditions}
                    >
                        적용
                    </button>
                    <button
                        class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                        on:click={closeModal}
                    >
                        취소
                    </button>
                </div>
            {/if}
        </div>
    </div> 
{/if} 