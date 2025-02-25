let seatingChart = [
    [19, 27, 11, 17, 23],
    [30, 9, 1, 29, 6],
    [3, 4, 21, 25, 22],
    [24, 14, 18, 15, 10],
    [7, 5, 20, 28, 2],
    [26, 8, 16, 12, 13]
];

const methods = {
    "小十字": {
        "wrap_around": true,
        "directions": [[1, 0], [-1, 0], [0, 1], [0, -1]]
    },
    "大十字": {
        "wrap_around": false,
        "directions": [[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, -1], [0, -2], [0, -3], [0, -4], [0, -5]]
    },
    "大叉叉": {
        "wrap_around": false,
        "directions": [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5]]
    },
    "小叉叉": {
        "wrap_around": true,
        "directions": [[1, 1], [-1, -1], [1, -1], [-1, 1]]
    },
    "九宮格": {
        "wrap_around": true,
        "directions": [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]]
    },
    "Σ": {
        "wrap_around": true,
        "directions": [[-1, 1], [-2, 2], [-1, 2], [0, 2], [1, 2],[-1, -1], [-2, -2], [-1, -2], [0, -2], [1, -2]]
    },
    "麥當勞": {
        "wrap_around": true,
        "directions": [[1, 1], [2, 2], [2, 1], [2, 0], [2, -1], [-1, 1], [-2, 2], [-2, 1], [-2, 0], [-2, -1]]
    },
    "積分": {
        "wrap_around": true,
        "directions": [[0,1],[0,2],[1,2],[0,-1],[0,-2],[-1,-2]]
    },
    "微分": {
        "wrap_around": true,
        "directions":[[1,1],[2,2]]
    },
    "肯德基": {
        "wrap_around": true,
        "directions": [[0,1],[0,2],[0,-1],[0,-2],[1,1],[2,2],[1,-1],[2,-2]]
    },
    "橫排": {
        "wrap_around": false,
        "directions": [[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0]]
    },
    "直列": {
        "wrap_around": false,
        "directions": [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, -1], [0, -2], [0, -3], [0, -4], [0, -5]]
    },
    "π": {
        "wrap_around": true,
        "directions": [[1, 0], [2, 0], [-1, 0], [-2, 0],[1,-1],[1,-2],[1,-3],[2,-3],[-1,-1],[-1,-2],[-1,-3]]
    },
    "otamatone": {
        "wrap_around": true,
        "directions": [[1, 0], [-1, 0], [0, 1], [0, -1],[0,2],[0,3],[1,3]]
    }
};

let isEditMode = false;

// 顯示/隱藏載入動畫
function showLoading(message = '載入中...') {
    document.getElementById('loading-text').textContent = message;
    document.getElementById('loading-overlay').style.display = 'flex';
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    overlay.style.animation = 'fadeOut 0.3s ease-in-out';
    setTimeout(() => {
        overlay.style.display = 'none';
        overlay.style.animation = 'fadeIn 0.3s ease-in-out';
    }, 300);
}

// 座位表相關功能
function toggleEditMode() {
    isEditMode = !isEditMode;
    const btn = document.getElementById('edit-mode-btn');
    btn.textContent = isEditMode ? '退出編輯模式' : '進入編輯模式';
    btn.style.backgroundColor = isEditMode ? '#dc3545' : '#28a745';
    printSeatingChart(seatingChart);
}

