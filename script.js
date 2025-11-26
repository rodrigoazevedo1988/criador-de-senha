// Configurações e Cache de elementos DOM
const CONFIG = {
    charset: {
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 
        numbers: '0123456789',
        symbols: '@!#$%&*()_+-=[]{}|;:,.<>?'
    },
    minLength: 6,
    maxLength: 30,
    debounceTime: 150
};

// Cache de elementos DOM para melhor performance
const elements = {
    slider: document.querySelector('#slider'),
    button: document.querySelector('#button'),
    copyBtn: document.querySelector('#copy-btn'),
    sizeDisplay: document.querySelector('#valor'),
    passwordElement: document.querySelector('#password'),
    containerPassword: document.querySelector('#container-password'),
    strengthLevel: document.querySelector('#strength-level'),
    strengthIndicator: document.querySelector('#strength-indicator'),
    themeSwitch: document.querySelector('#theme-switch'),
    // History elements
    historyBtn: document.querySelector('#history-btn'),
    historyModal: document.querySelector('#history-modal'),
    historyClose: document.querySelector('#history-close'),
    historyBackdrop: document.querySelector('.history-modal-backdrop'),
    historyList: document.querySelector('#history-list'),
    historyEmpty: document.querySelector('#history-empty'),
    historySearch: document.querySelector('#history-search'),
    searchClear: document.querySelector('#search-clear'),
    showFavoritesOnly: document.querySelector('#show-favorites-only'),
    clearHistoryBtn: document.querySelector('#clear-history'),
    statTotal: document.querySelector('#stat-total'),
    statFavorites: document.querySelector('#stat-favorites'),
    statAverage: document.querySelector('#stat-average'),
    // Export elements
    exportBtn: document.querySelector('#export-btn'),
    exportMenu: document.querySelector('#export-menu'),
    // Preset elements
    presetsGrid: document.querySelector('#presets-grid'),
    customPresetBtn: document.querySelector('#custom-preset-btn'),
    currentPresetName: document.querySelector('#current-preset-name'),
    checkboxes: {
        uppercase: document.querySelector('#uppercase'),
        lowercase: document.querySelector('#lowercase'),
        numbers: document.querySelector('#numbers'),
        symbols: document.querySelector('#symbols')
    }
};

// Estado da aplicação
let state = {
    currentPassword: '',
    isGenerating: false,
    currentTheme: 'dark',
    passwordHistory: [],
    maxHistorySize: 50,
    currentPreset: 'custom',
    customPresets: []
};

// === SISTEMA DE PRESETS ===

// Gerenciador de presets
const PresetManager = {
    // Presets predefinidos
    defaultPresets: {
        'general': {
            id: 'general',
            name: '🔒 Geral (Recomendado)',
            description: 'Configuração balanceada para uso geral',
            icon: '🔒',
            length: 16,
            uppercase: true,
            lowercase: true,
            numbers: true,
            symbols: true,
            isDefault: true,
            category: 'recommended'
        },
        'login': {
            id: 'login',
            name: '👤 Login/Cadastro',
            description: 'Senhas para contas online e cadastros',
            icon: '👤',
            length: 14,
            uppercase: true,
            lowercase: true,
            numbers: true,
            symbols: false,
            isDefault: true,
            category: 'web'
        },
        'banking': {
            id: 'banking',
            name: '🏦 Bancário/Financeiro',
            description: 'Máxima segurança para bancos e finanças',
            icon: '🏦',
            length: 20,
            uppercase: true,
            lowercase: true,
            numbers: true,
            symbols: true,
            isDefault: true,
            category: 'security'
        },
        'wifi': {
            id: 'wifi',
            name: '📶 WiFi/Roteador',
            description: 'Senhas para redes WiFi e roteadores',
            icon: '📶',
            length: 24,
            uppercase: true,
            lowercase: true,
            numbers: true,
            symbols: false,
            isDefault: true,
            category: 'network'
        },
        'social': {
            id: 'social',
            name: '🌐 Redes Sociais',
            description: 'Para Instagram, Facebook, Twitter, etc.',
            icon: '🌐',
            length: 12,
            uppercase: true,
            lowercase: true,
            numbers: true,
            symbols: false,
            isDefault: true,
            category: 'web'
        },
        'email': {
            id: 'email',
            name: '📧 Email',
            description: 'Para contas de email (Gmail, Outlook, etc.)',
            icon: '📧',
            length: 18,
            uppercase: true,
            lowercase: true,
            numbers: true,
            symbols: true,
            isDefault: true,
            category: 'web'
        },
        'gaming': {
            id: 'gaming',
            name: '🎮 Gaming',
            description: 'Para Steam, Xbox Live, PlayStation, etc.',
            icon: '🎮',
            length: 15,
            uppercase: true,
            lowercase: true,
            numbers: true,
            symbols: false,
            isDefault: true,
            category: 'entertainment'
        },
        'simple': {
            id: 'simple',
            name: '📝 Simples',
            description: 'Senhas básicas sem símbolos especiais',
            icon: '📝',
            length: 10,
            uppercase: true,
            lowercase: true,
            numbers: true,
            symbols: false,
            isDefault: true,
            category: 'basic'
        },
        'ultra_secure': {
            id: 'ultra_secure',
            name: '🛡️ Ultra Segura',
            description: 'Máxima segurança possível',
            icon: '🛡️',
            length: 30,
            uppercase: true,
            lowercase: true,
            numbers: true,
            symbols: true,
            isDefault: true,
            category: 'security'
        }
    },
    
    // Carregar presets customizados do localStorage
    loadCustomPresets() {
        try {
            const saved = localStorage.getItem('password-generator-presets');
            if (saved) {
                state.customPresets = JSON.parse(saved);
                console.log(`Presets customizados carregados: ${state.customPresets.length}`);
            }
        } catch (error) {
            console.error('Erro ao carregar presets customizados:', error);
            state.customPresets = [];
        }
    },
    
    // Salvar presets customizados
    saveCustomPresets() {
        try {
            localStorage.setItem('password-generator-presets', JSON.stringify(state.customPresets));
            console.log('Presets customizados salvos');
        } catch (error) {
            console.error('Erro ao salvar presets customizados:', error);
        }
    },
    
    // Obter todos os presets (padrão + customizados)
    getAllPresets() {
        return {
            ...this.defaultPresets,
            ...state.customPresets.reduce((acc, preset) => {
                acc[preset.id] = preset;
                return acc;
            }, {})
        };
    },
    
    // Obter preset por ID
    getPreset(id) {
        const allPresets = this.getAllPresets();
        return allPresets[id] || null;
    },
    
    // Aplicar preset
    applyPreset(presetId) {
        const preset = this.getPreset(presetId);
        if (!preset) {
            console.error('Preset não encontrado:', presetId);
            return false;
        }
        
        // Atualizar controles da interface
        elements.slider.value = preset.length;
        elements.sizeDisplay.textContent = preset.length;
        
        elements.checkboxes.uppercase.checked = preset.uppercase;
        elements.checkboxes.lowercase.checked = preset.lowercase;
        elements.checkboxes.numbers.checked = preset.numbers;
        elements.checkboxes.symbols.checked = preset.symbols;
        
        // Atualizar estado
        state.currentPreset = presetId;
        
        // Atualizar botão de gerar
        updateGenerateButtonState();
        
        // Gerar nova senha automaticamente se já existe uma
        if (state.currentPassword) {
            generatePassword();
        }
        
        showNotification(`⚙️ Preset "${preset.name}" aplicado!`, 'success');
        console.log('Preset aplicado:', preset.name);
        
        return true;
    },
    
    // Detectar se configuração atual corresponde a algum preset
    detectCurrentPreset() {
        const currentConfig = this.getCurrentConfig();
        const allPresets = this.getAllPresets();
        
        for (const [id, preset] of Object.entries(allPresets)) {
            if (this.configMatches(currentConfig, preset)) {
                state.currentPreset = id;
                return id;
            }
        }
        
        state.currentPreset = 'custom';
        return 'custom';
    },
    
    // Obter configuração atual dos controles
    getCurrentConfig() {
        return {
            length: parseInt(elements.slider.value),
            uppercase: elements.checkboxes.uppercase.checked,
            lowercase: elements.checkboxes.lowercase.checked,
            numbers: elements.checkboxes.numbers.checked,
            symbols: elements.checkboxes.symbols.checked
        };
    },
    
    // Verificar se duas configurações são iguais
    configMatches(config1, config2) {
        return config1.length === config2.length &&
               config1.uppercase === config2.uppercase &&
               config1.lowercase === config2.lowercase &&
               config1.numbers === config2.numbers &&
               config1.symbols === config2.symbols;
    },
    
    // Inicializar sistema de presets
    init() {
        this.loadCustomPresets();
        this.detectCurrentPreset();
        console.log('Sistema de presets inicializado');
    }
};

