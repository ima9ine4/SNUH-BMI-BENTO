<script>
    import CategoryTree from './components/CategoryTree.svelte';
    import FieldModal from './components/FieldModal.svelte';
    import { tick, onMount } from 'svelte';

    let headerHeight;
    let totalPatientsForProgress = 10000; // 전체 환자 수 (임시 데이터)
    let cohortName = '';
    let showModal = false;
    let selectedField = null;
    let selectedContainer = null;
    let selectedRow = null;
    let isFinalCountLoading = false;

    // 그룹 이름 수정 상태
    let editingRowId = null;
    let editingRowName = '';
    
    // 드래그 상태 추적
    let dragOverContainer = null; // { rowId, containerId, canDrop }
    let currentDragData = null;

    let rows = [
        {
            id: 1,
            type: 'initial', // initial, AND, NOT
            name: '그룹 A', // 그룹 이름 필드
            containers: [
                {
                    id: 1,
                    isEmpty: true,
                    tableName: null,
                    items: [], // { tableName, fieldName, conditions }
                    logic: 'AND'
                }
            ],
            patientCount: 0,
            rowOperator: 'AND', // 이 행 앞에 붙을 연산자
            isLoading: false
        }
    ];
    let nextRowId = 1;
    let nextContainerId = 2;
    let scrollRefs = {};

    const rowStyles = [
        {
            gradient: 'from-blue-800 to-blue-950',
            summary: 'blue-800',
            bar: 'bg-blue-800',
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-700',
            accent: 'bg-blue-100',
            light: 'bg-blue-100'
        },
        {
            gradient: 'from-blue-600 to-blue-700',
            summary: 'blue-600',
            bar: 'bg-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-700',
            accent: 'bg-blue-100',
            light: 'bg-blue-100'
        },
        {
            gradient: 'from-blue-400 to-blue-500',
            summary: 'blue-400',
            bar: 'bg-blue-400',
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-700',
            accent: 'bg-blue-100',
            light: 'bg-blue-100'
        }
    ];

    function getRowStyle(index) {
        if (index < 3) {
            return rowStyles[index];
        } else {
            return rowStyles[2];
        }
    }

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
            id: ++nextRowId,
            type: 'AND', // initial, AND, NOT
            name: `그룹 ${String.fromCharCode(65 + nextRowId - 1 )}`,
            containers: [
                {
                    id: nextContainerId++,
                    isEmpty: true,
                    tableName: null,
                    items: [],
                    logic: 'AND'
                }
            ],
            patientCount: 0,
            rowOperator: 'AND',
            isLoading: false
        };
        rows = [...rows, newRow];
    }

    // 그룹 이름 수정 관련 함수들
    function startEditingGroupName(rowId, currentName) {
        editingRowId = rowId;
        editingRowName = currentName;
        // 다음 tick에서 focus 설정
        tick().then(() => {
            const input = document.querySelector(`input[data-editing-row="${rowId}"]`);
            if (input) {
                input.focus();
                input.select();
            }
        });
    }

    function saveGroupName() {
        if (editingRowId && editingRowName.trim()) {
            rows = rows.map(row => {
                if (row.id === editingRowId) {
                    return { ...row, name: editingRowName.trim() };
                }
                return row;
            });
        }
        editingRowId = null;
        editingRowName = '';
    }

    function cancelEditingGroupName() {
        editingRowId = null;
        editingRowName = '';
    }

    function handleGroupNameKeydown(event) {
        if (event.key === 'Enter') {
            saveGroupName();
        } else if (event.key === 'Escape') {
            cancelEditingGroupName();
        }
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
                            tableName: null,
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
                        tableName: null,
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
            if(rows.length === 1) {
                rows[0].type = 'initial';
            }
        }
    }

    function handleDragOver(event, rowId, containerId) {
        event.preventDefault();

        const dragData = window.currentDragData;
        if (!dragData) return;

        const targetRow = rows.find(r => r.id === rowId);
        const targetContainer = targetRow?.containers.find(c => c.id === containerId);

        let canDrop = true;
        if (!targetContainer?.isEmpty && targetContainer?.tableName) {
            canDrop = targetContainer.tableName === dragData.tableName;
        }

        if (
            dragOverContainer && 
            dragOverContainer.rowId === rowId && 
            dragOverContainer.containerId === containerId &&
            dragOverContainer.canDrop === canDrop
        ) {
            // 이미 같은 상태면 업데이트하지 않음 (깜빡거림 방지)
            return;
        }
        dragOverContainer = { rowId, containerId, canDrop };
    }


    function handleDrop(event, rowId, containerId) {
        event.preventDefault();
        const dragDataString = event.dataTransfer.getData('text/plain');
        if (!dragDataString) return;
        
        let tableName, fieldName, fieldType;
    
        try {
            // JSON 형태로 파싱 시도
            const dragData = JSON.parse(dragDataString);
            tableName = dragData.tableName;
            fieldName = dragData.fieldName;
            fieldType = dragData.fieldType || 'unknown';
            currentDragData = dragData; // 현재 드래그 데이터 업데이트
        } catch (e) {
            // JSON 파싱 실패 시 기존 방식으로 처리
            tableName = "알 수 없음";
            fieldName = dragDataString;
            fieldType = 'unknown';
            currentDragData = { tableName, fieldName, fieldType };
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
                                fieldType,
                                conditions: null,
                                displayText: fieldName
                            };
                            const newItems = container.isEmpty ? [newItem] : [...container.items, newItem];
                            return {
                                ...container,
                                isEmpty: false,
                                tableName: tableName,
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
        
        // 드래그 상태 초기화
        dragOverContainer = null;
        currentDragData = null;
    }

    function removeItemFromContainer(rowId, containerId, itemIndex) {
        rows = rows.map(row => {
            if (row.id === rowId) {
                return {
                    ...row,
                    containers: row.containers.map(container => {
                        if (container.id === containerId) {
                            const newItems = container.items.filter((_, index) => index !== itemIndex);
                            const isEmpty = newItems.length === 0;
                            return {
                                ...container,
                                isEmpty: isEmpty,
                                tableName: isEmpty ? null : container.tableName, // 빈 컨테이너가 되면 테이블명 초기화
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

    function closeModal() {
        showModal = false;
        selectedField = null;
        selectedContainer = null;
        selectedRow = null;
    }

    function executeAllCohorts() {
        // 전체 코호트 실행 로직
        console.log('코호트 생성');
    }

    function executeRowQuery(rowId) {
        // 로딩 상태 시작
        rows = rows.map(r => r.id === rowId ? { ...r, isLoading: true } : r);
        
        const row = rows.find(r => r.id === rowId);
        if (row) {
            console.log(`그룹 ${String.fromCharCode(65 + rowId - 1)} 환자수 조회`, row);
            
            // API 호출 시뮬레이션
            setTimeout(() => {
                const randomCount = Math.floor(Math.random() * 10000) + 1000;
                rows = rows.map(r => r.id === rowId ? { 
                    ...r, 
                    patientCount: randomCount,
                    isLoading: false 
                } : r);
            }, Math.random() * 1000 + 1000); // 1-2초 랜덤 지연
        }
    }

    onMount(() => {
        // 전역 드래그 종료 이벤트 리스너
        const handleGlobalDragEnd = () => {
            dragOverContainer = null;
            currentDragData = null;
            window.currentDragData = null; // 전역 변수도 초기화
        };
        
        document.addEventListener('dragend', handleGlobalDragEnd);
        
        return () => {
            document.removeEventListener('dragend', handleGlobalDragEnd);
        };
    });
</script>

<div class="flex bg-slate-200 h-screen">
    <!-- 좌측 사이드 바 -->
    <aside class="fixed h-full left-0 w-72 bg-white border-r border-slate-200 overflow-y-auto z-50">
        <CategoryTree />
    </aside>

    <!-- 메인 컨텐츠 -->
    <div class="ml-72 flex-1 flex flex-col h-screen">
        <!-- 상단 헤더 -->
        <header bind:clientHeight={headerHeight} class="fixed top-[60px] left-72 right-0 bg-white border-b border-slate-200 px-6 pt-3 pb-2 z-20 shadow-sm">
            <div class="flex items-center justify-between gap-4 w-full">
                <h1 class="text-lg font-semibold text-slate-800">코호트 정의하기</h1>
                <input
                    type="text"
                    class="flex-1 w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-transparent"
                    placeholder="코호트 이름을 입력하세요"
                    bind:value={cohortName}
                />
                <div class="flex items-center gap-3 flex-shrink-0">
                    <button class="bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-blue-900 transition-colors shadow-md">
                        <span>코호트 생성</span>
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path></svg>
                    </button>
                </div>
            </div>
            
            <div class="mt-3 pt-2 border-t border-slate-200">
                <div class="flex items-center justify-between h-[100px] py-2 px-2">
                    <div class="flex items-center gap-0 h-full overflow-x-auto pr-4">
                        {#each rows as row, i}
                            {@const rowStyle = getRowStyle(i)}
                            {#if i > 0 && row.type !== 'initial'}
                                <div class="flex-shrink-0 flex flex-row items-center justify-center h-full">
                                    <div class="w-2 h-px bg-slate-300"></div>
                                        {#if row.rowOperator === 'NOT'}
                                            <span class="text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full border border-red-500">NOT</span>
                                        {:else}
                                            <span class="text-xs font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-full border border-slate-300">AND</span>
                                        {/if}
                                    <div class="w-2 h-px bg-slate-300"></div>
                                </div>
                            {/if}
                            
                            {@const percentage = totalPatientsForProgress > 0 ? ((row.patientCount / totalPatientsForProgress) * 100) : 0}
                            <div class="px-4 gap-2 bg-slate-100 border-2 border-{rowStyle.summary} rounded-lg p-2.5 w-[180px] h-full flex flex-col justify-between shadow-sm flex-shrink-0">
                                <div class="flex justify-between items-start">
                                    <div class="text-sm font-bold text-{rowStyle.summary} border-{rowStyle.summary} truncate pr-2">{row.name}</div>
                                    <button 
                                        class="text-{rowStyle.summary} hover:text-blue-800 transition-colors flex-shrink-0"
                                        on:click|stopPropagation={() => executeRowQuery(row.id)}
                                        title="환자 수 조회"
                                    >
                                        {#if row.isLoading}
                                            <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        {:else}
                                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 -2 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path></svg>
                                        {/if}
                                    </button>
                                </div>
                                
                                <div class="space-y-2 text-center">
                                    <div class="mx-auto bg-slate-300 rounded-full h-2 overflow-hidden">
                                        <div class="{rowStyle.bar} h-2 rounded-full" style="width: {row.patientCount > 0 ? percentage.toFixed(1) : 0}%"></div>
                                    </div>
                                    {#if row.patientCount > 0}
                                        <p class="text-xs text-blue-700 font-medium">
                                            {row.patientCount.toLocaleString()} / {totalPatientsForProgress.toLocaleString()}
                                            <span class="font-normal {rowStyle.text}">({percentage.toFixed(1)}%)</span>
                                        </p>
                                    {:else}
                                         <p class="text-xs text-slate-400">환자 수 미조회</p>
                                    {/if}
                                </div>
                            </div>
                        {/each}
                    </div>
                    <div class="border-l border-slate-200 h-full">
                        <div class="px-4 ml-4 gap-2 bg-slate-100 border-2 border-slate-300 rounded-lg p-2.5 w-[180px] h-full flex flex-col justify-between shadow-sm flex-shrink-0">
                            <div class="flex justify-between items-start">
                                <div class="text-sm font-bold text-blue-900 border-slate-300 truncate pr-2">최종 환자 수</div>
                                <button 
                                    class="text-blue-900 flex-shrink-0"
                                    on:click|stopPropagation={() => executeRowQuery(row.id)}
                                    title="환자 수 조회"
                                >
                                    {#if isFinalCountLoading}
                                        <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    {:else}
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 -2 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path></svg>
                                    {/if}
                                </button>
                            </div>
                            
                            <div class="space-y-2 text-center">
                                <div class="mx-auto bg-slate-300 rounded-full h-2 overflow-hidden">
                                    <div class="bg-slate-300 h-2 rounded-full" style="width: percentage.toFixed(1)%"></div>
                                </div>
                                {#if -1 > 0} <!-- finalPatientCount > 0 -->
                                    <p class="text-xs text-blue-900 font-medium">
                                        <!-- {finalPatientCount.toLocaleString()} / {totalPatientsForProgress.toLocaleString()} -->
                                        <!-- <span class="font-normal text-blue-700">({(finalPatientCount / totalPatientsForProgress * 100).toFixed(1)}%)</span> -->
                                    </p>
                                {:else}
                                    <p class="text-xs text-slate-400">환자 수 미조회</p>
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- 메인 콘텐츠 영역 (스크롤) -->
        <div class="flex-1 overflow-y-auto mt-[180px] h-screen">
        <!-- 쿼리 단계 카드들 -->
            <main class="px-5 space-y-4 py-6 overflow-y-auto h-screen">
                {#each rows as row, rowIndex}
                    {@const style = getRowStyle(rowIndex)}
                    <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <!-- 카드 헤더 -->
                    <div class="bg-gradient-to-r {style.gradient} px-5 py-3 text-white">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                {#if row.type !== 'initial'}
                                    <!-- 토글 스위치 -->
                                    <div class="flex items-center gap-2">
                                        <button 
                                            class="relative inline-flex h-7 w-[76px] items-center rounded-full transition-all duration-200 ease-in-out focus:outline-none {row.type === 'NOT' ? 'bg-red-400' : row.id>2 ? 'bg-blue-500' : 'bg-blue-900'}"
                                            on:click={() => toggleRowType(row.id)}
                                        >
                                            <span class="absolute left-2 text-xs font-medium text-white {row.type === 'AND' ? 'opacity-100' : 'opacity-50'}">AND</span>
                                            <span class="absolute right-2 text-xs font-medium text-white {row.type === 'NOT' ? 'opacity-100' : 'opacity-50'}">NOT</span>                                            
                                            <span class="inline-block h-5 w-8 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out {row.type === 'NOT' ? 'translate-x-10' : 'translate-x-1'} flex items-center justify-center">
                                                <span class="text-xs font-bold {row.type === 'NOT' ? 'text-red-500' : 'text-blue-500'}">
                                                    {row.type === 'NOT' ? 'NOT' : 'AND'}
                                                </span>
                                            </span>
                                        </button>
                                    </div>
                                {:else}
                                    <div class="flex items-center gap-2">
                                        <div class="px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-medium border border-white border-opacity-30">
                                            <span class="text-xs font-semibold">Initial</span>
                                        </div>
                                    </div>
                                {/if}
                                <div class="flex items-center gap-2">
                                    <h3 class="font-medium text-base flex items-center gap-2">
                                        {#if editingRowId === row.id}
                                            <input
                                                type="text"
                                                class="bg-white bg-opacity-90 text-gray-800 px-2 py-0.5 border border-white border-opacity-50 rounded text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent w-56"
                                                data-editing-row={row.id}
                                                bind:value={editingRowName}
                                                on:keydown={handleGroupNameKeydown}
                                                on:blur={saveGroupName}
                                            />
                                        {:else}
                                            <span>{row.name}</span>
                                            <button 
                                                aria-label="그룹명 수정"
                                                class="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors duration-200"
                                                on:click={() => startEditingGroupName(row.id, row.name)}
                                                title="그룹명 수정"
                                            >
                                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                                </svg>
                                            </button>
                                        {/if}
                                        {row.type === 'NOT' ? '(제외)' : ''}
                                    </h3>
                                    <p class="text-xs text-white text-opacity-80 pt-0.5">
                                        {row.type === 'NOT' ? '해당 조건을 만족하지 않는 환자' : '해당 조건을 만족하는 환자'}
                                    </p>
                                </div>
                            </div>
                            
                            <div class="flex items-center gap-3">
                                {#if rows.length > 1}
                                    <button 
                                        aria-label="그룹 삭제"
                                        class="p-1.5 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                                        on:click={() => removeRow(row.id)}
                                    >
                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                        </svg>
                                    </button>
                                {/if}
                            </div>
                        </div>
                    </div>
                    
                    <!-- 카드 본문 -->
                    <div class="p-4">
                        <div class="max-w-full overflow-x-auto">
                            <div class="flex items-center gap-0 w-max">
                                {#each row.containers as container, containerIndex}
                                    <!-- 컨테이너 -->
                                    {#if container.isEmpty}
                                        <div 
                                            class="border-2 border-dashed border-slate-300 rounded-lg p-6 min-w-[380px] flex items-center justify-center text-slate-500 bg-slate-50 hover:border-slate-400 hover:bg-slate-100 transition-all duration-200"
                                            on:drop={(e) => handleDrop(e, row.id, container.id)}
                                            on:dragover={(e) => handleDragOver(e, row.id, container.id)}
                                            role="button"
                                            tabindex="0"
                                        >
                                            <div class="text-center">
                                                <div>
                                                    <div class="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center mx-auto mb-2">
                                                        <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                                        </svg>
                                                    </div>
                                                    <h4 class="font-medium text-slate-700 mb-1 text-sm">테이블 별 컨테이너 추가</h4>
                                                    <p class="text-xs text-slate-500">좌측에서 항목을 끌어다 놓으세요</p>
                                                </div>
                                            </div>
                                        </div>
                                    {:else}
                                        <div class="bg-white rounded-lg border {style.border} p-3 min-w-[380px] shadow-sm overflow-x-auto relative">
                                            <div class="flex items-center justify-between mb-2">
                                                <div class="flex items-center gap-2">
                                                    <div class="w-5 h-5 bg-slate-300 rounded-full flex items-center justify-center">
                                                        <span class="text-xs font-semibold text-slate-800">{getContainerNumber(getGlobalContainerIndex(rowIndex, containerIndex))}</span>
                                                    </div>
                                                    <div class="flex items-center gap-4">
                                                        <span class="text-sm font-medium text-slate-900">컨테이너 {containerIndex + 1}</span>
                                                        {#if container.tableName}
                                                            <div class="flex items-center gap-2">
                                                                <div class="w-0.5 h-3 bg-slate-300 rounded-full"></div>
                                                                <span class="text-sm font-semibold text-blue-900 px-2 py-0.5 rounded-full">
                                                                    {container.tableName}
                                                                </span>
                                                            </div>
                                                        {/if}
                                                    </div>
                                                </div>
                                                <button 
                                                    aria-label="컨테이너 삭제"
                                                    class="text-slate-400 hover:text-red-500 transition-colors"
                                                    on:click={() => removeContainer(row.id, container.id)}
                                                >
                                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                                    </svg>
                                                </button>
                                            </div>

                                            <!-- 드롭 불가능한 상태 -->
                                            <div 
                                                class="absolute inset-0 bg-red-50 border-2 border-red-500 border-dashed rounded-lg items-center justify-center z-10"
                                                class:flex={dragOverContainer && dragOverContainer.rowId === row.id && dragOverContainer.containerId === container.id && !dragOverContainer.canDrop}
                                                class:hidden={!(dragOverContainer && dragOverContainer.rowId === row.id && dragOverContainer.containerId === container.id && !dragOverContainer.canDrop)}
                                            >
                                                <div class="text-center">
                                                    <div class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/>
                                                        </svg>
                                                    </div>
                                                    <h4 class="font-medium text-red-700 mb-1 text-sm">드롭 불가능</h4>
                                                    <p class="text-xs text-red-500 mt-1">{container.tableName} 테이블 내 필드만 드롭 가능합니다.</p>
                                                </div>
                                            </div>

                                            <div class="border-t border-slate-200 pt-2">
                                                <div 
                                                    class="min-h-[60px] space-y-1.5"
                                                    on:drop={(e) => handleDrop(e, row.id, container.id)}
                                                    on:dragover={(e) => handleDragOver(e, row.id, container.id)}
                                                    role="button"
                                                    tabindex="0"
                                                >
                                                    {#each container.items as item, itemIndex}
                                                        <div class="bg-slate-50 rounded-md p-2.5 border border-slate-300 hover:border-slate-400 transition-colors">
                                                            <div class="flex items-center justify-between">
                                                                <button
                                                                    aria-label="필드 별 모달 열기"
                                                                    class="flex-1 text-left"
                                                                    on:click={() => openFieldModal(row.id, container.id, itemIndex)}
                                                                >
                                                                    <div class="flex items-center gap-2">
                                                                        <span class="text-xs font-medium text-slate-800">{item.fieldName}</span>
                                                                    </div>
                                                                    {#if item.conditions}
                                                                        <div class="mt-1">
                                                                            <span class="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                                                                {item.conditions}
                                                                            </span>
                                                                        </div>
                                                                    {/if}
                                                                </button>
                                                                <button
                                                                    aria-label="필드 삭제"
                                                                    class="text-slate-400 hover:text-red-500 transition-colors ml-2"
                                                                    on:click={() => removeItemFromContainer(row.id, container.id, itemIndex)}
                                                                >
                                                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    {/each}
                                                </div>
                                            </div>
                                        </div>
                                    {/if}

                                    <!-- 로직 연결 -->
                                    {#if containerIndex < row.containers.length - 1}
                                        <div class="flex flex-row items-center justify-center">
                                            <div class="h-px w-2 bg-slate-300"></div>
                                            <button 
                                                class="bg-white border-2 border-slate-300 text-slate-700 px-2.5 py-2 rounded-full hover:border-slate-400 hover:bg-slate-50 transition-all duration-200 flex flex-col items-center shadow-sm"
                                                on:click={() => toggleLogic(row.id, container.id)}
                                            >
                                                <span class="flex items-center">{@html getLogicSymbol(container.logic)}</span>
                                                <span class="text-xs font-medium">{container.logic}</span>
                                            </button>
                                            <div class="h-px w-2 bg-slate-300"></div>
                                        </div>
                                    {/if}
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
            
            <!-- 새 행 추가 버튼 -->
            <div class="flex justify-center">
                <button 
                    class="flex items-center gap-2.5 px-24 mb-[100px] py-5 border-2 border-dashed border-slate-300 rounded-lg hover:border-slate-400 transition-all duration-200 bg-white hover:bg-slate-50"
                    on:click={addRow}
                >
                    <div class="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                    </div>
                    <div class="text-left">
                        <h4 class="font-medium text-slate-700 text-sm">새 그룹 추가</h4>
                        <p class="text-xs text-slate-500">추가 조건을 설정하세요</p>
                    </div>
                </button>
            </div>
        </main>
        </div>
    </div>
</div> 

<!-- 필드 상세 설정 모달 -->
{#if showModal && selectedField !== null && selectedRow && selectedContainer !== null}
    {@const currentItem = rows.find(r => r.id === selectedRow)?.containers.find(c => c.id === selectedContainer)?.items[selectedField]}
    
    <FieldModal 
        showModal={showModal}
        fieldData={currentItem ? {
            fieldName: currentItem.fieldName,
            tableName: currentItem.tableName,
            fieldType: currentItem.fieldType
        } : null}
        onClose={closeModal}
        onApply={(conditions) => {
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
                                                conditions: conditions.displayText
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
            closeModal();
        }}
    />
{/if} 