function printSeatingChart(seatingChart) {
    const container = document.getElementById('seating-chart');
    container.innerHTML = '';
    const table = document.createElement('table');
    seatingChart.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach((num, colIndex) => {
            const td = document.createElement('td');
            td.contentEditable = isEditMode;
            td.textContent = num;
            
            if (isEditMode) {
                const selectAllText = () => {
                    const selection = window.getSelection();
                    const range = document.createRange();
                    range.selectNodeContents(td);
                    selection.removeAllRanges();
                    selection.addRange(range);
                };

                td.addEventListener('click', selectAllText);
                td.addEventListener('focus', selectAllText);

                td.addEventListener('input', () => {
                    const value = td.textContent.replace(/\D/g, '');
                    if (value) {
                        td.textContent = value;
                    }
                });

                td.addEventListener('blur', () => {
                    const newValue = parseInt(td.textContent);
                    if (!isNaN(newValue)) {
                        seatingChart[rowIndex][colIndex] = newValue;
                    } else {
                        td.textContent = num;
                    }
                });
            } else {
                td.addEventListener('click', () => {
                    document.getElementById('seat-number').value = num;
                    applySelectedMethod();
                });
            }

            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
    container.appendChild(table);
}

function createEmptyChart() {
    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);
    
    if (isNaN(rows) || isNaN(cols) || rows < 1 || cols < 1) {
        showModal('請輸入有效的列數和行數');
        return;
    }

    seatingChart = Array.from({ length: rows }, () => 
        Array.from({ length: cols }, () => 0)
    );
    printSeatingChart(seatingChart);
    showModal('已建立空白座位表，請編輯座位號碼');
}

function clearSeatingChart() {
    if (seatingChart.length > 0) {
        const rows = seatingChart.length;
        const cols = seatingChart[0].length;
        seatingChart = Array.from({ length: rows }, () => 
            Array.from({ length: cols }, () => 0)
        );
        printSeatingChart(seatingChart);
        showModal('座位表已清空');
    }
}

function exportSeatingChart() {
    const exportText = seatingChart
        .map(row => row.join(' '))
        .join(',');
    
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seating_chart.txt';
    
    document.body.appendChild(a);
    a.click();
    
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

function updateSeatingChart() {
    const newSeatingChart = document.getElementById('new-seatingchart').value;
    const newSeatingChartArray = newSeatingChart.split(',').map(row => row.trim().split(' ').map(Number));
    
    if (newSeatingChartArray.every(row => row.every(num => !isNaN(num)))) {
        const flatArray = newSeatingChartArray.flat();
        const uniqueNumbers = new Set(flatArray);
        
        if (flatArray.length !== uniqueNumbers.size) {
            showModal('座號重複，請檢查輸入的座位表');
            return;
        }
        
        seatingChart = newSeatingChartArray;
        printSeatingChart(seatingChart);
        showModal('座位表已更新');
        document.getElementById('new-seatingchart').value = '';
    } else {
        showModal('請輸入正確的座位表');
    }
}

// 選取方法相關功能
function getPosition(seatingChart, r, c, wrapAround) {
    const rows = seatingChart.length;
    const cols = seatingChart[0].length;
    if (wrapAround) {
        r = (r + rows) % rows;
        c = (c + cols) % cols;
        return seatingChart[r][c];
    } else {
        if (0 <= r && r < rows && 0 <= c && c < cols) {
            return seatingChart[r][c];
        } else {
            return null;
        }
    }
}

function applyMethod(seatingChart, number, methodName, methods) {
    const [row, col] = findNumber(seatingChart, number) || [];
    if (row === undefined || col === undefined) {
        return [];  
    }

    const method = methods[methodName];
    if (!method) {
        return [];  
    }

    const wrapAround = method.wrap_around;
    const directions = method.directions;

    if (!Array.isArray(directions) || !directions.every(d => Array.isArray(d) && d.length === 2)) {
        return []; 
    }

    const values = new Set();
    directions.forEach(direction => {
        const r = row - direction[1];
        const c = col + direction[0];
        const value = getPosition(seatingChart, r, c, wrapAround);
        if (value !== null) {
            values.add(value);
        }
    });

    return Array.from(values).sort((a, b) => a - b);  
}

function visualizeResult(seatingChart, result, seatNumber) {
    const container = document.getElementById('seating-chart');
    const table = container.querySelector('table');
    
    seatingChart.forEach((row, rowIndex) => {
        row.forEach((num, colIndex) => {
            const cell = table.rows[rowIndex].cells[colIndex];
            cell.classList.remove('highlight', 'chosen');
        });
    });

    seatingChart.forEach((row, rowIndex) => {
        row.forEach((num, colIndex) => {
            const cell = table.rows[rowIndex].cells[colIndex];
            if (num === seatNumber) {
                cell.classList.add('chosen');
            } else if (result.includes(num)) {
                cell.classList.add('highlight');
            }
        });
    });
}

function findNumber(seatingChart, number) {
    for (let row = 0; row < seatingChart.length; row++) {
        for (let col = 0; col < seatingChart[row].length; col++) {
            if (seatingChart[row][col] === number) {
                return [row, col];
            }
        }
    }
    return null;
}

function applySelectedMethod() {
    const seatNumber = parseInt(document.getElementById('seat-number').value);
    const userNumber = parseInt(document.getElementById('user-number').value);
    const methodName = document.getElementById('method-select').value; 
    const result = applyMethod(seatingChart, seatNumber, methodName, methods);
    visualizeResult(seatingChart, result, seatNumber);
    document.getElementById('seat-number').value = '';
    if (result.includes(userNumber)) {
        showModal("你被選中了!!!");
    }
}

// 方法管理功能
function addNewMethod() {
    const methodName = document.getElementById('method-name').value;
    const wrapAround = document.getElementById('wrap-around').checked;
    const directionsInput = document.getElementById('directions').value;
    const directions = directionsInput.split('],[').map(d => d.replace('[', '').replace(']', '').split(',').map(Number));

    if (methodName && Array.isArray(directions) && directions.every(d => Array.isArray(d) && d.length === 2)) {
        methods[methodName] = {
            wrap_around: wrapAround,
            directions: directions
        };
    
        updateMethodSelect();
        showModal('新方法已添加');
        document.getElementById('method-name').value = '';
        document.getElementById('wrap-around').checked = false;
        document.getElementById('directions').value = '';
    } else {
        showModal('請輸入有效的方法名稱和方向');
    }
}

function updateMethodSelect() {
    const methodSelect = document.getElementById('method-select');
    methodSelect.innerHTML = '';
    Object.keys(methods).forEach(method => {
        const option = document.createElement('option');
        option.value = method;
        option.textContent = method;
        methodSelect.appendChild(option);
    });
}

// Modal 相關功能
function showModal(message) {
    const modal = document.getElementById('custom-alert');
    modal.querySelector('p').textContent = message;
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('custom-alert');
    modal.style.display = 'none';
}

// Google 登入相關功能
function handleLogin() {
    showLoading('Google 登入中...');
    window.location.href = '/login';
}

function handleLogout() {
    showLoading('登出中...');
    window.location.href = '/logout';
}

// 儲存相關動畫效果
function showSuccessAnimation(container, message) {
    const successElement = document.createElement('div');
    successElement.className = 'success-animation';
    successElement.innerHTML = `<i>✓</i> ${message}`;
    container.appendChild(successElement);
    
    setTimeout(() => {
        successElement.remove();
    }, 2000);
}

function showErrorAnimation(container, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-animation';
    errorElement.innerHTML = `<i>✗</i> ${message}`;
    container.appendChild(errorElement);
    
    setTimeout(() => {
        errorElement.remove();
    }, 2000);
}

// 儲存功能
async function saveSeatingChart() {
    const name = document.getElementById('save-name').value;
    if (!name) {
        showModal('請輸入座位表名稱');
        return;
    }
    
    const container = document.getElementById('saved-seating-charts');
    showLoading('儲存座位表中...');

    try {
        const response = await fetch('/api/seating-charts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                data: seatingChart
            })
        });

        hideLoading();
        if (response.ok) {
            document.getElementById('save-name').value = '';
            loadSavedSeatingCharts();
            showSuccessAnimation(container, '座位表已儲存');
        } else {
            showErrorAnimation(container, '儲存失敗');
        }
    } catch (error) {
        hideLoading();
        showErrorAnimation(container, '發生錯誤');
    }
}