// === INTERFACE DE PRESETS ===

// Gerenciador de interface de presets
const PresetUI = {
    // Renderizar todos os presets
    renderPresets() {
        if (!elements.presetsGrid) return;
        
        const allPresets = PresetManager.getAllPresets();
        elements.presetsGrid.innerHTML = '';
        
        // Renderizar presets em ordem de categoria
        const categoryOrder = ['recommended', 'web', 'security', 'network', 'entertainment', 'basic', 'custom'];
        const categories = {};
        
        Object.values(allPresets).forEach(preset => {
            if (!categories[preset.category]) {
                categories[preset.category] = [];
            }
            categories[preset.category].push(preset);
        });
        
        categoryOrder.forEach(categoryKey => {
            const category = categories[categoryKey];
            if (category && category.length > 0) {
                category.forEach(preset => {
                    const presetCard = this.createPresetCard(preset);
                    elements.presetsGrid.appendChild(presetCard);
                });
            }
        });
        
        this.updateCurrentPresetIndicator();
    },
    
    // Criar card de preset
    createPresetCard(preset) {
        const card = document.createElement('div');
        card.className = `preset-card ${preset.isDefault ? 'default' : 'custom'}`;
        card.setAttribute('data-preset-id', preset.id);
        
        if (state.currentPreset === preset.id) {
            card.classList.add('active');
        }
        
        const configItems = [];
        if (preset.uppercase) configItems.push('A-Z');
        if (preset.lowercase) configItems.push('a-z');
        if (preset.numbers) configItems.push('0-9');
        if (preset.symbols) configItems.push('@#!');
        
        card.innerHTML = `
            <div class="preset-header">
                <div class="preset-name">
                    ${preset.icon} ${preset.name.replace(preset.icon, '').trim()}
                </div>
                ${!preset.isDefault ? `
                    <button class="preset-delete" title="Deletar preset" data-action="delete">
                        ×
                    </button>
                ` : ''}
            </div>
            <div class="preset-description">${preset.description}</div>
            <div class="preset-config">
                <span class="preset-config-item">${preset.length} chars</span>
                ${configItems.map(item => `<span class="preset-config-item">${item}</span>`).join('')}
            </div>
        `;
        
        // Event listeners
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('preset-delete')) {
                this.selectPreset(preset.id);
            }
        });
        
        // Delete button para presets customizados
        const deleteBtn = card.querySelector('.preset-delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deletePreset(preset.id);
            });
        }
        
        return card;
    },
    
    // Selecionar preset
    selectPreset(presetId) {
        if (PresetManager.applyPreset(presetId)) {
            this.updateActiveCard(presetId);
            this.updateCurrentPresetIndicator();
        }
    },
    
    // Atualizar card ativo
    updateActiveCard(activeId) {
        elements.presetsGrid.querySelectorAll('.preset-card').forEach(card => {
            card.classList.remove('active');
        });
        
        const activeCard = elements.presetsGrid.querySelector(`[data-preset-id="${activeId}"]`);
        if (activeCard) {
            activeCard.classList.add('active');
        }
    },
    
    // Atualizar indicador de preset atual
    updateCurrentPresetIndicator() {
        if (!elements.currentPresetName) return;
        
        const currentPreset = PresetManager.getPreset(state.currentPreset);
        if (currentPreset) {
            elements.currentPresetName.textContent = currentPreset.name.replace(/�[�-�]|�[�-�]|�[�-�]|�[�-�]/g, '').trim();
        } else {
            elements.currentPresetName.textContent = 'Personalizado';
        }
    },
    
    // Detectar mudanças nos controles
    onControlsChange() {
        const detectedPreset = PresetManager.detectCurrentPreset();
        this.updateActiveCard(detectedPreset);
        this.updateCurrentPresetIndicator();
    },
    
    // Configurar event listeners
    setupEventListeners() {
        // Botão criar preset customizado
        elements.customPresetBtn?.addEventListener('click', () => {
            const name = prompt('Nome do preset:');
            if (name && name.trim()) {
                PresetManager.createCustomPreset(name.trim(), 'Preset personalizado');
                this.renderPresets();
            }
        });
        
        // Detectar mudanças nos controles
        elements.slider?.addEventListener('input', () => {
            setTimeout(() => this.onControlsChange(), 100);
        });
        
        Object.values(elements.checkboxes).forEach(checkbox => {
            checkbox?.addEventListener('change', () => {
                setTimeout(() => this.onControlsChange(), 100);
            });
        });
    },
    
    // Deletar preset
    deletePreset(presetId) {
        const preset = PresetManager.getPreset(presetId);
        if (!preset || preset.isDefault) return;
        
        if (confirm(`Deletar preset "${preset.name}"?`)) {
            PresetManager.deleteCustomPreset(presetId);
            this.renderPresets();
        }
    },
    
    // Inicializar
    init() {
        this.setupEventListeners();
        this.renderPresets();
        console.log('Interface de presets inicializada');
    }
};

// === SISTEMA DE EXPORTAÇÃO ===

// Gerenciador de Exportação
const ExportManager = {
    // Exportar histórico para formato TXT
    exportToTXT(passwords = null) {
        const data = passwords || state.passwordHistory;
        if (data.length === 0) {
            showNotification('⚠️ Nenhuma senha para exportar', 'error');
            return;
        }
        
        const lines = [
            '='.repeat(60),
            '          GERADOR DE SENHAS - EXPORTAÇÃO TXT',
            '='.repeat(60),
            `Data da Exportação: ${new Date().toLocaleString('pt-BR')}`,
            `Total de Senhas: ${data.length}`,
            `Favoritos: ${data.filter(p => p.isFavorite).length}`,
            '='.repeat(60),
            ''
        ];
        
        data.forEach((item, index) => {
            const date = new Date(item.timestamp).toLocaleString('pt-BR');
            lines.push(`${index + 1}. SENHA: ${item.password}`);
            lines.push(`   Comprimento: ${item.length} caracteres`);
            lines.push(`   Força: ${item.strength}`);
            lines.push(`   Tipos: ${item.types.join(', ')}`);
            lines.push(`   Criada em: ${date}`);
            lines.push(`   Favorito: ${item.isFavorite ? '⭐ Sim' : 'Não'}`);
            lines.push('   ' + '-'.repeat(50));
            lines.push('');
        });
        
        lines.push('='.repeat(60));
        lines.push('Gerado por: Password Generator v2.0');
        lines.push('='.repeat(60));
        
        this.downloadFile(
            lines.join('\n'),
            `senhas-${this.getDateString()}.txt`,
            'text/plain'
        );
        
        showNotification(`📄 ${data.length} senhas exportadas para TXT!`, 'success');
    },
    
    // Exportar histórico para formato CSV
    exportToCSV(passwords = null) {
        const data = passwords || state.passwordHistory;
        if (data.length === 0) {
            showNotification('⚠️ Nenhuma senha para exportar', 'error');
            return;
        }
        
        const headers = ['ID', 'Senha', 'Comprimento', 'Força', 'Tipos de Caracteres', 'Data de Criação', 'Favorito'];
        const rows = [headers.join(';')];
        
        data.forEach(item => {
            const date = new Date(item.timestamp).toLocaleString('pt-BR');
            const types = `"${item.types.join(', ')}"`;
            const password = `"${item.password}"`;
            
            rows.push([
                item.id,
                password,
                item.length,
                item.strength,
                types,
                `"${date}"`,
                item.isFavorite ? 'Sim' : 'Não'
            ].join(';'));
        });
        
        this.downloadFile(
            '\uFEFF' + rows.join('\n'), // BOM para UTF-8
            `senhas-${this.getDateString()}.csv`,
            'text/csv;charset=utf-8'
        );
        
        showNotification(`📊 ${data.length} senhas exportadas para CSV!`, 'success');
    },
    
    // Exportar histórico para formato JSON
    exportToJSON(passwords = null) {
        const data = passwords || state.passwordHistory;
        if (data.length === 0) {
            showNotification('⚠️ Nenhuma senha para exportar', 'error');
            return;
        }
        
        const exportData = {
            metadata: {
                version: '2.0',
                generator: 'Password Generator Pro',
                exportDate: new Date().toISOString(),
                exportDateLocal: new Date().toLocaleString('pt-BR'),
                totalPasswords: data.length,
                favoritesCount: data.filter(p => p.isFavorite).length
            },
            passwords: data.map(item => ({
                id: item.id,
                password: item.password,
                length: item.length,
                strength: item.strength,
                characterTypes: item.types,
                created: new Date(item.timestamp).toISOString(),
                createdLocal: new Date(item.timestamp).toLocaleString('pt-BR'),
                isFavorite: item.isFavorite
            }))
        };
        
        this.downloadFile(
            JSON.stringify(exportData, null, 2),
            `senhas-${this.getDateString()}.json`,
            'application/json'
        );
        
        showNotification(`💾 ${data.length} senhas exportadas para JSON!`, 'success');
    },
    
    // Gerar string de data para filename
    getDateString() {
        const now = new Date();
        return now.toISOString().split('T')[0].replace(/-/g, '');
    },
    
    // Função auxiliar para download
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }
};

// === SISTEMA DE HISTÓRICO DE SENHAS ===