async function loadSavedSeatingCharts() {
    showLoading('載入座位表清單...');
    try {
        const response = await fetch('/api/seating-charts');
        const container = document.getElementById('saved-seating-charts');
        
        hideLoading();
        if (response.ok) {
            const charts = await response.json();
            container.innerHTML = '<h4>已儲存的座位表：</h4>';
            
            charts.forEach((chart, index) => {
                const div = document.createElement('div');
                div.className = 'saved-item fade-in';
                div.style.animationDelay = `${index * 0.1}s`;
                div.innerHTML = `
                    <span>${chart.name}</span>
                    <div>
                        <button onclick='loadSeatingChart(${JSON.stringify(chart.data)}, ${chart.id})'>載入</button>
                        <button onclick='deleteSeatingChart(${chart.id})' style="background-color: #dc3545;">刪除</button>
                    </div>
                `;
                container.appendChild(div);
            });
        } else {
            showErrorAnimation(container, '載入失敗');
        }
    } catch (error) {
        hideLoading();
        showErrorAnimation(container, '發生錯誤');
    }
}

// 預設方法列表
const defaultMethods = new Set([
    "小十字", "大十字", "小叉叉", "大叉叉", "九宮格", "Σ", 
    "麥當勞", "積分", "微分", "肯德基", "橫排", "直列", "π", "otamatone"
]);