// Gerenciador de histórico de senhas
const HistoryManager = {
    // Carregar histórico do localStorage
    loadHistory() {
        try {
            const saved = localStorage.getItem('password-generator-history');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Validar estrutura dos dados
                if (Array.isArray(parsed)) {
                    state.passwordHistory = parsed.map(item => ({
                        id: item.id || this.generateId(),
                        password: item.password || '',
                        timestamp: item.timestamp || Date.now(),
                        strength: item.strength || 'Unknown',
                        length: item.length || 0,
                        types: item.types || [],
                        isFavorite: item.isFavorite || false
                    }));
                    console.log(`Histórico carregado: ${state.passwordHistory.length} senhas`);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
            state.passwordHistory = [];
        }
    },
    
    // Salvar histórico no localStorage
    saveHistory() {
        try {
            localStorage.setItem('password-generator-history', JSON.stringify(state.passwordHistory));
            console.log('Histórico salvo com sucesso');
        } catch (error) {
            console.error('Erro ao salvar histórico:', error);
        }
    },
    
    // Gerar ID único para senha
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    // Adicionar senha ao histórico
    addPassword(password, strength, types) {
        const newEntry = {
            id: this.generateId(),
            password: password,
            timestamp: Date.now(),
            strength: strength,
            length: password.length,
            types: types,
            isFavorite: false
        };
        
        // Verificar se senha já existe (evitar duplicatas recentes)
        const isDuplicate = state.passwordHistory.some(item => 
            item.password === password && 
            (Date.now() - item.timestamp) < 60000 // 1 minuto
        );
        
        if (!isDuplicate) {
            state.passwordHistory.unshift(newEntry);
            
            // Manter limite máximo
            if (state.passwordHistory.length > state.maxHistorySize) {
                state.passwordHistory = state.passwordHistory.slice(0, state.maxHistorySize);
            }
            
            this.saveHistory();
            this.updateHistoryUI();
            
            console.log('Senha adicionada ao histórico:', newEntry.id);
        }
    },
    
    // Remover senha do histórico
    removePassword(id) {
        const index = state.passwordHistory.findIndex(item => item.id === id);
        if (index !== -1) {
            const removed = state.passwordHistory.splice(index, 1)[0];
            this.saveHistory();
            this.updateHistoryUI();
            showNotification('🗑️ Senha removida do histórico', 'info');
            console.log('Senha removida do histórico:', removed.id);
        }
    },
    
    // Alternar status de favorito
    toggleFavorite(id) {
        const item = state.passwordHistory.find(item => item.id === id);
        if (item) {
            item.isFavorite = !item.isFavorite;
            this.saveHistory();
            this.updateHistoryUI();
            
            const action = item.isFavorite ? 'adicionada aos' : 'removida dos';
            showNotification(`⭐ Senha ${action} favoritos`, 'info');
        }
    },
    
    // Limpar todo o histórico
    clearHistory() {
        if (state.passwordHistory.length === 0) {
            showNotification('ℹ️ Histórico já está vazio', 'info');
            return;
        }
        
        if (confirm('Tem certeza que deseja limpar todo o histórico de senhas?')) {
            state.passwordHistory = [];
            this.saveHistory();
            this.updateHistoryUI();
            showNotification('🧹 Histórico limpo com sucesso', 'success');
        }
    },
    
    // Copiar senha do histórico
    copyFromHistory(password) {
        state.currentPassword = password;
        copyPassword();
    },
    
    // Filtrar histórico
    filterHistory(query = '', showFavoritesOnly = false) {
        let filtered = [...state.passwordHistory];
        
        if (showFavoritesOnly) {
            filtered = filtered.filter(item => item.isFavorite);
        }
        
        if (query.trim()) {
            const lowerQuery = query.toLowerCase();
            filtered = filtered.filter(item => 
                item.password.toLowerCase().includes(lowerQuery) ||
                item.strength.toLowerCase().includes(lowerQuery) ||
                item.length.toString().includes(lowerQuery)
            );
        }
        
        return filtered;
    },
    
    // Obter estatísticas do histórico
    getStats() {
        const total = state.passwordHistory.length;
        const favorites = state.passwordHistory.filter(item => item.isFavorite).length;
        const strengthStats = state.passwordHistory.reduce((acc, item) => {
            acc[item.strength] = (acc[item.strength] || 0) + 1;
            return acc;
        }, {});
        
        return {
            total,
            favorites,
            strengthStats,
            averageLength: total > 0 ? 
                Math.round(state.passwordHistory.reduce((sum, item) => sum + item.length, 0) / total) : 0
        };
    },
    
    // Atualizar interface do histórico
    updateHistoryUI() {
        if (!elements.historyList) return;
        
        const query = elements.historySearch?.value || '';
        const favoritesOnly = elements.showFavoritesOnly?.checked || false;
        const filtered = this.filterHistory(query, favoritesOnly);
        
        // Atualizar estatísticas
        const stats = this.getStats();
        if (elements.statTotal) elements.statTotal.textContent = stats.total;
        if (elements.statFavorites) elements.statFavorites.textContent = stats.favorites;
        if (elements.statAverage) elements.statAverage.textContent = stats.averageLength;
        
        // Limpar lista
        elements.historyList.innerHTML = '';
        
        if (filtered.length === 0) {
            elements.historyList.appendChild(elements.historyEmpty?.cloneNode(true) || document.createElement('div'));
            return;
        }
        
        // Renderizar itens
        filtered.forEach(item => {
            const historyItem = this.createHistoryItem(item);
            elements.historyList.appendChild(historyItem);
        });
    },
    
    // Criar elemento de item do histórico
    createHistoryItem(item) {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.setAttribute('data-id', item.id);
        
        const date = new Date(item.timestamp).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        div.innerHTML = `
            <div class="history-item-password" title="Clique para copiar">
                ${this.maskPassword(item.password)}
            </div>
            <div class="history-item-info">
                <div class="history-item-strength ${this.getStrengthClass(item.strength)}">
                    ${item.strength}
                </div>
                <div class="history-item-meta">
                    ${item.length} chars • ${date}
                </div>
                <div class="history-item-meta">
                    ${item.types.join(', ')}
                </div>
            </div>
            <div class="history-item-actions">
                <button class="history-action-btn copy" title="Copiar senha" data-action="copy">
                    📋
                </button>
                <button class="history-action-btn favorite ${item.isFavorite ? 'active' : ''}" 
                        title="${item.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}" 
                        data-action="favorite">
                    ${item.isFavorite ? '⭐' : '☆'}
                </button>
                <button class="history-action-btn delete" title="Deletar senha" data-action="delete">
                    🗑️
                </button>
            </div>
        `;
        
        // Event listeners
        const passwordEl = div.querySelector('.history-item-password');
        passwordEl.addEventListener('click', () => this.copyFromHistory(item.password));
        
        const actionBtns = div.querySelectorAll('.history-action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.getAttribute('data-action');
                this.handleHistoryAction(action, item.id, item.password);
            });
        });
        
        return div;
    },
    
    // Mascarar senha para exibição
    maskPassword(password) {
        if (password.length <= 8) return password;
        return password.substring(0, 4) + '•'.repeat(password.length - 8) + password.substring(password.length - 4);
    },
    
    // Obter classe CSS para força
    getStrengthClass(strength) {
        const map = {
            'Fraca': 'strength-weak',
            'Razoável': 'strength-fair', 
            'Boa': 'strength-good',
            'Forte': 'strength-strong'
        };
        return map[strength] || '';
    },
    
    // Manipular ações do histórico
    handleHistoryAction(action, id, password) {
        switch(action) {
            case 'copy':
                this.copyFromHistory(password);
                break;
            case 'favorite':
                this.toggleFavorite(id);
                break;
            case 'delete':
                this.removePassword(id);
                break;
        }
    },
    
    // Inicializar sistema de histórico
    init() {
        this.loadHistory();
        console.log('Sistema de histórico inicializado');
    }
};

// === MODAL MANAGEMENT ===

// Gerenciador de modal do histórico
const HistoryModal = {
    isOpen: false,
    
    // Abrir modal
    open() {
        if (!elements.historyModal) return;
        
        this.isOpen = true;
        elements.historyModal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        
        // Foco no campo de busca
        setTimeout(() => {
            elements.historySearch?.focus();
        }, 100);
        
        HistoryManager.updateHistoryUI();
        console.log('Modal do histórico aberto');
    },
    
    // Fechar modal
    close() {
        if (!elements.historyModal) return;
        
        this.isOpen = false;
        elements.historyModal.classList.add('hide');
        document.body.style.overflow = '';
        
        // Limpar busca
        if (elements.historySearch) {
            elements.historySearch.value = '';
        }
        if (elements.showFavoritesOnly) {
            elements.showFavoritesOnly.checked = false;
        }
        
        console.log('Modal do histórico fechado');
    },
    
    // Alternar modal
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    },
    
    // Manipular exportação
    handleExport(format) {
        const query = elements.historySearch?.value || '';
        const favoritesOnly = elements.showFavoritesOnly?.checked || false;
        let dataToExport;
        
        if (query || favoritesOnly) {
            // Exportar apenas dados filtrados
            dataToExport = HistoryManager.filterHistory(query, favoritesOnly);
            const filterDesc = [];
            if (query) filterDesc.push(`busca: "${query}"`);
            if (favoritesOnly) filterDesc.push('apenas favoritos');
            
            if (dataToExport.length === 0) {
                showNotification('⚠️ Nenhuma senha encontrada com os filtros aplicados', 'error');
                return;
            }
            
            showNotification(`🔍 Exportando ${dataToExport.length} senhas filtradas (${filterDesc.join(', ')})`, 'info');
        } else {
            // Exportar todos os dados
            dataToExport = state.passwordHistory;
        }
        
        // Chamar função de exportação apropriada
        switch(format) {
            case 'txt':
                ExportManager.exportToTXT(dataToExport);
                break;
            case 'csv':
                ExportManager.exportToCSV(dataToExport);
                break;
            case 'json':
                ExportManager.exportToJSON(dataToExport);
                break;
            default:
                showNotification('❌ Formato de exportação inválido', 'error');
        }
    },
    
    // Configurar event listeners
    setupEventListeners() {
        // Botão abrir histórico
        elements.historyBtn?.addEventListener('click', () => this.open());
        
        // Botão fechar
        elements.historyClose?.addEventListener('click', () => this.close());
        
        // Clique no backdrop
        elements.historyBackdrop?.addEventListener('click', () => this.close());
        
        // Campo de busca
        elements.historySearch?.addEventListener('input', 
            debounce(() => HistoryManager.updateHistoryUI(), 300)
        );
        
        // Botão limpar busca
        elements.searchClear?.addEventListener('click', () => {
            if (elements.historySearch) {
                elements.historySearch.value = '';
                HistoryManager.updateHistoryUI();
                elements.historySearch.focus();
            }
        });
        
        // Checkbox favoritos
        elements.showFavoritesOnly?.addEventListener('change', () => {
            HistoryManager.updateHistoryUI();
        });
        
        // Botão limpar histórico
        elements.clearHistoryBtn?.addEventListener('click', () => {
            HistoryManager.clearHistory();
        });
        
        // Sistema de exportação
        elements.exportBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.exportMenu?.classList.toggle('hide');
        });
        
        // Fechar menu de export ao clicar fora
        document.addEventListener('click', (e) => {
            if (!elements.exportBtn?.contains(e.target) && !elements.exportMenu?.contains(e.target)) {
                elements.exportMenu?.classList.add('hide');
            }
        });
        
        // Opções de exportação
        elements.exportMenu?.addEventListener('click', (e) => {
            if (e.target.classList.contains('export-option')) {
                const format = e.target.getAttribute('data-format');
                this.handleExport(format);
                elements.exportMenu.classList.add('hide');
            }
        });
        
        // Atalhos de teclado para modal
        document.addEventListener('keydown', (e) => {
            if (this.isOpen) {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    this.close();
                }
                if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                    e.preventDefault();
                    elements.historySearch?.focus();
                }
            }
        });
    },
    
    // Inicializar modal
    init() {
        this.setupEventListeners();
        console.log('Modal do histórico inicializado');
    }
};

// === SISTEMA DE TEMAS ===

// Gerenciador de temas
const ThemeManager = {
    // Detectar preferência do sistema
    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    },
    
    // Obter tema salvo ou preferência do sistema
    getSavedTheme() {
        const saved = localStorage.getItem('password-generator-theme');
        return saved || this.getSystemTheme();
    },
    
    // Salvar tema no localStorage
    saveTheme(theme) {
        localStorage.setItem('password-generator-theme', theme);
        state.currentTheme = theme;
    },
    
    // Aplicar tema ao documento
    applyTheme(theme) {
        const root = document.documentElement;
        
        if (theme === 'light') {
            root.setAttribute('data-theme', 'light');
        } else {
            root.removeAttribute('data-theme');
        }
        
        // Atualizar estado do switch
        if (elements.themeSwitch) {
            elements.themeSwitch.checked = theme === 'light';
        }
        
        this.saveTheme(theme);
        
        // Adicionar classe de transição temporária
        document.body.classList.add('theme-transitioning');
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
        
        console.log(`Tema alterado para: ${theme}`);
    },
    
    // Alternar entre temas
    toggleTheme() {
        const currentTheme = state.currentTheme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        
        // Mostrar notificação
        const themeLabel = newTheme === 'light' ? 'Claro' : 'Escuro';
        showNotification(`🎨 Tema alterado para ${themeLabel}`, 'info');
    },
    
    // Inicializar sistema de temas
    init() {
        const savedTheme = this.getSavedTheme();
        this.applyTheme(savedTheme);
        
        // Listener para mudanças na preferência do sistema
        const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
        mediaQuery.addEventListener('change', (e) => {
            // Só aplicar automaticamente se não há preferência salva
            if (!localStorage.getItem('password-generator-theme')) {
                const systemTheme = e.matches ? 'light' : 'dark';
                this.applyTheme(systemTheme);
            }
        });
        
        console.log('Sistema de temas inicializado:', savedTheme);
    }
};

// === SISTEMA PWA ===