async function saveCurrentMethod() {
    const methodName = document.getElementById('method-select').value;
    const container = document.getElementById('saved-methods');
    showLoading('儲存方法中...');

    try {
        const response = await fetch('/api/methods', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: methodName,
                data: methods[methodName]
            })
        });

        hideLoading();
        if (response.ok) {
            loadSavedMethods();
            showSuccessAnimation(container, '方法已儲存');
        } else {
            showErrorAnimation(container, '儲存失敗');
        }
    } catch (error) {
        hideLoading();
        showErrorAnimation(container, '發生錯誤');
    }
}

async function loadSavedMethods() {
    showLoading('載入方法清單...');
    
    try {
        const response = await fetch('/api/methods');
        const container = document.getElementById('saved-methods');
        
        hideLoading();
        if (response.ok) {
            const savedMethods = await response.json();
            container.innerHTML = '<h4>已儲存的方法：</h4>';
            
            savedMethods.filter(method => !defaultMethods.has(method.name)).forEach((method, index) => {
                const div = document.createElement('div');
                div.className = 'saved-item fade-in';
                div.style.animationDelay = `${index * 0.1}s`;
                div.innerHTML = `
                    <span>${method.name}</span>
                    <div>
                        <button onclick='loadMethod("${method.name}", ${JSON.stringify(method.data)})'>載入</button>
                        <button onclick='deleteMethod(${method.id})' style="background-color: #dc3545;">刪除</button>
                    </div>
                `;
                container.appendChild(div);
            });
        } else {
            showErrorAnimation(container, '載入失敗');
        }
    } catch (error) {
        hideLoading();
        showErrorAnimation(container, '發生錯誤');
    }
}

function loadSeatingChart(chartData, chartId) {
    showLoading('載入座位表...');
    
    setTimeout(() => {
        seatingChart = chartData;
        printSeatingChart(seatingChart);
        hideLoading();
        
        const table = document.querySelector('#seating-chart table');
        if (table) {
            table.classList.add('bounce');
            setTimeout(() => {
                table.classList.remove('bounce');
            }, 1000);
        }
        
        showModal('座位表已載入');
    }, 500);
}

function loadMethod(name, methodData) {
    showLoading('載入方法...');
    
    setTimeout(() => {
        methods[name] = methodData;
        updateMethodSelect();
        document.getElementById('method-select').value = name;
        hideLoading();
        
        const select = document.getElementById('method-select');
        select.classList.add('bounce');
        setTimeout(() => {
            select.classList.remove('bounce');
        }, 1000);
        
        showModal('方法已載入');
    }, 500);
}

// 刪除功能
async function deleteSeatingChart(id) {
    if (!confirm('確定要刪除這個座位表嗎？')) {
        return;
    }

    showLoading('刪除座位表中...');
    
    try {
        const response = await fetch(`/api/seating-charts/${id}`, {
            method: 'DELETE'
        });

        hideLoading();
        const container = document.getElementById('saved-seating-charts');
        
        if (response.ok) {
            showSuccessAnimation(container, '座位表已刪除');
            loadSavedSeatingCharts();
        } else {
            showErrorAnimation(container, '刪除失敗');
        }
    } catch (error) {
        hideLoading();
        showErrorAnimation(container, '發生錯誤');
    }
}

async function deleteMethod(id) {
    if (!confirm('確定要刪除這個方法嗎？')) {
        return;
    }

    showLoading('刪除方法中...');
    
    try {
        const response = await fetch(`/api/methods/${id}`, {
            method: 'DELETE'
        });

        hideLoading();
        const container = document.getElementById('saved-methods');
        
        if (response.ok) {
            showSuccessAnimation(container, '方法已刪除');
            loadSavedMethods();
        } else {
            showErrorAnimation(container, '刪除失敗');
        }
    } catch (error) {
        hideLoading();
        showErrorAnimation(container, '發生錯誤');
    }
}

// 初始化
window.addEventListener('load', () => {
    // 無論是否登入，都先顯示預設座位表
    printSeatingChart(seatingChart);
    
    // 根據登入狀態決定是否載入儲存的資料
    const isAuthenticated = document.querySelector('.user-section span') !== null;
    if (isAuthenticated) {
        setTimeout(() => {
            loadSavedSeatingCharts();
            loadSavedMethods();
        }, 500);
    }
});