// Gerenciador PWA
const PWAManager = {
    deferredPrompt: null,
    isInstalled: false,
    swRegistration: null,
    
    // Inicializar PWA
    init() {
        this.showSplashScreen();
        this.registerServiceWorker();
        this.setupInstallPrompt();
        this.checkInstallStatus();
        this.setupPWAEventListeners();
        this.handleURLParams();
        this.optimizePerformance();
        
        // Esconder splash screen após inicialização
        setTimeout(() => {
            this.hideSplashScreen();
        }, 1500);
        
        console.log('PWA Manager inicializado');
    },
    
    // Mostrar splash screen
    showSplashScreen() {
        const splashScreen = document.querySelector('#splash-screen');
        if (splashScreen && this.isInstalled) {
            splashScreen.classList.remove('hide');
        }
    },
    
    // Esconder splash screen
    hideSplashScreen() {
        const splashScreen = document.querySelector('#splash-screen');
        if (splashScreen) {
            splashScreen.classList.add('hide');
            // Remove do DOM após animação
            setTimeout(() => {
                if (splashScreen.parentNode) {
                    splashScreen.remove();
                }
            }, 500);
        }
    },
    
    // Otimizações de performance
    optimizePerformance() {
        // Preload de recursos críticos
        this.preloadCriticalResources();
        
        // Otimizar scroll performance
        if ('IntersectionObserver' in window) {
            this.setupLazyLoading();
        }
        
        // Otimizar eventos de resize
        this.optimizeResizeEvents();
        
        // Memory cleanup
        this.setupMemoryCleanup();
    },
    
    // Preload de recursos críticos
    preloadCriticalResources() {
        // Preload de fontes
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
        fontLink.as = 'style';
        document.head.appendChild(fontLink);
        
        // Preconnect para recursos externos
        const preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = 'https://fonts.googleapis.com';
        document.head.appendChild(preconnect);
    },
    
    // Setup lazy loading para elementos
    setupLazyLoading() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        // Observar imagens com data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            observer.observe(img);
        });
    },
    
    // Otimizar eventos de resize
    optimizeResizeEvents() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Recalcular layouts apenas quando necessário
                this.handleResize();
            }, 250);
        });
    },
    
    // Manipular redimensionamento
    handleResize() {
        // Recalcular dimensões de elementos responsivos
        const presetsGrid = document.querySelector('.presets-grid');
        if (presetsGrid) {
            presetsGrid.style.contain = 'layout';
        }
    },
    
    // Setup de limpeza de memória
    setupMemoryCleanup() {
        // Limpeza periódica de dados antigos
        setInterval(() => {
            this.cleanupOldData();
        }, 300000); // 5 minutos
    },
    
    // Limpeza de dados antigos
    cleanupOldData() {
        try {
            // Remover senhas antigas do histórico (manter apenas últimas 100)
            const history = JSON.parse(localStorage.getItem('password-generator-history') || '[]');
            if (history.length > 100) {
                const trimmedHistory = history.slice(-100);
                localStorage.setItem('password-generator-history', JSON.stringify(trimmedHistory));
                console.log('[PWA] Histórico limpo - mantidas últimas 100 senhas');
            }
        } catch (error) {
            console.error('[PWA] Erro na limpeza de dados:', error);
        }
    },
    
    // Registrar Service Worker
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('./sw.js');
                this.swRegistration = registration;
                
                console.log('[PWA] Service Worker registrado:', registration.scope);
                
                // Verificar atualizações
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                this.showUpdateNotification();
                            }
                        });
                    }
                });
                
                // Ouvir mensagens do Service Worker
                navigator.serviceWorker.addEventListener('message', (event) => {
                    this.handleSWMessage(event.data);
                });
                
            } catch (error) {
                console.error('[PWA] Erro ao registrar Service Worker:', error);
            }
        }
    },
    
    // Configurar prompt de instalação
    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('[PWA] Prompt de instalação detectado');
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });
        
        window.addEventListener('appinstalled', () => {
            console.log('[PWA] App instalado');
            this.isInstalled = true;
            this.hideInstallButton();
            showNotification('🎉 App instalado com sucesso!', 'success');
        });
    },
    
    // Verificar status de instalação
    checkInstallStatus() {
        // Verificar se está sendo executado como PWA
        if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
            this.isInstalled = true;
            console.log('[PWA] Executando como app instalado');
        }
        
        // Verificar se está no iOS Safari
        if (window.navigator.standalone === true) {
            this.isInstalled = true;
            console.log('[PWA] Executando como PWA no iOS');
        }
    },
    
    // Configurar event listeners PWA
    setupPWAEventListeners() {
        // Botão de instalação (se existir)
        const installBtn = document.querySelector('#install-btn');
        if (installBtn) {
            installBtn.addEventListener('click', () => this.promptInstall());
        }
        
        // Botão de atualização (se existir)
        const updateBtn = document.querySelector('#update-btn');
        if (updateBtn) {
            updateBtn.addEventListener('click', () => this.updateApp());
        }
        
        // Detectar conexão online/offline
        window.addEventListener('online', () => {
            this.handleOnlineStatus(true);
        });
        
        window.addEventListener('offline', () => {
            this.handleOnlineStatus(false);
        });
        
        // Verificar status inicial
        this.handleOnlineStatus(navigator.onLine);
    },
    
    // Manipular status online/offline
    handleOnlineStatus(isOnline) {
        const offlineIndicator = document.querySelector('#offline-indicator');
        
        if (isOnline) {
            if (offlineIndicator) {
                offlineIndicator.classList.add('hide');
            }
            showNotification('🌐 Conectado à internet', 'success');
            this.syncWhenOnline();
        } else {
            if (offlineIndicator) {
                offlineIndicator.classList.remove('hide');
            }
            showNotification('📴 Modo offline ativo - Todas as funções disponíveis!', 'info');
        }
        
        console.log('[PWA] Status de conexão:', isOnline ? 'Online' : 'Offline');
    },
    
    // Manipular parâmetros de URL (PWA shortcuts)
    handleURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get('action');
        
        switch (action) {
            case 'generate':
                // Gerar senha automaticamente
                setTimeout(() => {
                    if (Object.values(elements.checkboxes).some(cb => cb.checked)) {
                        generatePassword();
                    }
                }, 500);
                break;
            case 'history':
                // Abrir histórico
                setTimeout(() => {
                    HistoryModal.open();
                }, 500);
                break;
        }
    },
    
    // Mostrar botão de instalação
    showInstallButton() {
        let installBtn = document.querySelector('#install-btn');
        if (!installBtn) {
            installBtn = document.createElement('button');
            installBtn.id = 'install-btn';
            installBtn.className = 'btn btn-outline';
            installBtn.innerHTML = '📱 Instalar App';
            installBtn.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                background: var(--primary-color);
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 25px;
                font-weight: 500;
                box-shadow: var(--shadow-primary);
                transition: var(--transition);
                cursor: pointer;
            `;
            
            installBtn.addEventListener('click', () => this.promptInstall());
            document.body.appendChild(installBtn);
        }
        installBtn.style.display = 'block';
    },
    
    // Esconder botão de instalação
    hideInstallButton() {
        const installBtn = document.querySelector('#install-btn');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    },
    
    // Prompt de instalação
    async promptInstall() {
        if (!this.deferredPrompt) {
            showNotification('Instalação não disponível neste navegador', 'warning');
            return;
        }
        
        try {
            const result = await this.deferredPrompt.prompt();
            console.log('[PWA] Resultado do prompt:', result.outcome);
            
            if (result.outcome === 'accepted') {
                console.log('[PWA] Usuário aceitou a instalação');
            } else {
                console.log('[PWA] Usuário recusou a instalação');
            }
            
            this.deferredPrompt = null;
            this.hideInstallButton();
            
        } catch (error) {
            console.error('[PWA] Erro no prompt de instalação:', error);
            showNotification('Erro ao tentar instalar o app', 'error');
        }
    },
    
    // Mostrar notificação de atualização
    showUpdateNotification() {
        const updateNotification = document.createElement('div');
        updateNotification.className = 'update-notification';
        updateNotification.innerHTML = `
            <div class="update-content">
                <span>🔄 Nova versão disponível</span>
                <button id="update-btn" class="btn btn-small">Atualizar</button>
                <button id="dismiss-update" class="btn btn-outline btn-small">Depois</button>
            </div>
        `;
        
        updateNotification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 16px;
            box-shadow: var(--shadow-primary);
            z-index: 10001;
            display: flex;
            align-items: center;
            gap: 12px;
        `;
        
        document.body.appendChild(updateNotification);
        
        // Event listeners
        updateNotification.querySelector('#update-btn').addEventListener('click', () => {
            this.updateApp();
            updateNotification.remove();
        });
        
        updateNotification.querySelector('#dismiss-update').addEventListener('click', () => {
            updateNotification.remove();
        });
        
        // Auto remove após 10 segundos
        setTimeout(() => {
            if (updateNotification.parentNode) {
                updateNotification.remove();
            }
        }, 10000);
    },
    
    // Atualizar aplicação
    async updateApp() {
        if (this.swRegistration && this.swRegistration.waiting) {
            // Enviar mensagem para o Service Worker
            this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
            
            // Recarregar página após atualização
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                window.location.reload();
            });
            
            showNotification('⚡ Atualizando aplicação...', 'info');
        }
    },
    
    // Manipular mensagens do Service Worker
    handleSWMessage(data) {
        switch (data.type) {
            case 'CACHE_UPDATED':
                console.log('[PWA] Cache atualizado');
                break;
            case 'OFFLINE_READY':
                showNotification('📴 App pronto para uso offline', 'info');
                break;
            default:
                console.log('[PWA] Mensagem do SW:', data);
        }
    },
    
    // Sincronizar quando voltar online
    syncWhenOnline() {
        if (this.swRegistration && 'sync' in window.ServiceWorkerRegistration.prototype) {
            this.swRegistration.sync.register('background-sync-passwords');
        }
    },
    
    // Obter informações PWA
    getPWAInfo() {
        return {
            isInstalled: this.isInstalled,
            hasServiceWorker: !!this.swRegistration,
            isOnline: navigator.onLine,
            canInstall: !!this.deferredPrompt
        };
    },
    
    // Limpar cache PWA
    async clearCache() {
        if (this.swRegistration) {
            try {
                const messageChannel = new MessageChannel();
                const promise = new Promise((resolve) => {
                    messageChannel.port1.onmessage = (event) => {
                        resolve(event.data);
                    };
                });
                
                this.swRegistration.active.postMessage(
                    { type: 'CLEAR_CACHE' }, 
                    [messageChannel.port2]
                );
                
                const result = await promise;
                if (result.success) {
                    showNotification('🗑️ Cache limpo com sucesso', 'success');
                    setTimeout(() => window.location.reload(), 1000);
                }
            } catch (error) {
                console.error('[PWA] Erro ao limpar cache:', error);
                showNotification('Erro ao limpar cache', 'error');
            }
        }
    }
};

// Função de debounce para otimizar performance
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Inicialização
function init() {
    if (!elements.slider || !elements.button) {
        console.error('Elementos essenciais não encontrados');
        return;
    }
    
    // Inicializar sistemas
    ThemeManager.init();
    HistoryManager.init();
    HistoryModal.init();
    PresetManager.init();
    PresetUI.init();
    PWAManager.init();
    
    elements.sizeDisplay.textContent = elements.slider.value;
    setupEventListeners();
    updateGenerateButtonState();
}

// Configurar event listeners
function setupEventListeners() {
    // Slider com debounce para melhor performance
    const debouncedSliderUpdate = debounce((value) => {
        elements.sizeDisplay.textContent = value;
        if (state.currentPassword) {
            generatePassword(); // Regenera automaticamente se já existe senha
        }
    }, CONFIG.debounceTime);
    
    elements.slider.addEventListener('input', (e) => {
        debouncedSliderUpdate(e.target.value);
    });
    
    // Botão de gerar senha
    elements.button.addEventListener('click', generatePassword);
    
    // Botão de copiar
    if (elements.copyBtn) {
        elements.copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            copyPassword();
        });
    }
    
    // Container da senha para copiar
    elements.containerPassword.addEventListener('click', copyPassword);
    
    // Theme switch
    if (elements.themeSwitch) {
        elements.themeSwitch.addEventListener('change', () => {
            ThemeManager.toggleTheme();
        });
    }
    
    // Checkboxes para regenerar senha automaticamente
    Object.values(elements.checkboxes).forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateGenerateButtonState();
            if (state.currentPassword) {
                generatePassword();
            }
        });
    });
    
    // Teclas de atalho
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Atalhos de teclado
function handleKeyboardShortcuts(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'g':
            case 'G':
                e.preventDefault();
                generatePassword();
                break;
            case 'c':
            case 'C':
                if (state.currentPassword) {
                    e.preventDefault();
                    copyPassword();
                }
                break;
            case 't':
            case 'T':
                e.preventDefault();
                ThemeManager.toggleTheme();
                break;
            case 'h':
            case 'H':
                e.preventDefault();
                HistoryModal.toggle();
                break;
        }
    }
    
    if (e.key === 'Enter' && e.target === elements.slider) {
        generatePassword();
    }
}

// Obter charset selecionado
function getSelectedCharset() {
    let charset = '';
    
    if (elements.checkboxes.lowercase.checked) charset += CONFIG.charset.lowercase;
    if (elements.checkboxes.uppercase.checked) charset += CONFIG.charset.uppercase;
    if (elements.checkboxes.numbers.checked) charset += CONFIG.charset.numbers;
    if (elements.checkboxes.symbols.checked) charset += CONFIG.charset.symbols;
    
    return charset;
}

// Atualizar estado do botão de gerar
function updateGenerateButtonState() {
    const hasSelectedOptions = Object.values(elements.checkboxes).some(cb => cb.checked);
    elements.button.disabled = !hasSelectedOptions;
    
    if (!hasSelectedOptions) {
        elements.button.innerHTML = '<span class="button-text">⚠️ Selecione ao menos uma opção</span>';
    } else {
        elements.button.innerHTML = '<span class="button-text">🔐 Gerar Senha</span>';
    }
}

// Algoritmo otimizado de geração de senha
function generateSecurePassword(length, charset) {
    if (!charset || charset.length === 0) {
        throw new Error('Charset inválido');
    }
    
    // Usar crypto.getRandomValues para melhor segurança quando disponível
    if (window.crypto && window.crypto.getRandomValues) {
        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);
        
        return Array.from(array, (x) => charset[x % charset.length]).join('');
    }
    
    // Fallback para Math.random()
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return password;
}

// Calcular força da senha
function calculatePasswordStrength(password) {
    let score = 0;
    let feedback = [];
    
    // Critérios de pontuação
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Pontuação adicional para senhas muito longas
    if (password.length >= 16) score += 1;
    if (password.length >= 20) score += 1;
    
    // Determinar força
    let strength, className;
    if (score <= 2) {
        strength = 'Fraca';
        className = 'strength-weak';
    } else if (score <= 4) {
        strength = 'Razoável';
        className = 'strength-fair';
    } else if (score <= 6) {
        strength = 'Boa';
        className = 'strength-good';
    } else {
        strength = 'Forte';
        className = 'strength-strong';
    }
    
    return { strength, className, score };
}

// Atualizar indicador de força
function updateStrengthIndicator(password) {
    const { strength, className } = calculatePasswordStrength(password);
    
    elements.strengthLevel.textContent = strength;
    elements.strengthLevel.className = className;
    elements.strengthIndicator.className = `strength-indicator ${className}`;
}

// Função principal de geração de senha
function generatePassword() {
    if (state.isGenerating) return;
    
    try {
        state.isGenerating = true;
        elements.button.disabled = true;
        elements.button.innerHTML = '<span class="button-text">⏳ Gerando...</span>';
        
        const length = parseInt(elements.slider.value);
        const charset = getSelectedCharset();
        
        if (!charset) {
            showNotification('Selecione pelo menos um tipo de caractere!', 'error');
            return;
        }
        
        // Simular pequeno delay para feedback visual
        setTimeout(() => {
            const newPassword = generateSecurePassword(length, charset);
            
            state.currentPassword = newPassword;
            elements.passwordElement.textContent = newPassword;
            
            // Mostrar container com animação
            elements.containerPassword.classList.remove('hide');
            
            // Atualizar indicador de força
            const strengthInfo = calculatePasswordStrength(newPassword);
            updateStrengthIndicator(newPassword);
            
            // Adicionar ao histórico
            const selectedTypes = [];
            if (elements.checkboxes.uppercase.checked) selectedTypes.push('Maiúsculas');
            if (elements.checkboxes.lowercase.checked) selectedTypes.push('Minúsculas');
            if (elements.checkboxes.numbers.checked) selectedTypes.push('Números');
            if (elements.checkboxes.symbols.checked) selectedTypes.push('Símbolos');
            
            HistoryManager.addPassword(newPassword, strengthInfo.strength, selectedTypes);
            
            // Resetar botão
            elements.button.disabled = false;
            elements.button.innerHTML = '<span class="button-text">🔐 Gerar Nova Senha</span>';
            
            state.isGenerating = false;
            
            console.log('Senha gerada com sucesso:', newPassword.length, 'caracteres');
        }, 200);
        
    } catch (error) {
        console.error('Erro ao gerar senha:', error);
        showNotification('Erro ao gerar senha. Tente novamente.', 'error');
        
        elements.button.disabled = false;
        updateGenerateButtonState();
        state.isGenerating = false;
    }
}

// Função melhorada para copiar senha
function copyPassword() {
    if (!state.currentPassword) {
        showNotification('Nenhuma senha para copiar!', 'error');
        return;
    }
    
    // Múltiplos métodos de cópia para compatibilidade
    const copyMethods = [
        // Método moderno
        () => navigator.clipboard.writeText(state.currentPassword),
        
        // Método legacy
        () => {
            const textArea = document.createElement('textarea');
            textArea.value = state.currentPassword;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (!success) throw new Error('execCommand failed');
            return Promise.resolve();
        }
    ];
    
    // Tentar métodos em ordem
    async function attemptCopy() {
        for (const method of copyMethods) {
            try {
                await method();
                showNotification('✅ Senha copiada com sucesso!', 'success');
                
                // Feedback visual no botão de copiar
                if (elements.copyBtn) {
                    const originalText = elements.copyBtn.textContent;
                    elements.copyBtn.textContent = '✓';
                    elements.copyBtn.style.color = 'var(--success-color)';
                    
                    setTimeout(() => {
                        elements.copyBtn.textContent = originalText;
                        elements.copyBtn.style.color = '';
                    }, 1500);
                }
                
                return;
            } catch (error) {
                console.warn('Método de cópia falhou:', error);
                continue;
            }
        }
        
        // Se todos os métodos falharam
        showNotification('❌ Erro ao copiar senha. Copie manualmente.', 'error');
        
        // Selecionar texto como fallback
        const range = document.createRange();
        range.selectNode(elements.passwordElement);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
    
    attemptCopy();
}

// Sistema de notificações melhorado
function showNotification(message, type = 'info') {
    // Remover notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos inline para a notificação
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        fontSize: '14px',
        zIndex: '10000',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // Cores por tipo
    const colors = {
        success: '#4caf50',
        error: '#f44336',
        info: '#2196f3',
        warning: '#ff9800'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animação de entrada
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    });
    
    // Remover após delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Event listeners para carregamento da página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Gerenciamento de erros globais
window.addEventListener('error', (e) => {
    console.error('Erro na aplicação:', e.error);
    showNotification('Ocorreu um erro inesperado.', 'error');
});

// Exposar funções para debug (apenas em desenvolvimento)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.passwordGenerator = {
        generatePassword,
        copyPassword,
        state,
        elements,
        CONFIG
    };
}